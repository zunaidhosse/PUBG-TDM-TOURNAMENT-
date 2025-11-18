import { db } from '../core/firebase.js';

let currentFilter = 'All';
let lastSnapshot = null;

function renderTeamsList(snapshot) {
  if (!snapshot) return;
  lastSnapshot = snapshot;

  const list = document.getElementById('registrations-list');
  const tEl = document.getElementById('total-teams-count');
  const aEl = document.getElementById('approved-teams-count');
  const pEl = document.getElementById('pending-teams-count');
  
  if (!list) return;

  list.innerHTML = '';
  
  // Build items array from snapshot
  const items = [];
  if (snapshot.exists()) {
    snapshot.forEach(child => {
      const data = child.val();
      if (data) {
        items.push({ ...data, id: child.key });
      }
    });
  }
  
  const total = items.length;
  const approved = items.filter(t => t.status === 'Approved').length;
  const pending = total - approved;
  
  if (tEl) tEl.textContent = total;
  if (aEl) aEl.textContent = approved;
  if (pEl) pEl.textContent = pending;

  let view = items;
  
  // Apply filter
  if (currentFilter === 'Approved') {
      view = view.filter(t => t.status === 'Approved');
  } else if (currentFilter === 'Pending') {
      view = view.filter(t => t.status !== 'Approved');
  }
  
  // Apply search
  const query = (document.getElementById('teams-search')?.value || '').toLowerCase();
  if (query) {
      view = view.filter(t => ((t.teamName||'')+(t.gameId||'')).toLowerCase().includes(query));
  }

  view.sort((a,b)=> (b.registeredAt||0)-(a.registeredAt||0));

  if (view.length === 0) {
    list.innerHTML = '<p class="empty-message">No teams found matching current criteria</p>';
    return;
  }

  // Create a document fragment for better performance
  const fragment = document.createDocumentFragment();

  view.forEach((team, idx) => {
    const card = document.createElement('div');
    const isApproved = team.status === 'Approved';
    card.className = `team-card ${isApproved ? 'team-approved' : 'team-pending'}`;
    
    const rank = idx + 1;
    const rankBadge = rank <= 3 ? 
      `<div class="team-rank-badge rank-${rank}">${rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}</div>` :
      `<div class="team-rank-badge">#{rank}</div>`;
    
    const statusBadge = isApproved ?
      `<div class="team-status-badge status-approved">✅ Approved</div>` :
      `<div class="team-status-badge status-pending">⏳ Pending</div>`;
    
    const contactIcons = [];
    if (team.whatsapp) contactIcons.push('<span class="contact-icon contact-whatsapp" title="WhatsApp">📱</span>');
    const contactDisplay = contactIcons.length ? 
      `<div class="team-contacts">${contactIcons.join('')}</div>` : 
      '<div class="team-contacts"><span class="no-contact">No contact info</span></div>';
    
    const registeredDate = team.registeredAt ? 
      new Date(team.registeredAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) : 'Recent';
    
    card.innerHTML = `
      ${rankBadge}
      <div class="team-card-header">
        <div class="team-name-section">
          <div class="team-name">${team.teamName}</div>
          <div class="team-game-id">
            <span class="game-id-icon">🆔</span>
            <span class="game-id-value">${team.gameId || 'N/A'}</span>
          </div>
        </div>
        ${statusBadge}
      </div>
      <div class="team-card-body">
        <div class="team-meta-row">
          <div class="team-meta-item">
            <span class="meta-label">Registered</span>
            <span class="meta-value">${registeredDate}</span>
          </div>
          <div class="team-meta-item">
            <span class="meta-label">Contact</span>
            ${contactDisplay}
          </div>
        </div>
      </div>
      <div class="team-card-footer">
        <div class="team-power-bar ${isApproved ? 'bar-approved' : 'bar-pending'}">
          <div class="power-fill"></div>
        </div>
      </div>
    `;
    
    fragment.appendChild(card);
  });
  
  // Append all cards at once
  list.appendChild(fragment);
}

export function initTeams() {
  // Clear any existing listener first, then set up real-time Firebase listener
  db().ref('registrations').off();
  db().ref('registrations').on('value', renderTeamsList);

  // Search functionality
  const ts = document.getElementById('teams-search');
  if (ts) {
    ts.addEventListener('input', () => {
      if (lastSnapshot) renderTeamsList(lastSnapshot);
    });
  }
  
  // Filter buttons
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

