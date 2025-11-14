import { db } from '../core/firebase.js';

export function initNotifications() {
  db().ref('notifications').on('value', (snapshot) => {
    const el = document.getElementById('notifications-list');
    if (!el) return;

    const notifications = [];
    snapshot.forEach(child => notifications.push({ id: child.key, ...child.val() }));
    notifications.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    if (notifications.length === 0) {
      el.innerHTML = '<p class=\"empty-message\">No new notifications</p>';
      return;
    }

    el.innerHTML = notifications.map(n => {
      const timeAgo = n.timestamp ? getTimeAgo(n.timestamp) : 'Just now';
      const typeIcon = {
        success: '✅',
        warning: '⚠️',
        info: 'ℹ️',
        error: '❌'
      }[n.type || 'info'];

      return `
        <div class=\"notification-card ${n.type || 'info'}\">
          <div class=\"notif-header\">
            <span class=\"notif-icon\">${typeIcon}</span>
            <span class=\"notif-time\">${timeAgo}</span>
          </div>
          <h4 class=\"notif-title\">${n.title || 'Notification'}</h4>
          <p class=\"notif-message\">${n.message}</p>
        </div>
      `;
    }).join('');
  });
}

function getTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}