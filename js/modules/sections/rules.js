export function renderRulesSection() {
  const el = document.getElementById('rules-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">📋 Tournament Rules</h2>
    <div class="notice-board" id="rules-content">Loading...</div>
  `;
}

