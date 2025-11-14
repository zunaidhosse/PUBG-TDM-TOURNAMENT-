import { db } from '../../core/firebase.js';
import { toast } from './toast.js';

export function initHistoryAdmin() {
  const titleIn = document.getElementById('history-title');
  const winnerIn = document.getElementById('history-winner');
  const dateIn = document.getElementById('history-date');
  const imageIn = document.getElementById('history-image');
  const addBtn = document.getElementById('add-history-btn');
  const list = document.getElementById('history-admin-list');

  if (addBtn) {
    addBtn.addEventListener('click', async () => {
      const title = (titleIn?.value || '').trim();
      const winner = (winnerIn?.value || '').trim();
      const date = (dateIn?.value || '').trim();
      const image = (imageIn?.value || '').trim();
      if (!title || !winner) return toast('danger', 'Fill title and winner');
      try {
        await db().ref('history').push({ title, winner, date, image, timestamp: Date.now() });
        toast('success', 'Tournament added');
        [titleIn, winnerIn, dateIn, imageIn].forEach(el => { if (el) el.value = ''; });
      } catch {
        toast('danger', 'Failed to add tournament');
      }
    });
  }

  db().ref('history').on('value', snap => {
    if (!list) return;
    list.innerHTML = '';
    const items = [];
    snap.forEach(c => items.push({ id: c.key, ...c.val() }));
    items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    items.forEach(h => {
      const div = document.createElement('div');
      div.className = 'registration-card';
      div.innerHTML = `<h4>🏆 ${h.title}</h4><p>Champion: ${h.winner}</p>${h.date ? `<p>${h.date}</p>` : ''}<button class="btn btn-danger">Delete</button>`;
      div.querySelector('.btn-danger').addEventListener('click', () => {
        db().ref('history/' + h.id).remove().then(() => toast('success', 'Deleted')).catch(() => toast('danger', 'Failed'));
      });
      list.appendChild(div);
    });
  });
}