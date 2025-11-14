export function renderScreenshots() {
  const el = document.getElementById('screenshot-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">📸 Screenshot Management</h2>
    <div class="form-group">
      <label for="screenshot-title">Screenshot Title</label>
      <input type="text" id="screenshot-title" placeholder="e.g., Round 1 Match 1">
    </div>
    <div class="form-group">
      <label for="screenshot-url">Screenshot Image URL</label>
      <input type="text" id="screenshot-url" placeholder="Enter screenshot image URL">
    </div>
    <button class="btn btn-success" id="add-screenshot-btn">Add Screenshot</button>
    <h3 style="margin-top: 20px;">Published Screenshots</h3>
    <div id="screenshots-list"></div>
  `;
}

