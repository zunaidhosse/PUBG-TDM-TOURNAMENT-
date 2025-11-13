import { ensureFirebase } from './core/firebase.js';
import { initAdminGuard } from './admin/modules/guard.js';
import { initAdminAuth } from './admin/modules/login.js';
import { initAdminNav } from './admin/modules/nav.js';
import { initBannerAdmin } from './admin/modules/banner.js';
import { initNoticeAdmin } from './admin/modules/notice.js';
import { initPrizePoolAdmin } from './admin/modules/prize.js';
import { initSettingsAdmin } from './admin/modules/settings.js';
import { initTeamsAdmin } from './admin/modules/teams.js';
import { initScreenshotsAdmin } from './admin/modules/screenshots.js';
import { initWinnersAdmin } from './admin/modules/winners.js';
import { initStatsAdmin } from './admin/modules/stats.js';
import { initAdminMatches } from './admin/modules/matches.js';
import { initAdminRoadmap } from './admin/modules/roadmap.js';
import { initTimerAdmin } from './admin/modules/timer.js';

ensureFirebase();

document.addEventListener('DOMContentLoaded', () => {
  initAdminGuard();
  initAdminNav();
  initAdminAuth(() => {
    initBannerAdmin();
    initNoticeAdmin();
    initPrizePoolAdmin();
    initSettingsAdmin();
    initTeamsAdmin();
    initScreenshotsAdmin();
    initWinnersAdmin();
    initStatsAdmin();
    initAdminMatches();
    initAdminRoadmap();
    initTimerAdmin();
  });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
  });
}

window.shareApp = async function() {
  const url = 'https://i.postimg.cc/G2c350KX/20251110-203204.png';
  try {
    if (navigator.share) {
      await navigator.share({ title: 'PUBG TDM Tournament', text: 'Admin link to share', url });
    } else {
      window.open(url, '_blank');
    }
  } catch {}
};