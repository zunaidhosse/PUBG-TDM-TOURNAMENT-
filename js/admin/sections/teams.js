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
    <p style="color:#95a5a6;margin-top:8px;font-size:0.9rem;">💡 Players provide WhatsApp contact for coordination</p>
    <div class="registrations-list" id="registrations-list"></div>
  `;
}

