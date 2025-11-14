import { db } from '../core/firebase.js';

export function initSchedule() {
  db().ref('schedule').on('value', (snapshot) => {
    const el = document.getElementById('schedule-timeline');
    if (!el) return;

    const schedules = [];
    snapshot.forEach(child => schedules.push({ id: child.key, ...child.val() }));
    schedules.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

    if (schedules.length === 0) {
      el.innerHTML = '<p class="empty-message">Match schedule will be announced soon</p>';
      return;
    }

    el.innerHTML = schedules.map(s => {
      const date = s.timestamp ? new Date(s.timestamp).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }) : 'TBD';
      const isPast = s.timestamp && s.timestamp < Date.now();
      
      return `
        <div class="schedule-card ${isPast ? 'past' : ''}">
          <div class="schedule-header">
            <span class="schedule-round">${s.round || 'Match'}</span>
            <span class="schedule-time">🕐 ${date}</span>
          </div>
          ${s.description ? `<p class="schedule-desc">${s.description}</p>` : ''}
          ${isPast ? '<div class="schedule-badge">Completed</div>' : '<div class="schedule-badge upcoming">Upcoming</div>'}
        </div>
      `;
    }).join('');
  });
}

