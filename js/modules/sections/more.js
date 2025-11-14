export function renderMoreSection() {
  const el = document.getElementById('more-section');
  if (!el) return;

  el.innerHTML = `
    <h2 class="section-title">⚡ More</h2>
    <div class="quick-grid">
      <button class="quick-card" onclick="navigateToSection('my-match-section')">🎯 My Match</button>
      <button class="quick-card" onclick="navigateToSection('schedule-section')">📅 Schedule</button>
      <button class="quick-card" onclick="navigateToSection('notifications-section')">🔔 Notifications</button>
      <button class="quick-card" onclick="navigateToSection('team-stats-section')">📊 Statistics</button>
      <button class="quick-card" onclick="navigateToSection('rules-section')">📋 Rules</button>
      <button class="quick-card" onclick="navigateToSection('faq-section')">❓ FAQ</button>
      <button class="quick-card" onclick="navigateToSection('rankings-section')">🏅 Rankings</button>
      <button class="quick-card" onclick="navigateToSection('report-section')">⚠️ Report</button>
      <button class="quick-card" onclick="navigateToSection('history-section')">📜 History</button>
      <a class="quick-card" href="https://chat.whatsapp.com/DZCZ9RIrDXMAQibGKOvDxt?mode=wwt" target="_blank" rel="noopener">💬 Join WhatsApp</a>
      <button class="quick-card" onclick="navigateToSection('uc-shop-section')">💎 UC Shop</button>
      <a class="quick-card" id="quick-live" href="#" target="_blank" rel="noopener">📺 Watch Live</a>
      <button class="quick-card" onclick="window.shareApp && window.shareApp()">📱 Share App</button>
      <a class="quick-card" href="Price banner.png" download>🖼️ Download Banner</a>
      <button class="quick-card" onclick="navigateToSection('live-feed-section')">📡 Live Feed</button>
      <button class="quick-card" onclick="navigateToSection('achievements-section')">🏅 Achievements</button>
      <button class="quick-card" onclick="navigateToSection('room-section')">🎮 Room Code</button>
      <button class="quick-card" onclick="navigateToSection('progress-section')">📈 Progress</button>
    </div>
  `;
}