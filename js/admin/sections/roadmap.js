export function renderRoadmap() {
  const el = document.getElementById('roadmap-admin-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">🗺️ Roadmap</h2>
    <div id="admin-roadmap-display"><p class="empty-message">Loading...</p></div>
  `;
}

