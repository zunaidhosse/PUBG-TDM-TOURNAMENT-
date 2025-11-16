export function renderNotice() {
  const el = document.getElementById('notice-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">📢 Notice Board Management</h2>
    
    <div class="form-group">
      <label for="notice-title">Notice Title <span style="color:#e74c3c;">*</span></label>
      <input type="text" id="notice-title" placeholder="e.g., Important Match Update">
    </div>
    
    <div class="form-group">
      <label for="notice-content">Notice Content <span style="color:#e74c3c;">*</span></label>
      <textarea id="notice-content" rows="6" placeholder="Enter notice content (supports line breaks and bullet points with -, *, •)"></textarea>
    </div>
    
    <div class="form-group">
      <label for="notice-image">Image URL (Optional)</label>
      <input type="text" id="notice-image" placeholder="https://example.com/image.jpg">
    </div>
    
    <div class="form-group">
      <label for="notice-image-position">Image Position (if image provided)</label>
      <select id="notice-image-position">
        <option value="above">Above Content (উপরে)</option>
        <option value="below">Below Content (নিচে)</option>
      </select>
    </div>
    
    <div class="form-group">
      <label for="notice-priority">Priority</label>
      <select id="notice-priority">
        <option value="normal">Normal</option>
        <option value="important">Important (Highlighted)</option>
        <option value="pinned">Pinned (Always on Top)</option>
      </select>
    </div>
    
    <div class="form-group">
      <label for="notice-expires">Expires On (Optional)</label>
      <input type="datetime-local" id="notice-expires">
    </div>
    
    <button class="btn btn-success" id="add-notice-btn">Add Notice</button>
    
    <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 24px;">
      <h3 style="color: #3498db; margin:0;">Published Notices</h3>
    </div>
    <div id="notices-admin-list" style="margin-top:12px; max-height:600px; overflow-y:auto; border:1px solid rgba(52,152,219,0.3); border-radius:8px; padding:10px; display: block;"></div>
    
    <div class="form-group" style="margin-top:20px;">
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
  
  // Note: Show/Hide toggle removed — notices list is always visible by default
}