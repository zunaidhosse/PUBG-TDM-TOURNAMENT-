export function renderNoticeSection() {
  const el = document.getElementById('notice-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">📢 Notice Board</h2>
    <div class="tournament-info">
        <div class="info-card">
            <h3>Tournament Type</h3>
            <p id="tournament-type">1v1</p>
        </div>
        <div class="info-card">
            <h3>Team Limit</h3>
            <p id="team-limit">64</p>
        </div>
        <div class="info-card">
            <h3>Registration Status</h3>
            <p id="registration-status">OPEN</p>
        </div>
    </div>
    <div id="room-access-container" style="margin-bottom: 20px;"></div>
    <div id="prize-pool" class="prize-pool">Loading prize pool...</div>
    <div class="notice-board" id="notice-board">Loading...</div>
  `;
}

