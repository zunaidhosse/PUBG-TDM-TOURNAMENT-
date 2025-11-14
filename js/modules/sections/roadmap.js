export function renderRoadmapSection() {
  const el = document.getElementById('roadmap-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">🗺️ Tournament Roadmap</h2>
    <div style="display:flex; justify-content:flex-end; margin-bottom:8px;">
     <button class="btn btn-primary" id="dynamic-roadmap-btn">Dynamic Roadmap</button>
   </div>
    <div id="roadmap-display">Loading bracket...</div>
  `;
}

