export function renderWinnersSection() {
  const el = document.getElementById('winners-section');
  if (!el) return;
  
  el.innerHTML = `
    <div class="winner-section">
        <h2>🏆 Hall of Champions</h2>
        <p style="color: #ecf0f1;">Celebrating our tournament winners and their achievements</p>
    </div>
    <div class="winners-grid" id="winners-grid">Loading...</div>
  `;
}

