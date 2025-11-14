export function renderRankingsSection() {
  const el = document.getElementById('rankings-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">🏅 Rankings</h2>
    <div class="registrations-list" id="rankings-list">Loading...</div>
  `;
}

