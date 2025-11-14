export function initNav() {
  const navButtons = document.querySelectorAll('.nav-btn');
  if (!navButtons || navButtons.length === 0) return;
  
  navButtons.forEach(button => {
    if (!button) return;
    
    button.addEventListener('click', () => {
      try {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        
        const targetId = button.getAttribute('data-target');
        if (!targetId) return;
        
        const target = document.getElementById(targetId);
        if (target) {
          target.classList.add('active');
        }
        button.classList.add('active');
      } catch (e) {
        console.error('Nav button error:', e);
      }
    });
  });
}

