export function initNav() {
  document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      const targetId = button.getAttribute('data-target');
      const target = document.getElementById(targetId);
      if (target) target.classList.add('active');
      button.classList.add('active');
    });
  });
}

