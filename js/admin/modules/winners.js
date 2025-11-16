import { db } from '../../core/firebase.js';
import { toast } from './toast.js';

export function initWinnersAdmin() {
  const addBtn = document.getElementById('add-winner-btn');
  const titleIn = document.getElementById('winner-title');
  const imageIn = document.getElementById('winner-image');
  const descIn = document.getElementById('winner-description');
  const list = document.getElementById('winners-list');

  if (addBtn) {
    addBtn.addEventListener('click', async () => {
      const title = (titleIn?.value || '').trim();
      const image = (imageIn?.value || '').trim();
      const description = (descIn?.value || '').trim();
      if (!title || !image) return toast('danger','Fill title and image');
      try {
        await db().ref('winners').push({ title, image, description, timestamp: Date.now() });
        toast('success','Winner added');
        if (titleIn) titleIn.value = '';
        if (imageIn) imageIn.value = '';
        if (descIn) descIn.value = '';
      } catch {
        toast('danger','Failed to add winner');
      }
    });
  }

  db().ref('winners').on('value', snap => {
    if (!list) return;
    list.innerHTML = '';
    const items = [];
    snap.forEach(c => {
      const data = c.val();
      if (data && data.image) {
        items.push({ id: c.key, ...data });
      }
    });
    items.sort((a,b)=> (b.timestamp||0)-(a.timestamp||0));
    
    if (items.length === 0) {
      list.innerHTML = '<p class="empty-message">No winners</p>';
      return;
    }
    
    const scrollContainer = document.createElement('div');
    scrollContainer.style.maxHeight = '600px';
    scrollContainer.style.overflowY = 'auto';
    scrollContainer.style.display = 'flex';
    scrollContainer.style.flexDirection = 'column';
    scrollContainer.style.gap = '10px';
    
    items.forEach((w, idx) => {
      const div = document.createElement('div');
      div.className = 'registration-card';
      div.innerHTML = `
        <img src="${w.image}" style="width:100%;max-height:150px;object-fit:cover;border-radius:6px;margin-bottom:8px;">
        <h4>${idx + 1}. 🏆 ${w.title}</h4>
        ${w.description ? `<p style="margin:6px 0;">${w.description}</p>` : ''}
        <button class="btn btn-danger">Remove</button>
      `;
      div.querySelector('.btn-danger').addEventListener('click', () => {
        db().ref('winners/'+w.id).remove().then(()=> toast('success','Removed')).catch(()=> toast('danger','Remove failed'));
      });
      scrollContainer.appendChild(div);
    });
    
    list.appendChild(scrollContainer);
  });
}

