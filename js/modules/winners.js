import { db } from '../core/firebase.js';

export function initWinners() {
  db().ref('winners').on('value', (snapshot) => {
    const grid = document.getElementById('winners-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const winners = [];
    snapshot.forEach(child => winners.push(child.val()));
    winners.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    winners.forEach(winner => {
      const card = document.createElement('div');
      card.className = 'winner-card';
      card.innerHTML = `
        <img src="${winner.image}" alt="${winner.title}">
        <h3>🏆 ${winner.title}</h3>
        ${winner.description ? `<p>${winner.description}</p>` : ''}
      `;
      grid.appendChild(card);
    });
    if (winners.length === 0) grid.innerHTML = '<p class="empty-message">No winners announced yet. Check back after tournament completion!</p>';
  });
}

