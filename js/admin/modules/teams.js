import { db } from '../../core/firebase.js';
import { toast } from './toast.js';

export function initTeamsAdmin() {
  // Real-time registrations listener - ensure we get all data
  db().ref('registrations').off(); // Clear any existing listeners first
  db().ref('registrations').on('value', snap => {
    const list = document.getElementById('registrations-list');
    if (!list) return;
    
    list.innerHTML = '';
    
    // Build items array from snapshot
    const items = [];
    if (snap.exists()) {
      snap.forEach(child => {
        const data = child.val();
        if (data) {
          items.push({ id: child.key, ...data });
        }
      });
    }
    
    // Sort: Pending first (newest), then Approved (newest)
    items.sort((a, b) => {
      const aStatus = a.status === 'Approved' ? 1 : 0;
      const bStatus = b.status === 'Approved' ? 1 : 0;
      
      if (aStatus !== bStatus) {
        return aStatus - bStatus; // Pending (0) comes before Approved (1)
      }
      
      return (b.registeredAt || 0) - (a.registeredAt || 0); // Newest first within each group
    });
    
    if (items.length === 0) {
      list.innerHTML = '<p class="empty-message">No registrations yet</p>';
      return;
    }
    
    // Create a document fragment for better performance
    const fragment = document.createDocumentFragment();
    
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
          <button class="btn btn-success approve-btn" data-team-id="${team.id}" ${isApproved ? 'disabled' : ''}>
            ${isApproved ? 'Already Approved' : 'Approve'}
          </button>
          <button class="btn btn-danger delete-btn" data-team-id="${team.id}">Delete</button>
        </div>
      `;
      
      fragment.appendChild(card);
    });
    
    // Append all cards at once
    list.appendChild(fragment);
    
    // Attach event listeners after all cards are added
    list.querySelectorAll('.approve-btn').forEach(btn => {
      if (!btn.disabled) {
        btn.addEventListener('click', async (e) => {
          const teamId = e.target.getAttribute('data-team-id');
          const teamRef = db().ref('registrations/' + teamId);
          
          try {
            // First get the team data to show name in toast
            const teamSnap = await teamRef.once('value');
            const teamData = teamSnap.val();
            
            await teamRef.update({ status: 'Approved' });
            toast('success', `${teamData?.teamName || 'Team'} approved`);
          } catch (e) {
            console.error('Approval error:', e);
            toast('danger', 'Failed to approve');
          }
        });
      }
    });
    
    list.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const teamId = e.target.getAttribute('data-team-id');
        const teamRef = db().ref('registrations/' + teamId);
        
        try {
          const teamSnap = await teamRef.once('value');
          const teamData = teamSnap.val();
          
          if (!confirm(`Delete registration for ${teamData?.teamName || 'this team'}?`)) return;
          
          await teamRef.remove();
          toast('success', 'Registration deleted');
        } catch (e) {
          console.error('Delete error:', e);
          toast('danger', 'Failed to delete');
        }
      });
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