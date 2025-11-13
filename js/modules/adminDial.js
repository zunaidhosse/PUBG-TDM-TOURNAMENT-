export function initAdminDial() {
  const input = document.getElementById('admin-dial-input');
  const btn = document.getElementById('admin-dial-btn');
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

  btn.addEventListener('click', tryDial);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') tryDial();
  });
}

