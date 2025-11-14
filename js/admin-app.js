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
import { initUCAdmin } from './admin/modules/uc.js';
import { initRulesAdmin } from './admin/modules/rules.js';
import { initFAQAdmin } from './admin/modules/faq.js';
import { initHistoryAdmin } from './admin/modules/history.js';
import { initReportsAdmin } from './admin/modules/reports.js';
import { initScheduleAdmin } from './admin/modules/schedule.js';
import { initNotificationsAdmin } from './admin/modules/notificationsAdmin.js';

// Section renderers
import { renderDashboard } from './admin/sections/dashboard.js';
import { renderBanner } from './admin/sections/banner.js';
import { renderScreenshots } from './admin/sections/screenshots.js';
import { renderWinners } from './admin/sections/winners.js';
import { renderTimer } from './admin/sections/timer.js';
import { renderNotice } from './admin/sections/notice.js';
import { renderSettings } from './admin/sections/settings.js';
import { renderTeams } from './admin/sections/teams.js';
import { renderMatches } from './admin/sections/matches.js';
import { renderRoadmap } from './admin/sections/roadmap.js';
import { renderUC } from './admin/sections/uc.js';
import { renderRules } from './admin/sections/rules.js';
import { renderFAQ } from './admin/sections/faq.js';
import { renderHistory } from './admin/sections/history.js';
import { renderReports } from './admin/sections/reports.js';
import { renderSchedule } from './admin/sections/schedule.js';
import { renderNotifications } from './admin/sections/notifications.js';

ensureFirebase();

document.addEventListener('DOMContentLoaded', () => {
  initAdminGuard();
  initAdminNav();
  
  initAdminAuth(() => {
    // Render all section HTML
    renderDashboard();
    renderBanner();
    renderScreenshots();
    renderWinners();
    renderTimer();
    renderNotice();
    renderSettings();
    renderTeams();
    renderMatches();
    renderRoadmap();
    renderUC();
    renderRules();
    renderFAQ();
    renderHistory();
    renderReports();
    renderSchedule();
    renderNotifications();
    
    // Initialize functionality
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
    initUCAdmin();
    initRulesAdmin();
    initFAQAdmin();
    initHistoryAdmin();
    initReportsAdmin();
    initScheduleAdmin();
    initNotificationsAdmin();
  });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
  });
}

window.shareApp = async function() {
  const url = 'https://i.postimg.cc/CMJPVMpn/Appsshare.png';
  try {
    window.open(url, '_blank');
  } catch {}
};