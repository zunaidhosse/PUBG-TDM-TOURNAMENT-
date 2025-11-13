export function initSplash() {
  const el = document.getElementById('splash-overlay');
  if (!el) return;
  const hide = () => {
    el.style.opacity = '0';
    setTimeout(() => { el.remove(); }, 420);
  };
  // Show immediately, hide after 5 seconds
  setTimeout(hide, 5000);
}