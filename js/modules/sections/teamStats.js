export function renderTeamStatsSection() {
  const el = document.getElementById('team-stats-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">📊 Team Statistics</h2>
    <div class="teams-search collapsed">
      <input type="text" id="stats-search" placeholder="Search team">
      <button class="btn" id="stats-search-toggle">🔍</button>
    </div>
    <div id="team-stats-list">Loading...</div>
  `;
  
  // Add event listener safely after render
  setTimeout(() => {
    const searchToggle = document.getElementById('stats-search-toggle');
    const searchContainer = searchToggle?.parentElement;
    if (searchToggle && searchContainer) {
      searchToggle.addEventListener('click', () => {
        searchContainer.classList.toggle('collapsed');
      });
    }
  }, 0);
}

