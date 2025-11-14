export function renderHistory() {
  const el = document.getElementById('history-admin-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">📜 History Admin</h2>
    <div class="form-group">
      <label for="history-title">Tournament Title</label>
      <input type="text" id="history-title" placeholder="e.g., Season 1 Championship">
    </div>
    <div class="form-group">
      <label for="history-winner">Winner</label>
      <input type="text" id="history-winner" placeholder="Champion team name">
    </div>
    <div class="form-group">
      <label for="history-date">Date</label>
      <input type="text" id="history-date" placeholder="e.g., January 2024">
    </div>
    <div class="form-group">
      <label for="history-image">Image URL (optional)</label>
      <input type="text" id="history-image" placeholder="Image URL">
    </div>
    <button class="btn btn-success" id="add-history-btn">Add Tournament</button>
    <div id="history-admin-list" style="margin-top: 20px;"></div>
  `;
}

