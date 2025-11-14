export function renderTeamsSection() {
  const el = document.getElementById('registered-teams-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">👥 Registered Teams</h2>
    <div class="tournament-info">
        <div class="info-card"><h3>Total Teams</h3><p id="total-teams-count">0</p></div>
        <div class="info-card"><h3>Approved</h3><p id="approved-teams-count">0</p></div>
        <div class="info-card"><h3>Pending</h3><p id="pending-teams-count">0</p></div>
    </div>
    <div class="filter-buttons" id="team-status-filters">
        <button class="btn btn-filter active" data-filter="All">All</button>
        <button class="btn btn-filter" data-filter="Approved">Approved</button>
        <button class="btn btn-filter" data-filter="Pending">Pending</button>
    </div>
    <div class="teams-search collapsed">
      <input type="text" id="teams-search" placeholder="Search username/ID">
      <button class="btn" id="teams-search-toggle">🔍</button>
    </div>
    <div class="registrations-list" id="registrations-list">Loading...</div>
  `;
  
  // Add event listener safely after render
  setTimeout(() => {
    const searchToggle = document.getElementById('teams-search-toggle');
    const searchContainer = searchToggle?.parentElement;
    if (searchToggle && searchContainer) {
      searchToggle.addEventListener('click', () => {
        searchContainer.classList.toggle('collapsed');
      });
    }
  }, 0);
}

