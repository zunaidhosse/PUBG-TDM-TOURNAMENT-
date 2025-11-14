import { db } from '../core/firebase.js';

export function initFAQ() {
  db().ref('faq').on('value', (snapshot) => {
    const el = document.getElementById('faq-list');
    if (!el) return;
    const faqs = [];
    snapshot.forEach(child => faqs.push({ id: child.key, ...child.val() }));
    
    if (faqs.length === 0) {
      el.innerHTML = '<p class="empty-message">No FAQs available yet</p>';
      return;
    }

    el.innerHTML = faqs.map(faq => `
      <div class="registration-card" style="margin-bottom: 12px;">
        <h3 style="color: #3498db; margin-bottom: 8px;">❓ ${faq.question}</h3>
        <p style="color: #ecf0f1; line-height: 1.6;">${faq.answer}</p>
      </div>
    `).join('');
  });
}

