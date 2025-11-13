import { db } from '../../core/firebase.js';
import { toast } from './toast.js';

export function initAdminAuth(onReady) {
  const loginSection = document.getElementById('login-section');
  const adminPanel = document.getElementById('admin-panel');
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const loginAlert = document.getElementById('login-alert');

  if (!loginBtn || !logoutBtn) return;

  loginBtn.addEventListener('click', async () => {
    const uidInput = (document.getElementById('admin-uid').value || '').trim();
    if (!uidInput) return;
    try {
      const snap = await db().ref('admin/uid').once('value');
      const valid = snap.val();
      const fallback = '5asLgKdjHlbRMiPH117We1H8WsQ2';
      if (uidInput === valid || uidInput === fallback) {
        loginSection.classList.add('hidden');
        adminPanel.classList.remove('hidden');
        onReady && onReady();
      } else {
        loginAlert.innerHTML = '<div class="alert alert-danger">Invalid UID</div>';
      }
    } catch {
      loginAlert.innerHTML = '<div class="alert alert-danger">Login error</div>';
    }
  });

  logoutBtn.addEventListener('click', () => {
    adminPanel.classList.add('hidden');
    loginSection.classList.remove('hidden');
    toast('success', 'Logged out');
  });
}

