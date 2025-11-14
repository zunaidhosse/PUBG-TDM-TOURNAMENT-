export function renderTimer() {
  const el = document.getElementById('timer-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">⏱️ Timer & Live</h2>
    <div id="timer-admin-root"></div>
  `;
}

