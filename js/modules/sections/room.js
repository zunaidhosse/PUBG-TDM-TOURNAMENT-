export function renderRoomSection() {
  const el = document.getElementById('room-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">🎮 Room Access</h2>
    <div id="room-display">Loading...</div>
  `;
}