export function renderWinners() {
  const el = document.getElementById('winner-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">🏆 Winner Management</h2>
    <div class="form-group">
      <label for="winner-title">Winner Title</label>
      <input type="text" id="winner-title" placeholder="Champion - Round 1">
    </div>
    <div class="form-group">
      <label for="winner-image">Winner Image URL</label>
      <input type="text" id="winner-image" placeholder="Enter image URL">
    </div>
    <div class="form-group">
      <label for="winner-description">Description (Optional)</label>
      <textarea id="winner-description" rows="3" placeholder="Add description"></textarea>
    </div>
    <button class="btn btn-success" id="add-winner-btn">Add Winner</button>
    <div class="winner-preview" id="winner-preview"></div>
    <h3 style="margin-top: 20px;">Published Winners</h3>
    <div id="winners-list"></div>
  `;
}

