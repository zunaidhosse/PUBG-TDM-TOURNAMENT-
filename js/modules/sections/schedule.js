export function renderScheduleSection() {
  const el = document.getElementById('schedule-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">📅 Match Schedule</h2>
    <div id="schedule-timeline">Loading schedule...</div>
  `;
}

