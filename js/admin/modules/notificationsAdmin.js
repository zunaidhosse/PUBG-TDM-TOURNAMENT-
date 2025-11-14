import { db } from '../../core/firebase.js';
import { toast } from './toast.js';

export function initNotificationsAdmin() {
  const typeIn = document.getElementById('notif-type');
  const titleIn = document.getElementById('notif-title');
  const messageIn = document.getElementById('notif-message');
  const addBtn = document.getElementById('add-notif-btn');
  const list = document.getElementById('notifications-admin-list');

  if (addBtn) {
    addBtn.addEventListener('click', async () => {
      const type = typeIn?.value || 'info';
      const title = (titleIn?.value || '').trim();
      const message = (messageIn?.value || '').trim();
      
      if (!title || !message) return toast('danger', 'Fill title and message');
      
      try {
        await db().ref('notifications').push({
          type,
          title,
          message,
          timestamp: Date.now()
        });
        toast('success', 'Notification sent');
        if (titleIn) titleIn.value = '';
        if (messageIn) messageIn.value = '';
      } catch {
        toast('danger', 'Failed to send notification');
      }
    });
  }

  db().ref('notifications').on('value', snap => {
    if (!list) return;
    list.innerHTML = '';
    const items = [];
    snap.forEach(c => items.push({ id: c.key, ...c.val() }));
    items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    items.forEach(n => {
      const div = document.createElement('div');
      div.className = 'registration-card';
      const time = new Date(n.timestamp).toLocaleString();
      div.innerHTML = `<h4>[${n.type}] ${n.title}</h4><p>${n.message}</p><p style="font-size:0.85rem;color:#95a5a6;">${time}</p><button class="btn btn-danger">Delete</button>`;
      div.querySelector('.btn-danger').addEventListener('click', () => {
        db().ref('notifications/' + n.id).remove().then(() => toast('success', 'Deleted')).catch(() => toast('danger', 'Failed'));
      });
      list.appendChild(div);
    });
  });
}