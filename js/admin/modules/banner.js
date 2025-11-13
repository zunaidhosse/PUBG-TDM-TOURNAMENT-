import { db } from '../../core/firebase.js';
import { toast } from './toast.js';

export function initBannerAdmin() {
  const urlInput = document.getElementById('banner-url');
  const saveBtn = document.getElementById('save-banner-btn');
  const preview = document.getElementById('banner-preview');

  db().ref('banner').on('value', (s) => {
    const data = s.val();
    if (preview) preview.innerHTML = data?.imageUrl ? `<img src="${data.imageUrl}">` : '';
    if (urlInput) urlInput.value = data?.imageUrl || '';
  });

  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const url = (urlInput?.value || '').trim();
      try {
        await db().ref('banner').set({ imageUrl: url, updatedAt: Date.now() });
        toast('success', 'Banner saved');
      } catch {
        toast('danger', 'Failed to save banner');
      }
    });
  }
}

