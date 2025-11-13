//
// js/index.js has been refactored into modular ES files loaded from js/app.js.
// Tombstones for removed functions:
//
// removed function filterMatches(filterType) {}
// removed function loadData() {}
// removed function loadTeams() {}
// removed function loadMatches() {}
// removed function loadRoadmap() {}
// removed function loadWinners() {}
// removed function loadScreenshots() {}
// removed function setupAdminDial() {}
// removed function setupCutGuard() {}
// removed function showAuth() {}
// removed function hideAuth() {}
// removed function ensureAuth() {}
// removed function watchMyRegistration() {}
//
// Please see:
// - js/app.js (bootstrap)
// - js/core/firebase.js (Firebase init)
// - js/modules/*.js (feature modules)
//
// This file intentionally left minimal after refactor.

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  });
}