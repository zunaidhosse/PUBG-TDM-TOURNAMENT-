import { db } from '../../core/firebase.js';
import { toast } from './toast.js';

export function initFAQAdmin() {
  const questionIn = document.getElementById('faq-question');
  const answerIn = document.getElementById('faq-answer');
  const addBtn = document.getElementById('add-faq-btn');
  const list = document.getElementById('faq-admin-list');

  if (addBtn) {
    addBtn.addEventListener('click', async () => {
      const question = (questionIn?.value || '').trim();
      const answer = (answerIn?.value || '').trim();
      if (!question || !answer) return toast('danger', 'Fill both fields');
      try {
        await db().ref('faq').push({ question, answer, timestamp: Date.now() });
        toast('success', 'FAQ added');
        if (questionIn) questionIn.value = '';
        if (answerIn) answerIn.value = '';
      } catch {
        toast('danger', 'Failed to add FAQ');
      }
    });
  }

  db().ref('faq').on('value', snap => {
    if (!list) return;
    list.innerHTML = '';
    const items = [];
    snap.forEach(c => items.push({ id: c.key, ...c.val() }));
    items.forEach(faq => {
      const div = document.createElement('div');
      div.className = 'registration-card';
      div.innerHTML = `<h4>${faq.question}</h4><p style="margin:6px 0;">${faq.answer}</p><button class="btn btn-danger">Delete</button>`;
      div.querySelector('.btn-danger').addEventListener('click', () => {
        db().ref('faq/' + faq.id).remove().then(() => toast('success', 'Deleted')).catch(() => toast('danger', 'Failed'));
      });
      list.appendChild(div);
    });
  });
}

