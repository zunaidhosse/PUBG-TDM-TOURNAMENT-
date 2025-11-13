import { db } from '../core/firebase.js';

export function initScreenshots() {
  db().ref('screenshots').on('value', (snapshot) => {
    const grid = document.getElementById('screenshots-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const screenshots = [];
    snapshot.forEach(child => screenshots.push(child.val()));
    screenshots.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    screenshots.forEach(ss => {
      const card = document.createElement('div');
      card.className = 'winner-card';
      card.innerHTML = `<img src="${ss.imageUrl}" alt="${ss.title}"><h3>📸 ${ss.title}</h3>`;
      grid.appendChild(card);
    });
    if (screenshots.length === 0) grid.innerHTML = '<p class="empty-message">No screenshots available yet. Submit yours now!</p>';
  });
}

