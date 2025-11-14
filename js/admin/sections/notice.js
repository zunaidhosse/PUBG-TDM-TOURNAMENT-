export function renderNotice() {
  const el = document.getElementById('notice-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">📢 Notice Board</h2>
    <div class="form-group">
      <label for="notice-content">Notice Content</label>
      <textarea id="notice-content" rows="4" placeholder="Enter notice content"></textarea>
    </div>
    <button class="btn btn-primary" id="save-notice-btn">Save Notice</button>
    <div class="form-group" style="margin-top:16px;">
      <label>🏆 Tournament Prize Pool</label>
      <div class="form-group">
        <label for="prize-first">🥇 1st Place (UC)</label>
        <input type="number" id="prize-first" placeholder="e.g., 500">
      </div>
      <div class="form-group">
        <label for="prize-second">🥈 2nd Place (UC)</label>
        <input type="number" id="prize-second" placeholder="e.g., 200">
      </div>
      <div class="form-group">
        <label for="prize-third">🥉 3rd Place (UC)</label>
        <input type="number" id="prize-third" placeholder="e.g., 100">
      </div>
      <button class="btn btn-success" id="save-prize-btn">Save Prize Pool</button>
    </div>
    <div id="prize-preview" class="banner-preview" style="height:auto; padding:12px; border:1px dashed #3498db; border-radius:8px; margin-top:12px;"></div>
  `;
}

