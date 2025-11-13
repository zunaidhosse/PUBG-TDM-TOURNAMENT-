//
// js/admin.js has been refactored into modular ES files loaded from js/admin-app.js.
// Tombstones for removed functions and logic:
//
// removed function guardAdminAccess() {}
// removed function toast(type, msg) {}
// removed loginBtn event handler and admin UID verification
// removed logoutBtn event handler
// removed navigation click handlers
// removed Firebase initialization (now handled by ensureFirebase in core/firebase.js)
// removed render/update logic for: banner, notice, prize pool, settings
// removed teams management (including simulated mode), force delete, delete all
// removed screenshots and winners CRUD
// removed stats counters for matches and users
//
// Please see:
// - js/admin-app.js (bootstrap)
// - js/admin/modules/*.js (feature modules)
//
// This file intentionally left minimal after refactor.

console.warn('Deprecated: js/admin.js is no longer used. See js/admin-app.js');