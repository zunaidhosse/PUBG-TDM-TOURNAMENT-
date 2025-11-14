export function renderDashboard() {
  const el = document.getElementById('dashboard-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">📊 Dashboard</h2>
    <div class="registrations-list" id="stats-grid">
      <div class="registration-card"><h3 id="total-teams">0</h3><p>Total Teams</p></div>
      <div class="registration-card"><h3 id="approved-teams">0</h3><p>Approved Teams</p></div>
      <div class="registration-card"><h3 id="pending-teams">0</h3><p>Pending Teams</p></div>
      <div class="registration-card"><h3 id="total-matches">0</h3><p>Total Matches</p></div>
      <div class="registration-card"><h3 id="total-users">0</h3><p>Total Signups</p></div>
    </div>
    <div class="section" id="room-admin-section" style="margin-top: 20px; display: block;">
      <h3 class="section-title">🎮 Room Code Management</h3>
      <div class="form-group">
        <label for="room-code-input">Room ID</label>
        <input type="text" id="room-code-input" placeholder="Enter room ID">
      </div>
      <div class="form-group">
        <label for="room-pass-input">Password (Optional)</label>
        <input type="text" id="room-pass-input" placeholder="Enter password">
      </div>
      <div class="form-group">
        <label for="room-map-input">Map (Optional)</label>
        <input type="text" id="room-map-input" placeholder="e.g., Warehouse">
      </div>
      <div class="form-group">
        <label for="room-mode-input">Mode (Optional)</label>
        <input type="text" id="room-mode-input" placeholder="e.g., TDM">
      </div>
      <div class="form-group">
        <label for="room-note-input">Note (Optional)</label>
        <input type="text" id="room-note-input" placeholder="e.g., Finals - Join 5 min early">
      </div>
      <div class="form-group">
        <label>Status</label>
        <select id="room-active-select">
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>
      <button class="btn btn-success" id="save-room-btn">Save Room Code</button>
      <button class="btn btn-danger" id="clear-room-btn" style="margin-left: 8px;">Clear Room</button>
    </div>
  `;
}

