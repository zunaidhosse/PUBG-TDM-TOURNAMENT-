import { db } from '../core/firebase.js';
import { watchMyRegistration } from './registration.js';

export function initAuthGate() {
  function showAuth() { document.getElementById('auth-overlay').style.display = 'flex'; }
  function hideAuth() { document.getElementById('auth-overlay').style.display = 'none'; }
  function ensureAuth() {
    // Always hide overlay; do not prompt for username on app entry
    hideAuth();
    return;
  }

  document.addEventListener('DOMContentLoaded', ensureAuth);

  const signupBtn = document.getElementById('auth-signup');
  const loginBtn = document.getElementById('auth-login');
  const nameInput = document.getElementById('auth-name');
  const errEl = document.getElementById('auth-error');

  if (signupBtn) {
    signupBtn.addEventListener('click', async () => {
      const name = nameInput.value.trim();
      if (!name) { errEl.textContent = 'Enter a name'; return; }
      const snap = await db().ref('users').orderByChild('name').equalTo(name).once('value');
      if (snap.exists()) { errEl.textContent = 'Name already taken'; return; }
      await db().ref('users').push({ name, createdAt: Date.now() });
      localStorage.setItem('username', name); hideAuth(); errEl.textContent='';
      const tn = document.getElementById('team-name'); if (tn) tn.value = name;
      watchMyRegistration();
    });
  }

  if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
      const name = nameInput.value.trim();
      if (!name) { errEl.textContent = 'Enter a name'; return; }
      const snap = await db().ref('users').orderByChild('name').equalTo(name).once('value');
      if (!snap.exists()) { errEl.textContent = 'Account not found'; return; }
      localStorage.setItem('username', name); hideAuth(); errEl.textContent='';
      const tn = document.getElementById('team-name'); if (tn) tn.value = name;
      watchMyRegistration();
    });
  }

  const prefillName = localStorage.getItem('username') || '';
  if (prefillName) { const tn = document.getElementById('team-name'); if (tn && !tn.value) tn.value = prefillName; }
}

