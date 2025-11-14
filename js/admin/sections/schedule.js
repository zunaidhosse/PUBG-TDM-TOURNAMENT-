export function renderSchedule() {
  const el = document.getElementById('schedule-admin-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">📅 Schedule Management</h2>
    <div class="form-group">
      <label for="schedule-round">Round/Event Name</label>
      <input type="text" id="schedule-round" placeholder="e.g., Round 1">
    </div>
    <div class="form-group">
      <label for="schedule-time">Date & Time</label>
      <input type="datetime-local" id="schedule-time">
    </div>
    <div class="form-group">
      <label for="schedule-desc">Description (Optional)</label>
      <textarea id="schedule-desc" rows="2" placeholder="Match details"></textarea>
    </div>
    <button class="btn btn-success" id="add-schedule-btn">Add Schedule</button>
    <div id="schedule-admin-list" style="margin-top: 20px;"></div>
  `;
}

