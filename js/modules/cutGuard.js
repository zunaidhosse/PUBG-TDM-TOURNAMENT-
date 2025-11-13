export function initCutGuard() {
  const overlay = document.getElementById('cut-guard');
  const msgEl = document.getElementById('cut-guard-msg');
  const input = document.getElementById('cut-guard-input');
  const okBtn = document.getElementById('cut-guard-ok');
  const cancelBtn = document.getElementById('cut-guard-cancel');
  let expectedDigit = null, proceedFn = null;

  function openGuard(label, onProceed) {
    expectedDigit = String(Math.floor(Math.random() * 9) + 1);
    proceedFn = onProceed;
    msgEl.textContent = `Enter the digit: ${expectedDigit}`;
    input.value = '';
    overlay.style.display = 'flex';
    input.focus();
  }
  function closeGuard() { overlay.style.display = 'none'; expectedDigit = null; proceedFn = null; }
  okBtn.addEventListener('click', () => {
    if (input.value.trim() === expectedDigit) { const fn = proceedFn; closeGuard(); fn && fn(); }
    else { input.style.borderColor = '#e74c3c'; setTimeout(()=> input.style.borderColor = '#3498db', 400); }
  });
  cancelBtn.addEventListener('click', closeGuard);

  const keywords = ['delete', 'remove', 'cut', 'কাট', 'ডিলিট', 'রিমুভ'];
  document.addEventListener('click', (e) => {
    const t = e.target.closest('button, a');
    if (!t || t.dataset.guardBypass === '1') return;
    const text = (t.textContent || '').toLowerCase();
    const hasKeyword = keywords.some(k => text.includes(k));
    const marked = t.dataset.cut === 'true' || t.classList.contains('btn-danger');
    if (hasKeyword || marked) {
      e.preventDefault(); e.stopPropagation();
      const href = t.tagName === 'A' ? t.getAttribute('href') : null;
      openGuard(text || 'Confirm', () => {
        t.dataset.guardBypass = '1';
        if (href) window.location.href = href; else t.click();
        setTimeout(() => { delete t.dataset.guardBypass; }, 0);
      });
    }
  });
}

