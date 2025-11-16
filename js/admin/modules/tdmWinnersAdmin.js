import { db } from '../../core/firebase.js';
import { toast } from './toast.js';

export function initTdmWinnersAdmin() {
  const titleIn = document.getElementById('tdm-winner-title');
  const urlIn = document.getElementById('tdm-winner-url');
  const addBtn = document.getElementById('add-tdm-winner-btn');
  const list = document.getElementById('tdm-winners-admin-list');

  const tdmWinnersRef = db().ref('tdmWinners');

  if (addBtn) {
    addBtn.addEventListener('click', async () => {
      const title = (titleIn?.value || '').trim();
      const imageUrl = (urlIn?.value || '').trim();
      // NEW: read prize status
      const prizeSelect = document.getElementById('tdm-winner-prize');
      const prizePaid = (prizeSelect?.value || 'pending') === 'paid';
      
      if (!title) return toast('danger','Title is required');
      
      try {
        await tdmWinnersRef.push({ 
          title, 
          imageUrl: imageUrl || null, 
          timestamp: Date.now(),
          prizePaid // NEW
        });
        toast('success','TDM Winner added');
        if (titleIn) titleIn.value = '';
        if (urlIn) urlIn.value = '';
        if (prizeSelect) prizeSelect.value = 'pending';
      } catch {
        toast('danger','Failed to add TDM Winner');
      }
    });
  }

  tdmWinnersRef.on('value', snap => {
    if (!list) return;
    list.innerHTML = '';
    
    const items = [];
    snap.forEach(c => {
      const data = c.val();
      if (data) {
        items.push({ id: c.key, ...data });
      }
    });
    items.sort((a,b)=> (b.timestamp||0)-(a.timestamp||0)); // Newest first

    if (items.length === 0) {
      list.innerHTML = '<p class="empty-message">No TDM Winners published</p>';
      return;
    }
    
    const scrollContainer = document.createElement('div');
    scrollContainer.style.maxHeight = '500px';
    scrollContainer.style.overflowY = 'auto';
    scrollContainer.style.display = 'flex';
    scrollContainer.style.flexDirection = 'column';
    scrollContainer.style.gap = '10px';
    
    items.forEach((w, idx) => {
      const div = document.createElement('div');
      div.className = 'registration-card';
      const imageHtml = w.imageUrl ? `<img src="${w.imageUrl}" style="width:100%;max-height:120px;object-fit:cover;border-radius:6px;margin-bottom:8px;">` : '';
      const statusBadge = w.prizePaid 
        ? `<span style="display:inline-block;padding:6px 10px;border-radius:999px;background:rgba(46,204,113,0.2);border:1px solid #2ecc71;color:#2ecc71;font-weight:900;">Prize: Paid ✅</span>`
        : `<span style="display:inline-block;padding:6px 10px;border-radius:999px;background:rgba(243,156,18,0.2);border:1px solid #f39c12;color:#f39c12;font-weight:900;">Prize: Pending ⏳</span>`;
      div.innerHTML = `
        ${imageHtml}
        <h4>${idx + 1}. 🏆 ${w.title}</h4>
        <p style="font-size:0.85rem;color:#95a5a6;">${new Date(w.timestamp).toLocaleString()}</p>
        <div style="display:flex;gap:8px;align-items:center;margin:6px 0;">
          ${statusBadge}
          <button class="btn btn-success" data-action="mark-paid">Mark Paid</button>
          <button class="btn btn-primary" data-action="mark-pending">Mark Pending</button>
          <button class="btn btn-danger" data-action="delete">Delete</button>
        </div>
      `;
      div.querySelector('[data-action="mark-paid"]').addEventListener('click', async () => {
        try { await tdmWinnersRef.child(w.id).update({ prizePaid: true }); toast('success','Marked as Paid'); } catch { toast('danger','Update failed'); }
      });
      div.querySelector('[data-action="mark-pending"]').addEventListener('click', async () => {
        try { await tdmWinnersRef.child(w.id).update({ prizePaid: false }); toast('success','Marked as Pending'); } catch { toast('danger','Update failed'); }
      });
      div.querySelector('[data-action="delete"]').addEventListener('click', () => {
        if (!confirm('Delete this TDM Winner entry?')) return;
        tdmWinnersRef.child(w.id).remove()
          .then(()=> toast('success','Deleted'))
          .catch(()=> toast('danger','Delete failed'));
      });
      scrollContainer.appendChild(div);
    });
    
    list.appendChild(scrollContainer);
  });
}