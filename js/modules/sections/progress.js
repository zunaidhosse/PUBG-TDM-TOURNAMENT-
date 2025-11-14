export function renderProgressSection() {
  const el = document.getElementById('progress-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">📈 Tournament Progress</h2>
    <div id="tournament-progress">Loading...</div>
  `;
}

