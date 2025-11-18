import { db } from '../../core/firebase.js';
import { toast } from './toast.js';

let simulateTeamsActive = false;
let simulatedTeams = [];

function saveSim() {
  try { localStorage.setItem('simulatedTeams', JSON.stringify(simulatedTeams)); } catch {}
}
function loadSim() {
  try {
    const raw = localStorage.getItem('simulatedTeams');
    if (!raw) return false;
    const data = JSON.parse(raw) || [];
    if (Array.isArray(data) && data.length) {
      simulatedTeams = data;
      simulateTeamsActive = true;
      return true;
    }
  } catch {}
  return false;
}

function updateStatsFromSim() {
  if (!simulateTeamsActive) return;
  const total = simulatedTeams.length;
  const approved = simulatedTeams.filter(t => t.status === 'Approved').length;
  const pending = total - approved;
  const tEl = document.getElementById('total-teams');
  const aEl = document.getElementById('approved-teams');
  const pEl = document.getElementById('pending-teams');
  if (tEl) tEl.textContent = total;
  if (aEl) aEl.textContent = approved;
  if (pEl) pEl.textContent = pending;
}

function renderSimulatedTeams() {
  const list = document.getElementById('registrations-list');
  if (!list) return;
  list.innerHTML = '';

  const simBanner = document.createElement('div');
  simBanner.className = 'alert alert-success';
  simBanner.textContent = 'Displaying simulated teams (frontend only)';
  list.appendChild(simBanner);

  const items = [...simulatedTeams].sort((a,b)=>(b.registeredAt||0)-(a.registeredAt||0));
  items.forEach(team => {
    const card = document.createElement('div');
    card.className = 'registration-card';
    card.innerHTML = `
      <h3>${team.teamName} <span style="font-size:0.7rem; background:rgba(52,152,219,0.25); border:1px solid #3498db; padding:2px 6px; border-radius:999px; margin-left:6px;">Simulated</span></h3>
      <p>Status: <span style="color:${team.status==='Approved'?'#2ecc71':'#f39c12'}">${team.status}</span></p>
      <div style="margin-top:8px;">
        <button class="btn btn-success">Approve</button>
        <button class="btn btn-danger">Delete</button>
      </div>
    `;
    const approveBtn = card.querySelector('.btn-success');
    const deleteBtn = card.querySelector('.btn-danger');
    approveBtn.addEventListener('click', () => {
      const t = simulatedTeams.find(x => x.id === team.id);
      if (t) { t.status = 'Approved'; saveSim(); renderSimulatedTeams(); updateStatsFromSim(); }
    });
    deleteBtn.addEventListener('click', () => {
      simulatedTeams = simulatedTeams.filter(x => x.id !== team.id);
      saveSim();
      renderSimulatedTeams();
      updateStatsFromSim();
    });
    list.appendChild(card);
  });

  updateStatsFromSim();
}

export function initTeamsAdmin() {
  // Load simulation state if available
  if (loadSim()) {
    renderSimulatedTeams();
    updateStatsFromSim();
  }

  // Live DB registrations (disabled when simulation is active)
  db().ref('registrations').on('value', snap => {
    if (simulateTeamsActive) return;
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
    items.forEach(team => {
      const card = document.createElement('div');
      card.className = 'registration-card';
      
      const contactsHtml = [];
      if (team.whatsapp) contactsHtml.push(`📱 ${team.whatsapp}`);
      const contactsDisplay = contactsHtml.length ? contactsHtml.join(' • ') : '<span style="color:#95a5a6;">No contacts</span>';
      
      card.innerHTML = `
        <h3>${team.teamName}</h3>
        <p>Game ID: <span style="font-weight:700;">${team.gameId || 'N/A'}</span></p>
        <p style="font-size:0.85rem;margin:4px 0;">${contactsDisplay}</p>
        <p>Status: <span style="color:${team.status==='Approved'?'#2ecc71':'#f39c12'}">${team.status || 'Pending'}</span></p>
        <div style="margin-top:8px;">
          <button class="btn btn-success">Approve</button>
          <button class="btn btn-danger">Delete</button>
        </div>
      `;
      const approveBtn = card.querySelector('.btn-success');
      const deleteBtn = card.querySelector('.btn-danger');
      approveBtn.addEventListener('click', () => {
        db().ref('registrations/'+team.id).update({ status: 'Approved' }).then(()=> toast('success','Team approved'));
      });
      deleteBtn.addEventListener('click', () => {
        if (!confirm('Delete this registration?')) return;
        db().ref('registrations/'+team.id).remove().then(()=> toast('success','Team deleted'));
      });
      list.appendChild(card);
    });
  });

  // Force delete by team name
  const forceBtn = document.getElementById('force-delete-btn');
  if (forceBtn) {
    forceBtn.addEventListener('click', async () => {
      const name = (document.getElementById('delete-team-name').value || '').trim();
      if (!name) return toast('danger','Enter exact team name');

      if (simulateTeamsActive) {
        const before = simulatedTeams.length;
        simulatedTeams = simulatedTeams.filter(t => t.teamName !== name);
        const removed = before !== simulatedTeams.length;
        saveSim();
        renderSimulatedTeams();
        updateStatsFromSim();
        return toast(removed ? 'success' : 'danger', removed ? 'Team deleted (simulated)' : 'No team found (simulated)');
      }

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

  // Delete all
  const deleteAllBtn = document.getElementById('delete-all-btn');
  if (deleteAllBtn) {
    deleteAllBtn.addEventListener('click', async () => {
      if (!confirm('Delete ALL approved teams? This cannot be undone.')) return;

      if (simulateTeamsActive) {
        simulatedTeams = simulatedTeams.filter(t => t.status !== 'Approved');
        saveSim();
        renderSimulatedTeams();
        updateStatsFromSim();
        try { await db().ref('settings/registrationOpen').set(true); } catch {}
        return toast('success','All approved teams deleted (simulated). Registration is now open.');
      }

      try {
        const q = await db().ref('registrations').orderByChild('status').equalTo('Approved').once('value');
        if (q.exists()) {
          const updates = {};
          q.forEach(s => { updates[s.key] = null; });
          await db().ref('registrations').update(updates);
        }
        try { await db().ref('settings/registrationOpen').set(true); } catch {}
        toast('success','All approved teams deleted. Registration is now open.');
      } catch {
        toast('danger','Bulk delete failed');
      }
    });
  }
}