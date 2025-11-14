export function renderMyMatchSection() {
  const el = document.getElementById('my-match-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">⚡ My Next Match</h2>
    <div id="my-match-display">Loading...</div>
  `;
}

