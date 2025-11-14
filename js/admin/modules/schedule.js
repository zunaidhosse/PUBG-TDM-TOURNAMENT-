import { db } from '../../core/firebase.js';
import { toast } from './toast.js';

export function initScheduleAdmin() {
  const roundIn = document.getElementById('schedule-round');
  const timeIn = document.getElementById('schedule-time');
  const descIn = document.getElementById('schedule-desc');
  const addBtn = document.getElementById('add-schedule-btn');
  const list = document.getElementById('schedule-admin-list');

  if (addBtn) {
    addBtn.addEventListener('click', async () => {
      const round = (roundIn?.value || '').trim();
      const time = timeIn?.value;
      const description = (descIn?.value || '').trim();
      
      if (!round || !time) return toast('danger', 'Fill round and time');
      
      const timestamp = new Date(time).getTime();
      try {
        await db().ref('schedule').push({ round, timestamp, description });
        toast('success', 'Schedule added');
        if (roundIn) roundIn.value = '';
        if (timeIn) timeIn.value = '';
        if (descIn) descIn.value = '';
      } catch {
        toast('danger', 'Failed to add schedule');
      }
    });
  }

  db().ref('schedule').on('value', snap => {
    if (!list) return;
    list.innerHTML = '';
    const items = [];
    snap.forEach(c => items.push({ id: c.key, ...c.val() }));
    items.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    
    items.forEach(s => {
      const div = document.createElement('div');
      div.className = 'registration-card';
      const date = new Date(s.timestamp).toLocaleString();
      div.innerHTML = `<h4>${s.round}</h4><p>🕐 ${date}</p>${s.description ? `<p>${s.description}</p>` : ''}<button class="btn btn-danger">Delete</button>`;
      div.querySelector('.btn-danger').addEventListener('click', () => {
        db().ref('schedule/' + s.id).remove().then(() => toast('success', 'Deleted')).catch(() => toast('danger', 'Failed'));
      });
      list.appendChild(div);
    });
  });
}

