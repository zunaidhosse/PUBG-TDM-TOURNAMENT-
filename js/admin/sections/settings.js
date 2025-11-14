export function renderSettings() {
  const el = document.getElementById('settings-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">⚙️ Tournament Settings</h2>
    <div class="form-group">
      <label for="registration-status">Registration Status</label>
      <select id="registration-status">
        <option value="true">Open</option>
        <option value="false">Closed</option>
      </select>
    </div>
    <div class="form-group">
      <label for="team-limit">Team Limit</label>
      <select id="team-limit">
        <option value="16">16 Teams</option>
        <option value="32">32 Teams</option>
        <option value="64">64 Teams</option>
        <option value="128">128 Teams</option>
      </select>
    </div>
    <div class="form-group">
      <label for="tournament-type">Tournament Type</label>
      <select id="tournament-type">
        <option value="1v1">1v1</option>
        <option value="2v2">2v2</option>
        <option value="4v4">4v4</option>
      </select>
    </div>
    <button class="btn btn-primary" id="save-settings-btn">Save Settings</button>
  `;
}

