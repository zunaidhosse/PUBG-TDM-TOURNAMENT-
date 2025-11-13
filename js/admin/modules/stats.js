import { db } from '../../core/firebase.js';

export function initStatsAdmin() {
  // Matches count from roadmap
  db().ref('roadmap').on('value', s => {
    const r = s.val() || {};
    const count =
      (Array.isArray(r.round1) ? r.round1.length : 0) +
      (Array.isArray(r.round2) ? r.round2.length : 0) +
      (Array.isArray(r.round3) ? r.round3.length : (Array.isArray(r.preFinal) ? r.preFinal.length : 0)) +
      (Array.isArray(r.quarterFinal) ? r.quarterFinal.length : 0) +
      (Array.isArray(r.semiFinal) ? r.semiFinal.length : 0) +
      ((r.grandFinal && (r.grandFinal.team1 || r.grandFinal.team2)) ? 1 : 0);
    const el = document.getElementById('total-matches'); if (el) el.textContent = count;
  });

  // Users count
  db().ref('users').on('value', s => {
    let count = 0; s.forEach(()=> count++);
    const el = document.getElementById('total-users');
    if (el) el.textContent = count;
  });
}