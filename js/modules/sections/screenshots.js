export function renderScreenshotsSection() {
  const el = document.getElementById('screenshots-section');
  if (!el) return;

  el.innerHTML = `
    <h2 class="section-title">📸 Match Screenshots</h2>
    <div style="background: rgba(46, 204, 113, 0.2); border: 1px solid #2ecc71; border-radius: 8px; padding: 15px; margin-bottom: 20px; text-align: center;">
        <h3 style="color: #2ecc71; margin-bottom: 10px;">📤 Submit Your Screenshot</h3>
        <p style="color: #ecf0f1; margin-bottom: 15px;">Upload your match screenshots to our WhatsApp group</p>
        <button class="btn btn-primary" onclick="window.open('https://chat.whatsapp.com/DZCZ9RIrDXMAQibGKOvDxt?mode=wwt', '_blank')" style="font-size: 0.95rem; padding: 10px 24px;">📸 Submit Screenshot</button>
    </div>
    <h3 style="margin-bottom: 15px;">📷 All Published Screenshots</h3>
    <div class="winners-grid" id="screenshots-grid" style="max-height: none; overflow-y: visible;">Loading...</div>
  `;
}