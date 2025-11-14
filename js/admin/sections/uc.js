export function renderUC() {
  const el = document.getElementById('uc-admin-section');
  if (!el) return;

  el.innerHTML = `
    <h2 class="section-title">🏪 UC Shop Admin</h2>
    <div class="form-group">
      <label>Scrolling Offer Text</label>
      <input type="text" id="uc-offer-input" placeholder="e.g., 🔥 Eid Offer! 250 UC + 20 Bonus UC মাত্র BDT 500 / SAR 300 🔥">
      <button class="btn btn-success" id="uc-add-offer-btn">Add Offer</button>
      <div id="uc-offers-list" class="registrations-list" style="margin-top:10px;"></div>
    </div>
    <div class="form-group" style="margin-top:12px;">
      <label>Add UC Package</label>
      <div style="display:grid; grid-template-columns: repeat(2,1fr); gap:8px;">
        <input type="number" id="uc-pkg-uc" placeholder="UC (e.g., 250)">
        <input type="number" id="uc-pkg-bonus" placeholder="Bonus UC (e.g., 20)">
        <input type="number" id="uc-pkg-bdt" placeholder="BDT (e.g., 500)">
        <input type="number" id="uc-pkg-sar" placeholder="SAR (e.g., 300)">
      </div>
      <button class="btn btn-primary" id="uc-add-pkg-btn" style="margin-top:8px;">Add Package</button>
      <div id="uc-packages-admin" class="registrations-list" style="margin-top:10px;"></div>
    </div>
    <div class="form-group" style="margin-top:12px;">
      <label>Bottom Notice</label>
      <textarea id="uc-bottom-notice" rows="3" placeholder="e.g., Special Offer • Limited Time Bonus"></textarea>
      <button class="btn btn-success" id="uc-save-notice-btn" style="margin-top:8px;">Save Notice</button>
    </div>
    <div class="form-group" style="margin-top:12px;">
      <label>UC Gallery (Image + Title)</label>
      <input type="text" id="uc-img-title" placeholder="Image Title">
      <input type="text" id="uc-img-url" placeholder="Image URL (https://...)">
      <button class="btn btn-primary" id="uc-add-img-btn" style="margin-top:8px;">Add Image</button>
      <div id="uc-images-admin" class="registrations-list" style="margin-top:10px;"></div>
    </div>
  `;
}