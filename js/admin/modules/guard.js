export function initAdminGuard() {
  const params = new URLSearchParams(window.location.search);
  const isPreview = params.get('preview') === '1' || params.get('admin') === '1';
  if (!isPreview) {
    document.documentElement.style.visibility = 'hidden';
    window.location.replace('./index.html');
  } else {
    document.documentElement.style.visibility = 'visible';
  }
}

