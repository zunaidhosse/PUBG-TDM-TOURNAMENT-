import { db } from '../../core/firebase.js';
import { toast } from './toast.js';

export function initScreenshotsAdmin() {
  const addBtn = document.getElementById('add-screenshot-btn');
  const titleIn = document.getElementById('screenshot-title');
  const urlIn = document.getElementById('screenshot-url');
  const list = document.getElementById('screenshots-list');

  if (addBtn) {
    addBtn.addEventListener('click', async () => {
      const title = (titleIn?.value || '').trim();
      const imageUrl = (urlIn?.value || '').trim();
      if (!title || !imageUrl) return toast('danger','Fill all fields');
      try {
        await db().ref('screenshots').push({ title, imageUrl, timestamp: Date.now() });
        toast('success','Screenshot added');
        if (titleIn) titleIn.value = '';
        if (urlIn) urlIn.value = '';
      } catch {
        toast('danger','Failed to add screenshot');
      }
    });
  }

  db().ref('screenshots').on('value', snap => {
    if (!list) return;
    list.innerHTML = '';
    const items = [];
    snap.forEach(c => {
      const data = c.val();
      if (data && data.imageUrl) {
        items.push({ id: c.key, ...data });
      }
    });
    items.sort((a,b)=> (b.timestamp||0)-(a.timestamp||0));
    
    if (items.length === 0) {
      list.innerHTML = '<p class="empty-message">No published screenshots</p>';
      return;
    }

    // Render numbered list of screenshots
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';
    container.style.maxHeight = '600px';
    container.style.overflowY = 'auto';

    items.forEach((ss, idx) => {
      const div = document.createElement('div');
      div.className = 'registration-card';
      div.style.padding = '10px';
      
      const imgHtml = ss.imageUrl ? `<img src="${ss.imageUrl}" style="width:100%;max-height:150px;object-fit:cover;border-radius:6px;margin-bottom:8px;">` : '';
      
      div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 8px;">
          <h4 style="color:#ecf0f1;">${idx + 1}. ${ss.title}</h4>
          <button class="btn btn-danger" data-id="${ss.id}" style="padding: 6px 10px; font-size: 0.8rem;">Remove</button>
        </div>
        ${imgHtml}
        <p style="font-size:0.85rem; color:#95a5a6;">URL: ${ss.imageUrl.substring(0, 50)}...</p>
      `;

      div.querySelector('.btn-danger').addEventListener('click', () => {
        db().ref('screenshots/'+ss.id).remove().then(()=> toast('success','Removed')).catch(()=> toast('danger','Remove failed'));
      });
      container.appendChild(div);
    });
    
    list.appendChild(container);
  });
}