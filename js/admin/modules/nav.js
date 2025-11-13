export function initAdminNav() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      const targetId = btn.getAttribute('data-target');
      const target = document.getElementById(targetId);
      if (target) target.classList.add('active');
      btn.classList.add('active');
    });
  });
}

