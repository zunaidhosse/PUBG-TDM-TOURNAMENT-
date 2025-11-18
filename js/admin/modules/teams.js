import { db } from '../../core/firebase.js';
import { toast } from './toast.js';

export function initTeamsAdmin() {
  // Real-time registrations listener
  db().ref('registrations').on('value', snap => {
    const list = document.getElementById('registrations-list');
    if (!list) return;
    
    list.innerHTML = '';
    const items = [];
    snap.forEach(c => items.push({ id: c.key, ...c.val() }));
    
    const total = items.length;
    const approved = items.filter(t => t.status === 'Approved').length;
    const pending = items.filter(t => t.status !== 'Approved').length;
    
    const tEl = document.getElementById('total-teams');
    const aEl = document.getElementById('approved-teams');
    const pEl = document.getElementById('pending-teams');
    if (tEl) tEl.textContent = total;
    if (aEl) aEl.textContent = approved;
    if (pEl) pEl.textContent = pending;

    items.sort((a,b)=> (b.registeredAt||0)-(a.registeredAt||0));
    
    if (items.length === 0) {
      list.innerHTML = '<p class="empty-message">No registrations yet</p>';
      return;
    }
    
    items.forEach((team, idx) => {
      const card = document.createElement('div');
      card.className = 'registration-card';
      
      const isApproved = team.status === 'Approved';
      const statusColor = isApproved ? '#2ecc71' : '#f39c12';
      
      const contactsHtml = [];
      if (team.whatsapp) contactsHtml.push(`📱 ${team.whatsapp}`);
      const contactsDisplay = contactsHtml.length ? contactsHtml.join(' • ') : '<span style="color:#95a5a6;">No contacts</span>';
      
      const dateStr = team.registeredAt ? new Date(team.registeredAt).toLocaleString() : 'Recent';
      
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <h3 style="margin:0;">#${idx + 1} ${team.teamName}</h3>
          <span style="padding:4px 10px;border-radius:999px;background:rgba(${isApproved ? '46,204,113' : '243,156,18'},0.2);border:1px solid ${statusColor};color:${statusColor};font-weight:900;font-size:0.85rem;">
            ${isApproved ? '✅ Approved' : '⏳ Pending'}
          </span>
        </div>
        <p><strong>Game ID:</strong> ${team.gameId || 'N/A'}</p>
        <p style="font-size:0.85rem;margin:4px 0;">${contactsDisplay}</p>
        <p style="font-size:0.8rem;color:#95a5a6;margin:8px 0 0;">Registered: ${dateStr}</p>
        <div style="display:flex;gap:8px;margin-top:12px;">
          <button class="btn btn-success approve-btn" ${isApproved ? 'disabled' : ''}>
            ${isApproved ? 'Already Approved' : 'Approve'}
          </button>
          <button class="btn btn-danger delete-btn">Delete</button>
        </div>
      `;
      
      const approveBtn = card.querySelector('.approve-btn');
      const deleteBtn = card.querySelector('.delete-btn');
      
      if (!isApproved) {
        approveBtn.addEventListener('click', async () => {
          try {
            await db().ref('registrations/'+team.id).update({ status: 'Approved' });
            toast('success', `${team.teamName} approved`);
          } catch (e) {
            toast('danger', 'Failed to approve');
          }
        });
      }
      
      deleteBtn.addEventListener('click', async () => {
        if (!confirm(`Delete registration for ${team.teamName}?`)) return;
        try {
          await db().ref('registrations/'+team.id).remove();
          toast('success', 'Registration deleted');
        } catch (e) {
          toast('danger', 'Failed to delete');
        }
      });
      
      list.appendChild(card);
    });
  });

  // Force delete by team name
  const forceBtn = document.getElementById('force-delete-btn');
  if (forceBtn) {
    forceBtn.addEventListener('click', async () => {
      const name = (document.getElementById('delete-team-name')?.value || '').trim();
      if (!name) return toast('danger','Enter exact team name');

      try {
        const q = await db().ref('registrations').orderByChild('teamName').equalTo(name).once('value');
        if (!q.exists()) return toast('danger','No team found with that name');
        const updates = {};
        q.forEach(s => { updates[s.key] = null; });
        await db().ref('registrations').update(updates);
        toast('success','Team deleted');
        document.getElementById('delete-team-name').value = '';
      } catch {
        toast('danger','Delete failed');
      }
    });
  }

  // Delete all approved teams
  const deleteAllBtn = document.getElementById('delete-all-btn');
  if (deleteAllBtn) {
    deleteAllBtn.addEventListener('click', async () => {
      if (!confirm('Delete ALL approved teams? This cannot be undone.')) return;

      try {
        const q = await db().ref('registrations').orderByChild('status').equalTo('Approved').once('value');
        if (q.exists()) {
          const updates = {};
          q.forEach(s => { updates[s.key] = null; });
          await db().ref('registrations').update(updates);
        }
        await db().ref('settings/registrationOpen').set(true);
        toast('success','All approved teams deleted. Registration is now open.');
      } catch {
        toast('danger','Bulk delete failed');
      }
    });
  }
}