export function initLive() {
  const badge = document.getElementById('live-badge');
  if (!badge || !window.firebase) return;
  const db = () => window.firebase.database();
  db().ref('live').on('value', s => {
    const v = s.val() || {};
    const url = (v.url || '').trim();
    if (url) {
      badge.style.display = 'inline-block';
      badge.href = url;
      badge.onclick = (e) => { e.preventDefault(); window.open(url, '_blank', 'noopener'); };
    } else {
      badge.style.display = 'none';
      badge.removeAttribute('href');
    }
  });
}

