export function initAdminDial() {
  const input = document.getElementById('admin-dial-input');
  const btn = document.getElementById('admin-dial-btn');
  const wrap = document.querySelector('.admin-dial');
  if (!input || !btn) return;

  const tryDial = () => {
    const code = (input.value || '').trim();
    if (code === '6472') {
      window.location.href = './admin.html?admin=1';
    } else {
      input.style.borderBottom = '2px solid #e74c3c';
      setTimeout(() => { input.style.borderBottom = 'none'; }, 400);
    }
  };

  btn.addEventListener('click', () => {
    if (wrap && wrap.classList.contains('collapsed')) { wrap.classList.remove('collapsed'); input.focus(); return; }
    tryDial();
  });
  input.addEventListener('blur', () => {
    if (!input.value.trim() && wrap) wrap.classList.add('collapsed');
  });
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') tryDial();
  });
}

