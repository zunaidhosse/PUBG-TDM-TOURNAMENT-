export function renderTeams() {
  const el = document.getElementById('teams-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">👥 Team Management</h2>
    <div class="form-group">
      <label for="delete-team-name">Force Delete by Team Name</label>
      <div style="display:flex; gap:8px;">
        <input type="text" id="delete-team-name" placeholder="Exact team name">
        <button class="btn btn-danger" id="force-delete-btn">Force Delete</button>
        <button class="btn btn-danger" id="delete-all-btn">Delete All</button>
      </div>
    </div>
    <div style="margin: 10px 0 16px;">
      <button class="btn btn-primary" id="auto-register-btn">Auto Registered</button>
    </div>
    <div class="registrations-list" id="registrations-list"></div>
  `;
}

