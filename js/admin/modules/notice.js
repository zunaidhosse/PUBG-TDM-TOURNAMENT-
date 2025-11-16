import { db } from '../../core/firebase.js';
import { toast } from './toast.js';

export function initNoticeAdmin() {
  const titleIn = document.getElementById('notice-title');
  const contentIn = document.getElementById('notice-content');
  const imageIn = document.getElementById('notice-image');
  const imagePositionIn = document.getElementById('notice-image-position');
  const priorityIn = document.getElementById('notice-priority');
  const expiresIn = document.getElementById('notice-expires');
  const addBtn = document.getElementById('add-notice-btn');
  const list = document.getElementById('notices-admin-list');

  if (addBtn) {
    addBtn.addEventListener('click', async () => {
      const title = (titleIn?.value || '').trim();
      const content = (contentIn?.value || '').trim();
      const image = (imageIn?.value || '').trim();
      const imagePosition = imagePositionIn?.value || 'above';
      const priority = priorityIn?.value || 'normal';
      const expiresVal = expiresIn?.value;
      
      if (!title || !content) return toast('danger', 'Title and content are required');
      
      const expiresAt = expiresVal ? new Date(expiresVal).getTime() : null;
      
      try {
        await db().ref('notices').push({
          title,
          content,
          image: image || null,
          imagePosition,
          priority,
          expiresAt,
          timestamp: Date.now()
        });
        
        toast('success', 'Notice published');
        if (titleIn) titleIn.value = '';
        if (contentIn) contentIn.value = '';
        if (imageIn) imageIn.value = '';
        if (imagePositionIn) imagePositionIn.value = 'above';
        if (priorityIn) priorityIn.value = 'normal';
        if (expiresIn) expiresIn.value = '';
      } catch {
        toast('danger', 'Failed to publish notice');
      }
    });
  }

  db().ref('notices').on('value', snap => {
    if (!list) return;
    list.innerHTML = '';
    
    const items = [];
    snap.forEach(c => {
      const v = { id: c.key, ...c.val() };
      // skip expired
      if (v.expiresAt && v.expiresAt < Date.now()) return;
      items.push(v);
    });
    
    // Sort: pinned first, then newest
    items.sort((a, b) => {
      if (a.priority === 'pinned' && b.priority !== 'pinned') return -1;
      if (b.priority === 'pinned' && a.priority !== 'pinned') return 1;
      return (b.timestamp || 0) - (a.timestamp || 0);
    });
    
    if (items.length === 0) {
      list.innerHTML = '<p class="empty-message">No notices published</p>';
      return;
    }
    
    // Render numbered list where every notice is visible with controls
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';

    items.forEach((notice, idx) => {
      const row = document.createElement('div');
      row.className = 'registration-card';
      row.style.display = 'flex';
      row.style.flexDirection = 'column';
      row.style.gap = '8px';
      row.style.padding = '10px';

      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.style.alignItems = 'center';
      header.style.gap = '8px';

      const left = document.createElement('div');
      left.style.display = 'flex';
      left.style.flexDirection = 'column';
      left.innerHTML = `<strong style="color:#ecf0f1;">${idx + 1}. ${notice.title}</strong>
                        <span style="font-size:0.85rem; color:#95a5a6;">Published: ${new Date(notice.timestamp).toLocaleString()}</span>`;

      const right = document.createElement('div');
      right.style.display = 'flex';
      right.style.alignItems = 'center';
      right.style.gap = '8px';

      const editBtn = document.createElement('button');
      editBtn.className = 'btn btn-primary';
      editBtn.textContent = 'Edit';
      editBtn.style.padding = '6px 10px';
      editBtn.addEventListener('click', () => {
        if (titleIn) titleIn.value = notice.title || '';
        if (contentIn) contentIn.value = notice.content || '';
        if (imageIn) imageIn.value = notice.image || '';
        if (imagePositionIn) imagePositionIn.value = notice.imagePosition || 'above';
        if (priorityIn) priorityIn.value = notice.priority || 'normal';
        if (expiresIn) expiresIn.value = notice.expiresAt ? new Date(notice.expiresAt).toISOString().slice(0,16) : '';
        // remove the old entry so admin edits by re-saving
        db().ref('notices/' + notice.id).remove().then(() => {
          toast('success', 'Notice loaded for editing (previous version removed)');
        }).catch(() => {
          toast('danger', 'Could not prepare notice for editing');
        });
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-danger';
      deleteBtn.textContent = 'Delete';
      deleteBtn.style.padding = '6px 10px';
      deleteBtn.addEventListener('click', () => {
        if (!confirm('Delete this notice?')) return;
        db().ref('notices/' + notice.id).remove()
          .then(() => toast('success', 'Notice deleted'))
          .catch(() => toast('danger', 'Failed to delete'));
      });

      right.appendChild(editBtn);
      right.appendChild(deleteBtn);

      header.appendChild(left);
      header.appendChild(right);

      const body = document.createElement('div');
      body.style.color = '#ecf0f1';
      body.style.whiteSpace = 'pre-wrap';
      body.style.lineHeight = '1.5';

      // Image above or below as selected
      if (notice.image && (!notice.imagePosition || notice.imagePosition === 'above')) {
        const img = document.createElement('img');
        img.src = notice.image;
        img.style.width = '100%';
        img.style.maxHeight = '220px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '6px';
        img.style.marginBottom = '8px';
        body.appendChild(img);
      }

      const contentDiv = document.createElement('div');
      contentDiv.innerText = notice.content || '';
      body.appendChild(contentDiv);

      if (notice.image && notice.imagePosition === 'below') {
        const img2 = document.createElement('img');
        img2.src = notice.image;
        img2.style.width = '100%';
        img2.style.maxHeight = '220px';
        img2.style.objectFit = 'cover';
        img2.style.borderRadius = '6px';
        img2.style.marginTop = '8px';
        body.appendChild(img2);
      }

      row.appendChild(header);
      row.appendChild(body);

      // Badge info row
      const meta = document.createElement('div');
      meta.style.display = 'flex';
      meta.style.justifyContent = 'space-between';
      meta.style.alignItems = 'center';
      meta.style.marginTop = '8px';
      meta.style.fontSize = '0.85rem';
      meta.style.color = '#95a5a6';
      meta.innerHTML = `<div>Priority: ${notice.priority || 'normal'}</div>
                        <div>${notice.expiresAt ? `Expires: ${new Date(notice.expiresAt).toLocaleString()}` : 'No expiry'}</div>`;

      row.appendChild(meta);

      container.appendChild(row);
    });

    list.appendChild(container);
  });
}