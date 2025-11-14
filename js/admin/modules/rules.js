import { db } from '../../core/firebase.js';
import { toast } from './toast.js';

export function initRulesAdmin() {
  const content = document.getElementById('rules-content-admin');
  const saveBtn = document.getElementById('save-rules-btn');

  db().ref('rules').on('value', s => { if (content) content.value = s.val() || ''; });

  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      try {
        await db().ref('rules').set((content?.value || '').trim());
        toast('success', 'Rules saved');
      } catch {
        toast('danger', 'Failed to save rules');
      }
    });
  }
}

