export function renderFAQSection() {
  const el = document.getElementById('faq-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">❓ FAQ</h2>
    <div id="faq-list">Loading...</div>
  `;
}

