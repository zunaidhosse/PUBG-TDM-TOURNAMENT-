export function toast(type, msg) {
  const el = document.createElement('div');
  el.className = 'alert ' + (type === 'success' ? 'alert-success' : 'alert-danger');
  el.textContent = msg;
  const container = document.getElementById('alert-container');
  if (container) {
    container.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  }
}

