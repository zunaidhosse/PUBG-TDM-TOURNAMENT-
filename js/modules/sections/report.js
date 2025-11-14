export function renderReportSection() {
  const el = document.getElementById('report-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">⚠️ Report Issue</h2>
    <div class="registration-form">
        <div class="form-group">
            <label for="report-type">Issue Type</label>
            <select id="report-type">
                <option value="technical">Technical Problem</option>
                <option value="match">Match Issue</option>
                <option value="payment">Payment Issue</option>
                <option value="other">Other</option>
            </select>
        </div>
        <div class="form-group">
            <label for="report-desc">Description</label>
            <textarea id="report-desc" rows="4" placeholder="Describe your issue..."></textarea>
        </div>
        <button class="btn btn-primary" id="submit-report-btn">Submit Report</button>
    </div>
    <div id="my-reports" style="margin-top: 20px;">
        <h3>My Reports</h3>
        <div id="reports-list"></div>
    </div>
  `;
}

