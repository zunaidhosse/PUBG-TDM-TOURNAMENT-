import { db } from '../core/firebase.js';

export function initRules() {
  db().ref('rules').on('value', (snapshot) => {
    const el = document.getElementById('rules-content');
    if (!el) return;
    const text = snapshot.val() || '';
    if (!text) {
      el.innerHTML = '<p class="empty-message">Tournament rules will be announced soon</p>';
      return;
    }
    const lines = String(text).split('\n').map(l => l.trim()).filter(l => l.length || l === '');
    const items = lines.map(line => {
      if (!line) return '<div class="nb-gap"></div>';
      if (/^(\-|\*|•)\s+/.test(line)) {
        return `<li>${line.replace(/^(\-|\*|•)\s+/, '')}</li>`;
      }
      return `<p>${line}</p>`;
    }).join('');
    el.innerHTML = items || '<p class="empty-message">No rules set</p>';
  });
}

