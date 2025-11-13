import { db } from '../core/firebase.js';

export function initTeams() {
  // Helper to read simulated teams persisted in localStorage
  function getSimulated() {
    try {
      const raw = localStorage.getItem('simulatedTeams');
      const data = raw ? JSON.parse(raw) : [];
      if (Array.isArray(data)) return data.map(t => ({ ...t, __sim: true }));
    } catch {}
    return [];
  }

  db().ref('registrations').on('value', (snapshot) => {
    const list = document.getElementById('registrations-list');
    if (!list) return;
    list.innerHTML = '';
    const items = [];
    snapshot.forEach(child => items.push({ ...child.val(), id: child.key, __sim: false }));

    // Merge in simulated teams (frontend-only), visible to user panel as well
    const sim = getSimulated();
    const merged = [...items, ...sim];

    // Sort by registeredAt desc for consistency
    merged.sort((a,b)=> (b.registeredAt||0)-(a.registeredAt||0));

    if (sim.length) {
      const simBanner = document.createElement('div');
      simBanner.className = 'alert alert-success';
      simBanner.textContent = 'Includes simulated teams for testing';
      list.appendChild(simBanner);
    }

    merged.forEach(team => {
      const card = document.createElement('div');
      card.className = 'registration-card';
      const badge = team.__sim ? `<span style="font-size:0.7rem; background:rgba(52,152,219,0.25); border:1px solid #3498db; padding:2px 6px; border-radius:999px; margin-left:6px;">Simulated</span>` : '';
      card.innerHTML = `
        <h3>${team.teamName}${badge}</h3>
        <p>Status: <span style="color: ${team.status === 'Approved' ? '#2ecc71' : '#f39c12'}">${team.status || 'Pending'}</span></p>
      `;
      list.appendChild(card);
    });

    if (merged.length === 0) list.innerHTML = '<p class="empty-message">No teams registered yet</p>';
  });
}

