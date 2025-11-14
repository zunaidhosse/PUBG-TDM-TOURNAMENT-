export function renderAchievementsSection() {
  const el = document.getElementById('achievements-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">🏅 My Achievements</h2>
    <div id="achievements-grid">Loading...</div>
  `;
}

