export function renderUCShopSection() {
  const el = document.getElementById('uc-shop-section');
  if (!el) return;
  
  el.innerHTML = `
    <div id="uc-marquee" class="uc-marquee">Loading offers...</div>
    <h2 class="section-title">🏪 UC Shop</h2>
    <div id="game-id-profile" style="margin-bottom: 20px;">
      <!-- Game ID input area -->
    </div>
    <div id="uc-packages" class="uc-packages">Loading...</div>
    <div id="uc-notice" class="uc-bottom-notice"></div>
    <h3 style="margin:12px 0 6px;">UC Gallery</h3>
    <div class="winners-grid" id="uc-gallery">Loading...</div>
  `;
}

