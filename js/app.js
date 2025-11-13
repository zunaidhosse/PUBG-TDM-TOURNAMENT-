import { initAuthGate } from './modules/auth.js';
import { initNav } from './modules/ui/nav.js';
import { initAdminDial } from './modules/adminDial.js';
import { initCutGuard } from './modules/cutGuard.js';
import { initBanner } from './modules/banner.js';
import { initNotice } from './modules/notice.js';
import { initSettings } from './modules/settings.js';
import { initRegistration } from './modules/registration.js';
import { initTeams } from './modules/teams.js';
import { initMatches } from './modules/matches.js';
import { initRoadmap } from './modules/roadmap.js';
import { initWinners } from './modules/winners.js';
import { initScreenshots } from './modules/screenshots.js';
import { initTimer } from './modules/timer.js';
import { initLive } from './modules/live.js';
import { ensureFirebase } from './core/firebase.js';
import { initSplash } from './modules/splash.js';
import { initUCShop } from './modules/ucShop.js';

ensureFirebase();

window.shareApp = async function() {
  const url = 'https://i.postimg.cc/G2c350KX/20251110-203204.png';
  try {
    if (navigator.share) {
      await navigator.share({ title: 'PUBG TDM Tournament', text: 'Join the tournament!', url });
    } else {
      window.open(url, '_blank');
    }
  } catch {}
};

let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); deferredPrompt = e;
  const btn = document.getElementById('install-btn'); if (btn) btn.style.display = 'inline-block';
});

document.addEventListener('DOMContentLoaded', () => {
  initSplash();
  initNav();
  initAuthGate();
  initAdminDial();
  initCutGuard();

  // Data-driven sections
  initBanner();
  initNotice();
  initSettings();

  // User actions and listings
  initRegistration();
  initTeams();
  initMatches();
  initRoadmap();
  initWinners();
  initScreenshots();
  initTimer();
  initLive();
  initUCShop();

  const btn = document.getElementById('install-btn');
  if (btn) btn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; btn.style.display = 'none';
  });

  const ucBtn = document.getElementById('uc-header-btn');
  if (ucBtn) ucBtn.addEventListener('click', () => {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const sec = document.getElementById('uc-shop-section'); if (sec) sec.classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  });
}