import { db } from '../core/firebase.js';

export function initBanner() {
  db().ref('banner').on('value', (snapshot) => {
    const banner = snapshot.val();
    const el = document.getElementById('banner');
    if (!el) return;
    el.innerHTML = banner && banner.imageUrl
      ? `<img src="${banner.imageUrl}">`
      : '<p style="text-align:center;padding:80px 0;">No banner set</p>';
  });
}

