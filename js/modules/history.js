import { db } from '../core/firebase.js';

export function initHistory() {
  db().ref('history').on('value', (snapshot) => {
    const el = document.getElementById('history-grid');
    if (!el) return;

    const tournaments = [];
    snapshot.forEach(child => tournaments.push({ id: child.key, ...child.val() }));
    tournaments.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    if (tournaments.length === 0) {
      el.innerHTML = '<p class="empty-message">Past tournament records will appear here</p>';
      return;
    }

    el.innerHTML = tournaments.map(t => `
      <div class="winner-card">
        ${t.image ? `<img src="${t.image}" alt="${t.title}">` : ''}
        <h3>🏆 ${t.title}</h3>
        ${t.winner ? `<p style="color: #2ecc71; font-weight: 700;">Champion: ${t.winner}</p>` : ''}
        ${t.date ? `<p style="color: #95a5a6; font-size: 0.9rem;">${t.date}</p>` : ''}
      </div>
    `).join('');
  });
}

