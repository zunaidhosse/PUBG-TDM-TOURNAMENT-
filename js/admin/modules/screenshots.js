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
    snap.forEach(c => items.push({ id:c.key, ...c.val() }));
    items.sort((a,b)=> (b.timestamp||0)-(a.timestamp||0));
    items.forEach(ss => {
      const div = document.createElement('div');
      div.className = 'registration-card';
      div.innerHTML = `<img src="${ss.imageUrl}" style="width:100%;border-radius:6px;margin-bottom:8px;"><h4>${ss.title}</h4><button class="btn btn-danger">Remove</button>`;
      div.querySelector('.btn-danger').addEventListener('click', () => {
        db().ref('screenshots/'+ss.id).remove().then(()=> toast('success','Removed')).catch(()=> toast('danger','Remove failed'));
      });
      list.appendChild(div);
    });
  });
}

