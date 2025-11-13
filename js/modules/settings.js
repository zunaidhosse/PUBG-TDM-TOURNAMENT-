import { db } from '../core/firebase.js';

export function initSettings() {
  db().ref('settings').on('value', (snapshot) => {
    const s = snapshot.val();
    if (s) {
      const tType = document.getElementById('tournament-type');
      const tLimit = document.getElementById('team-limit');
      const reg = document.getElementById('registration-status');
      if (tType) tType.textContent = s.tournamentType || 'Not set';
      if (tLimit) tLimit.textContent = s.teamLimit || 'Not set';
      const open = !!s.registrationOpen;
      if (reg) {
        reg.textContent = open ? 'OPEN' : 'CLOSED';
        reg.style.color = open ? '#2ecc71' : '#e74c3c';
      }
    }
  });
}

