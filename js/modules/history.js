import { db } from '../core/firebase.js';

export function initHistory() {
  db().ref('history').on('value', (snapshot) => {
    const el = document.getElementById('history-grid');
    if (!el) return;

    const tournaments = [];
    snapshot.forEach(child => {
      const data = child.val();
      if (data) {
        tournaments.push({ id: child.key, ...data });
      }
    });
    tournaments.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    if (tournaments.length === 0) {
      el.innerHTML = '<p class="empty-message">Past tournament records will appear here</p>';
      return;
    }

    el.innerHTML = tournaments.map((t, idx) => `
      <div class="winner-card">
        ${t.image ? `<img src="${t.image}" alt="${t.title}" style="width:100%; height:200px; object-fit:cover;">` : ''}
        <h3>${idx + 1}. 🏆 ${t.title}</h3>
        ${t.winner ? `<p style="color: #2ecc71; font-weight: 700;">Champion: ${t.winner}</p>` : ''}
        ${t.date ? `<p style="color: #95a5a6; font-size: 0.9rem;">${t.date}</p>` : ''}
      </div>
    `).join('');
  });
}

