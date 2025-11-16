import { db } from '../core/firebase.js';

function renderScreenshotsHtml(screenshots) {
  if (screenshots.length === 0) {
    return '<p class="empty-message">No screenshots available yet. Submit yours now!</p>';
  }
  return screenshots.map((ss, idx) => `
    <div class="winner-card">
      <img src="${ss.imageUrl}" alt="${ss.title}">
      <h3>📸 ${idx + 1}. ${ss.title}</h3>
    </div>
  `).join('');
}

export function initScreenshots() {
  db().ref('screenshots').on('value', (snapshot) => {
    const grid = document.getElementById('screenshots-grid');
    
    if (!grid) return;

    const screenshots = [];
    snapshot.forEach(child => {
      const data = child.val();
      if (data && data.imageUrl) {
        screenshots.push(data);
      }
    });
    screenshots.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    const html = renderScreenshotsHtml(screenshots);
    grid.innerHTML = html;
  });
}

