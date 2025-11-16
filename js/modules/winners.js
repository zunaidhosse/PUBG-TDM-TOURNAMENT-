import { db } from '../core/firebase.js';

export function initWinners() {
  db().ref('winners').on('value', (snapshot) => {
    const grid = document.getElementById('winners-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const winners = [];
    snapshot.forEach(child => {
      const data = child.val();
      if (data && data.image) {
        winners.push(data);
      }
    });
    winners.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    if (winners.length === 0) {
      grid.innerHTML = '<p class="empty-message">No winners announced yet. Check back after tournament completion!</p>';
      return;
    }
    
    winners.forEach(winner => {
      const card = document.createElement('div');
      card.className = 'winner-card';
      card.innerHTML = `
        <img src="${winner.image}" alt="${winner.title}" style="width:100%; height:200px; object-fit:cover;">
        <h3>🏆 ${winner.title}</h3>
        ${winner.description ? `<p>${winner.description}</p>` : ''}
      `;
      grid.appendChild(card);
    });
  });
}

