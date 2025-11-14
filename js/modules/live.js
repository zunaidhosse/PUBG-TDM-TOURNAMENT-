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
      const quick = document.getElementById('quick-live');
      if (quick) { quick.href = url; quick.style.opacity = '1'; quick.onclick = null; }
    } else {
      badge.style.display = 'none';
      badge.removeAttribute('href');
      const quick = document.getElementById('quick-live');
      if (quick) { quick.removeAttribute('href'); quick.style.opacity = '0.6'; quick.onclick = (e)=>e.preventDefault(); }
    }
  });
}

