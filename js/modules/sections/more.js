export function renderMoreSection() {
  const el = document.getElementById('more-section');
  if (!el) return;

  el.innerHTML = `
    <h2 class="section-title">⚡ More</h2>
    
    <div style="background:linear-gradient(135deg, rgba(52,152,219,0.2), rgba(52,152,219,0.1));border:2px solid #3498db;border-radius:12px;padding:16px;margin-bottom:20px;">
      <h3 style="color:#3498db;margin-bottom:12px;">🌍 Tournament Communication Channels</h3>
      <p style="color:#ecf0f1;margin-bottom:12px;line-height:1.5;">Connect with players worldwide! Join our official groups to coordinate matches, find opponents, and get tournament updates:</p>
      <div style="display:grid;gap:10px;">
        <a class="quick-card" href="https://chat.whatsapp.com/DZCZ9RIrDXMAQibGKOvDxt?mode=wwt" target="_blank" rel="noopener" style="background:linear-gradient(135deg, rgba(37,211,102,0.2), rgba(37,211,102,0.1));border-color:#25D366;">
          💬 Join WhatsApp Group
        </a>
        <a class="quick-card" href="https://discord.gg/your-server" target="_blank" rel="noopener" style="background:linear-gradient(135deg, rgba(88,101,242,0.2), rgba(88,101,242,0.1));border-color:#5865F2;">
          💬 Join Discord Server
        </a>
        <a class="quick-card" href="https://t.me/your-group" target="_blank" rel="noopener" style="background:linear-gradient(135deg, rgba(0,136,204,0.2), rgba(0,136,204,0.1));border-color:#0088cc;">
          💬 Join Telegram Group
        </a>
      </div>
      <p style="color:#95a5a6;margin-top:12px;font-size:0.85rem;text-align:center;">
        ⚡ Best for international players who don't share contact info
      </p>
    </div>
    
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
      <button class="quick-card" onclick="navigateToSection('uc-shop-section')">💎 UC Shop</button>
      <a class="quick-card" id="quick-live" href="#" target="_blank" rel="noopener">📺 Watch Live</a>
      <button class="quick-card" onclick="window.shareApp && window.shareApp()">📱 Share App</button>
      <a class="quick-card" href="Price banner.png" download>🖼️ Download Banner</a>
      <button class="quick-card" onclick="navigateToSection('live-feed-section')">📡 Live Feed</button>
      <button class="quick-card" onclick="navigateToSection('achievements-section')">🏅 Achievements</button>
      <button class="quick-card" onclick="navigateToSection('progress-section')">📈 Progress</button>
    </div>
  `;
}