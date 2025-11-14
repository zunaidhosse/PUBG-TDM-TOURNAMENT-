export function renderNotificationsSection() {
  const el = document.getElementById('notifications-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">🔔 Notifications</h2>
    <div id="notifications-list">Loading...</div>
  `;
}

