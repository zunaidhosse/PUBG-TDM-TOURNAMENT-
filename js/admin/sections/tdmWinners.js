export function renderTdmWinners() {
  const el = document.getElementById('tdm-winners-admin-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">🏆 TDM Winner 🏆 3D (Admin)</h2>
    
    <div class="form-group">
      <label for="tdm-winner-title">Winner Title</label>
      <input type="text" id="tdm-winner-title" placeholder="e.g., MVP - Room 1">
    </div>
    <div class="form-group">
      <label for="tdm-winner-url">Image URL (Optional)</label>
      <input type="text" id="tdm-winner-url" placeholder="Paste image URL">
    </div>
    <!-- New: Prize status at creation -->
    <div class="form-group">
      <label for="tdm-winner-prize">Prize Status</label>
      <select id="tdm-winner-prize">
        <option value="pending">Pending (প্রাইজ মানি এখনও দেওয়া হয়নি)</option>
        <option value="paid">Paid (প্রাইজ মানি দেওয়া হয়েছে)</option>
      </select>
    </div>
    <button class="btn btn-success" id="add-tdm-winner-btn">OK (Add Winner)</button>
    
    <h3 style="margin-top: 20px;">Published TDM Winners</h3>
    <div id="tdm-winners-admin-list" style="margin-top: 10px;"></div>
  `;
}

