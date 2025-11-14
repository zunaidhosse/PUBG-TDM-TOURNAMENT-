export function renderMatches() {
  const el = document.getElementById('matches-admin-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">⚔️ Matches
      <button class="btn btn-danger" id="delete-all-matches-btn" style="margin-left:8px;">Delete All Matches</button>
      <button class="btn btn-primary" id="generate-round-btn" style="margin-left:8px;">Generate Round 1 (64 teams)</button>
    </h2>
    <div id="admin-matches-list"><p class="empty-message">Loading...</p></div>
  `;
}

