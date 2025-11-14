export function renderNotifications() {
  const el = document.getElementById('notifications-admin-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">🔔 Notifications Management</h2>
    <div class="form-group">
      <label for="notif-type">Notification Type</label>
      <select id="notif-type">
        <option value="info">Info</option>
        <option value="success">Success</option>
        <option value="warning">Warning</option>
        <option value="error">Error</option>
      </select>
    </div>
    <div class="form-group">
      <label for="notif-title">Title</label>
      <input type="text" id="notif-title" placeholder="Notification title">
    </div>
    <div class="form-group">
      <label for="notif-message">Message</label>
      <textarea id="notif-message" rows="3" placeholder="Notification message"></textarea>
    </div>
    <button class="btn btn-success" id="add-notif-btn">Send Notification</button>
    <div id="notifications-admin-list" style="margin-top: 20px;"></div>
  `;
}

