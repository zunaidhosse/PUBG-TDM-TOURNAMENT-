export function renderBanner() {
  const el = document.getElementById('banner-section');
  if (!el) return;

  el.innerHTML = `
    <h2 class="section-title">🖼️ Banner Management</h2>
    <div class="form-group">
      <label for="banner-url">Tournament Banner Image URL</label>
      <input type="text" id="banner-url" placeholder="Paste direct image link (e.g., https://.../banner.jpg)">
      <small style="color:#95a5a6; margin-top:6px;">Paste the banner image link and press OK — it will appear at the top of the user app instantly.</small>
    </div>
    <button class="btn btn-primary" id="save-banner-btn">OK</button>
    <div class="banner-preview" id="banner-preview"></div>
  `;
}