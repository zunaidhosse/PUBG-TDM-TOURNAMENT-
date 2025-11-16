import { db } from '../core/firebase.js';

let currentFilter = 'All'; // 'All', 'Approved', 'Pending'
let lastSnapshot = null;

// Helper to read simulated teams persisted in localStorage
function getSimulated() {
  try {
    const raw = localStorage.getItem('simulatedTeams');
    const data = raw ? JSON.parse(raw) : [];
    if (Array.isArray(data)) return data.map(t => ({ ...t, __sim: true }));
  } catch {}
  return [];
}

function renderTeamsList(snapshot) {
  if (!snapshot) return;
  lastSnapshot = snapshot;

  const list = document.getElementById('registrations-list');
  const tEl = document.getElementById('total-teams-count');
  const aEl = document.getElementById('approved-teams-count');
  const pEl = document.getElementById('pending-teams-count');
  
  if (!list) return;

  list.innerHTML = '';
  const items = [];
  snapshot.forEach(child => items.push({ ...child.val(), id: child.key, __sim: false }));

  // Merge in simulated teams (frontend-only), visible to user panel as well
  const sim = getSimulated();
  const merged = [...items, ...sim];
  
  const total = merged.length;
  const approved = merged.filter(t => t.status === 'Approved').length;
  const pending = total - approved;
  
  if (tEl) tEl.textContent = total;
  if (aEl) aEl.textContent = approved;
  if (pEl) pEl.textContent = pending;

  let view = merged;
  
  // 1. Apply status filter
  if (currentFilter === 'Approved') {
      view = view.filter(t => t.status === 'Approved');
  } else if (currentFilter === 'Pending') {
      view = view.filter(t => t.status !== 'Approved');
  }
  
  // 2. Apply search filter
  const query = (document.getElementById('teams-search')?.value || '').toLowerCase();
  if (query) {
      // Search in teamName and gameId
      view = view.filter(t => ((t.teamName||'')+(t.gameId||'')).toLowerCase().includes(query));
  }

  // Sort by registeredAt desc for consistency
  view.sort((a,b)=> (b.registeredAt||0)-(a.registeredAt||0));

  if (sim.length) {
    const simBanner = document.createElement('div');
    simBanner.className = 'alert alert-success';
    simBanner.textContent = 'Includes simulated teams for testing';
    list.appendChild(simBanner);
  }

  view.forEach(team => {
    const card = document.createElement('div');
    card.className = 'registration-card';
    const badge = team.__sim ? `<span style="font-size:0.7rem; background:rgba(52,152,219,0.25); border:1px solid #3498db; padding:2px 6px; border-radius:999px; margin-left:6px;">Simulated</span>` : '';
    
    const contactIcons = [];
    if (team.whatsapp) contactIcons.push('📱');
    if (team.discord) contactIcons.push('<span style="color:#5865F2;">💬</span>');
    if (team.telegram) contactIcons.push('<span style="color:#0088cc;">✈️</span>');
    const contactDisplay = contactIcons.length ? contactIcons.join(' ') : '<span style="color:#95a5a6;">No contact</span>';
    
    card.innerHTML = `
      <h3>${team.teamName}${badge}</h3>
      <p>Game ID: <span style="font-weight:700;">${team.gameId || 'N/A'}</span></p>
      <p style="font-size:0.85rem;">Contacts: ${contactDisplay}</p>
      <p>Status: <span style="color: ${team.status === 'Approved' ? '#2ecc71' : '#f39c12'}">${team.status || 'Pending'}</span></p>
    `;
    list.appendChild(card);
  });

  if (view.length === 0) list.innerHTML = '<p class="empty-message">No teams found matching current criteria</p>';
}

export function initTeams() {
  // Initial subscription to registrations
  db().ref('registrations').on('value', renderTeamsList);

  // Setup search input listener
  const ts = document.getElementById('teams-search');
  if (ts) ts.addEventListener('input', () => {
    // Rerun render function with cached snapshot
    if (lastSnapshot) renderTeamsList(lastSnapshot);
  });
  
  // Setup filter button listeners
  const filters = document.getElementById('team-status-filters');
  if (filters) {
      filters.querySelectorAll('.btn-filter').forEach(btn => {
          btn.addEventListener('click', () => {
              filters.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
              btn.classList.add('active');
              currentFilter = btn.getAttribute('data-filter');
              if (lastSnapshot) renderTeamsList(lastSnapshot);
          });
      });
  }
}

