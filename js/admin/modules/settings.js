import { db } from '../../core/firebase.js';
import { toast } from './toast.js';

export function initSettingsAdmin() {
  const reg = document.getElementById('registration-status');
  const limit = document.getElementById('team-limit');
  const type = document.getElementById('tournament-type');
  const saveBtn = document.getElementById('save-settings-btn');

  db().ref('settings').on('value', s => {
    const set = s.val() || {};
    if (reg) reg.value = String(!!set.registrationOpen);
    if (limit) limit.value = String(set.teamLimit || '16');
    if (type) type.value = set.tournamentType || '4v4';
  });

  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const payload = {
        registrationOpen: reg?.value === 'true',
        teamLimit: limit?.value,
        tournamentType: type?.value,
        updatedAt: Date.now()
      };
      try {
        await db().ref('settings').set(payload);
        toast('success', 'Settings saved');
      } catch {
        toast('danger', 'Failed to save settings');
      }
    });
  }
}

