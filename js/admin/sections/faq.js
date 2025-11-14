export function renderFAQ() {
  const el = document.getElementById('faq-admin-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">❓ FAQ Admin</h2>
    <div class="form-group">
      <label for="faq-question">Question</label>
      <input type="text" id="faq-question" placeholder="Enter question">
    </div>
    <div class="form-group">
      <label for="faq-answer">Answer</label>
      <textarea id="faq-answer" rows="3" placeholder="Enter answer"></textarea>
    </div>
    <button class="btn btn-success" id="add-faq-btn">Add FAQ</button>
    <div id="faq-admin-list" style="margin-top: 20px;"></div>
  `;
}

