import { db } from '../../core/firebase.js';
import { toast } from './toast.js';

export function initNoticeAdmin() {
  const content = document.getElementById('notice-content');
  const saveBtn = document.getElementById('save-notice-btn');

  db().ref('notice').on('value', s => { if (content) content.value = s.val() || ''; });

  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      try {
        await db().ref('notice').set((content?.value || '').trim());
        toast('success', 'Notice saved');
      } catch {
        toast('danger', 'Failed to save notice');
      }
    });
  }
}

