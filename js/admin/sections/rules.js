export function renderRules() {
  const el = document.getElementById('rules-admin-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">📋 Rules Admin</h2>
    <div class="form-group">
      <label for="rules-content-admin">Tournament Rules</label>
      <textarea id="rules-content-admin" rows="10" placeholder="Enter tournament rules (one per line)"></textarea>
    </div>
    <button class="btn btn-primary" id="save-rules-btn">Save Rules</button>
  `;
}

