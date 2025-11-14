import { db } from '../../core/firebase.js';
import { toast } from './toast.js';

export function initReportsAdmin() {
  const list = document.getElementById('reports-admin-list');
  if (!list) return;

  db().ref('reports').on('value', snap => {
    list.innerHTML = '';
    const items = [];
    snap.forEach(c => items.push({ id: c.key, ...c.val() }));
    items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    if (items.length === 0) {
      list.innerHTML = '<p class="empty-message">No reports</p>';
      return;
    }

    items.forEach(r => {
      const div = document.createElement('div');
      div.className = 'registration-card';
      const timeStr = new Date(r.timestamp).toLocaleString();
      div.innerHTML = `
        <h4 style="color: #f39c12;">${r.type} - ${r.reportedBy}</h4>
        <p style="margin: 6px 0;">${r.description}</p>
        <p style="font-size: 0.85rem; color: #95a5a6;">${timeStr}</p>
        <div style="margin-top: 8px; display: flex; gap: 8px;">
          <button class="btn btn-success resolve-btn">Mark Resolved</button>
          <button class="btn btn-danger delete-btn">Delete</button>
        </div>
      `;
      
      div.querySelector('.resolve-btn').addEventListener('click', async () => {
        try {
          await db().ref('reports/' + r.id).update({ status: 'resolved' });
          toast('success', 'Marked as resolved');
        } catch {
          toast('danger', 'Failed');
        }
      });

      div.querySelector('.delete-btn').addEventListener('click', async () => {
        try {
          await db().ref('reports/' + r.id).remove();
          toast('success', 'Deleted');
        } catch {
          toast('danger', 'Failed');
        }
      });

      list.appendChild(div);
    });
  });
}

