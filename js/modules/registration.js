import { db } from '../core/firebase.js';

export function initRegistration() {
  const btn = document.getElementById('register-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const teamName = document.getElementById('team-name').value.trim();
    const createdBy = localStorage.getItem('username') || '';
    if (!teamName) { alert('Please enter team name'); return; }
    db().ref('settings/registrationOpen').once('value')
      .then(snapshot => {
        if (!snapshot.val()) { alert('Registration is closed'); return Promise.reject('closed'); }
        return db().ref('registrations').orderByChild('teamName').equalTo(teamName).once('value');
      })
      .then(snapshot => {
        if (snapshot && snapshot.exists()) { alert('Team name already exists'); return Promise.reject('exists'); }
        return db().ref('registrations').push({ teamName, status: 'Pending', registeredAt: Date.now(), createdBy });
      })
      .then(() => { alert('Registration successful!'); })
      .catch(() => {});
  });

  watchMyRegistration();
}

export function watchMyRegistration() {
  const u = localStorage.getItem('username');
  const box = document.getElementById('registration-status-inline');
  if (!box || !u) { if (box) box.textContent = ''; return; }
  db().ref('registrations').orderByChild('createdBy').equalTo(u).on('value', (snap) => {
    let latest = null;
    snap.forEach(c => { const v = c.val(); if (!latest || (v.registeredAt||0) > (latest.registeredAt||0)) latest = v; });
    if (!latest) { box.innerHTML = ''; return; }
    const approved = latest.status === 'Approved';
    const timeText = latest.registeredAt ? new Date(latest.registeredAt).toLocaleString() : 'Just now';
    box.style.borderColor = approved ? '#2ecc71' : '#f39c12';
    box.style.background = approved ? 'rgba(46,204,113,0.15)' : 'rgba(243,156,18,0.15)';
    box.innerHTML = `
      <div class="reg-status-card">
        <div class="reg-status-header">
          <span class="reg-status-title">📝 Registration</span>
          <span class="reg-status-badge ${approved ? 'approved' : 'pending'}">${approved ? 'কনফার্ম' : 'পেন্ডিং'}</span>
        </div>
        <div class="reg-status-body">
          <div class="team-chip">👥 ${latest.teamName || u}</div>
          <div class="meta">⏱️ ${timeText}</div>
        </div>
      </div>
    `;
  });
}

