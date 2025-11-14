export function renderLiveFeedSection() {
  const el = document.getElementById('live-feed-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">📡 Live Match Feed</h2>
    <div id="live-feed-list">Loading...</div>
  `;
}

