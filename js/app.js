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
import { initRules } from './modules/rules.js';
import { initFAQ } from './modules/faq.js';
import { initRankings } from './modules/rankings.js';
import { initReport } from './modules/report.js';
import { initHistory } from './modules/history.js';
import { initSchedule } from './modules/schedule.js';
import { initNotifications } from './modules/notifications.js';
import { initMyMatch } from './modules/myMatch.js';
import { initTeamStats } from './modules/teamStats.js';
import { ensureFirebase } from './core/firebase.js';
import { initSplash } from './modules/splash.js';
import { initUCShop } from './modules/ucShop.js';
import { initLiveFeed } from './modules/liveFeed.js';
import { initAchievements } from './modules/achievements.js';
import { initRoomAccess } from './modules/roomAccess.js';
import { initTournamentProgress } from './modules/tournamentProgress.js';
import { initTdmWinners, openTdmWinnersModal } from './modules/tdmWinners.js';

// Section renderers
import { renderNoticeSection } from './modules/sections/notice.js';
import { renderRegistrationSection } from './modules/sections/registration.js';
import { renderTeamsSection } from './modules/sections/teams.js';
import { renderMatchesSection } from './modules/sections/matches.js';
import { renderRoadmapSection } from './modules/sections/roadmap.js';
import { renderScreenshotsSection } from './modules/sections/screenshots.js';
import { renderWinnersSection } from './modules/sections/winners.js';
import { renderUCShopSection } from './modules/sections/ucShop.js';
import { renderMoreSection } from './modules/sections/more.js';
import { renderRulesSection } from './modules/sections/rules.js';
import { renderFAQSection } from './modules/sections/faq.js';
import { renderRankingsSection } from './modules/sections/rankings.js';
import { renderReportSection } from './modules/sections/report.js';
import { renderHistorySection } from './modules/sections/history.js';
import { renderScheduleSection } from './modules/sections/schedule.js';
import { renderNotificationsSection } from './modules/sections/notifications.js';
import { renderMyMatchSection } from './modules/sections/myMatch.js';
import { renderTeamStatsSection } from './modules/sections/teamStats.js';
import { renderLiveFeedSection } from './modules/sections/liveFeed.js';
import { renderAchievementsSection } from './modules/sections/achievements.js';
// import { renderRoomSection } from './modules/sections/room.js';
import { renderProgressSection } from './modules/sections/progress.js';

ensureFirebase();

// Define navigation early, before DOM ready
window.navigateToSection = function(sectionId) {
  try {
    if (!sectionId) return;
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    const target = document.getElementById(sectionId);
    if (target) {
      target.classList.add('active');
    }
    
    // Also activate corresponding nav button
    const navBtn = document.querySelector(`.nav-btn[data-target="${sectionId}"]`);
    if (navBtn) {
      navBtn.classList.add('active');
    }
  } catch (e) {
    console.error('Navigation error:', e);
  }
};

window.openTdmWinnersModal = openTdmWinnersModal;

window.shareApp = async function() {
  try {
    const url = 'https://i.postimg.cc/CMJPVMpn/Appsshare.png';
    window.open(url, '_blank');
  } catch (e) {
    console.error('Share error:', e);
  }
};

let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); deferredPrompt = e;
  const btn = document.getElementById('install-btn'); if (btn) btn.style.display = 'inline-block';
});

document.addEventListener('DOMContentLoaded', () => {
  initSplash();
  
  // Render all section HTML first
  renderNoticeSection();
  renderRegistrationSection();
  renderTeamsSection();
  renderMatchesSection();
  renderRoadmapSection();
  renderScreenshotsSection();
  renderWinnersSection();
  renderUCShopSection();
  renderMoreSection();
  renderRulesSection();
  renderFAQSection();
  renderRankingsSection();
  renderReportSection();
  renderHistorySection();
  renderScheduleSection();
  renderNotificationsSection();
  renderMyMatchSection();
  renderTeamStatsSection();
  renderLiveFeedSection();
  renderAchievementsSection();
  // remove renderRoomSection();
  renderProgressSection();
  
  // Then initialize functionality
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

  initRules();
  initFAQ();
  initRankings();
  initReport();
  initHistory();
  
  // New features
  initSchedule();
  initNotifications();
  initMyMatch();
  initTeamStats();

  // New features
  initLiveFeed();
  initAchievements();
  initRoomAccess();
  initTournamentProgress();
  initTdmWinners();

  const btn = document.getElementById('install-btn');
  if (btn) btn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; btn.style.display = 'none';
  });

  const ucBtn = document.getElementById('uc-header-btn');
  if (ucBtn) ucBtn.addEventListener('click', () => {
    try {
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      const sec = document.getElementById('uc-shop-section'); 
      if (sec) sec.classList.add('active');
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    } catch (e) {
      console.error('UC navigation error:', e);
    }
  });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  });
}