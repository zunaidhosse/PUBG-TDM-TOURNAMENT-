// Form validation utilities for registration
export function validateInput(input, minLength, maxLength, label, labelBn) {
  const errorEl = document.getElementById(`${input.id}-error`);
  const counterEl = document.getElementById(`${input.id}-counter`);
  const value = input.value.trim();
  
  if (counterEl) {
    counterEl.textContent = `${value.length}/${maxLength}`;
    counterEl.style.color = value.length > maxLength ? '#e74c3c' : '#95a5a6';
  }
  
  if (!errorEl) return true;
  
  if (value.length === 0) {
    errorEl.textContent = `${labelBn} আবশ্যক / ${label} is required`;
    errorEl.style.display = 'block';
    input.style.borderColor = '#e74c3c';
    return false;
  }
  
  if (value.length < minLength) {
    errorEl.textContent = `${labelBn} কমপক্ষে ${minLength} অক্ষর হতে হবে / ${label} must be at least ${minLength} characters`;
    errorEl.style.display = 'block';
    input.style.borderColor = '#f39c12';
    return false;
  }
  
  if (value.length > maxLength) {
    errorEl.textContent = `${labelBn} সর্বোচ্চ ${maxLength} অক্ষর / ${label} cannot exceed ${maxLength} characters`;
    errorEl.style.display = 'block';
    input.style.borderColor = '#e74c3c';
    return false;
  }
  
  errorEl.style.display = 'none';
  input.style.borderColor = '#2ecc71';
  return true;
}

export function validateWhatsApp(whatsappInput) {
  const errorEl = document.getElementById('whatsapp-number-error');
  const value = whatsappInput.value.trim();
  
  if (!errorEl) return true;
  
  if (value && !/^[+]?[\d\s-]{10,}$/.test(value)) {
    errorEl.textContent = 'সঠিক WhatsApp নম্বর দিন / Enter a valid WhatsApp number';
    errorEl.style.display = 'block';
    whatsappInput.style.borderColor = '#e74c3c';
    return false;
  }
  
  errorEl.style.display = 'none';
  whatsappInput.style.borderColor = value ? '#2ecc71' : '#3498db';
  return true;
}

export function setupValidationListeners(usernameInput, gameIdInput, whatsappInput) {
  const updateProgress = () => {
    const fields = [
      { el: usernameInput, valid: validateInput(usernameInput, 3, 20, 'Username', 'ইউজারনেম') },
      { el: gameIdInput, valid: validateInput(gameIdInput, 5, 15, 'Game ID', 'গেম আইডি') },
      { el: whatsappInput, valid: validateWhatsApp(whatsappInput) }
    ];
    
    const total = fields.length;
    const completed = fields.filter(f => f.valid && f.el.value.trim()).length;
    const percentage = Math.round((completed / total) * 100);
    
    const fillEl = document.getElementById('form-completion-fill');
    const textEl = document.getElementById('completion-text');
    
    if (fillEl) {
      fillEl.style.width = percentage + '%';
      // Add milestone celebration effects
      if (percentage === 33 || percentage === 66 || percentage === 100) {
        fillEl.style.animation = 'none';
        setTimeout(() => {
          fillEl.style.animation = '';
        }, 10);
      }
    }
    
    if (textEl) {
      textEl.textContent = `ফর্ম সম্পূর্ণতা: ${percentage}% / Form Completion: ${percentage}%`;
      textEl.setAttribute('data-percentage', percentage);
      
      // Update icon based on percentage
      if (percentage === 0) {
        textEl.style.setProperty('--icon', '"📊"');
      } else if (percentage < 50) {
        textEl.style.setProperty('--icon', '"⏳"');
      } else if (percentage < 100) {
        textEl.style.setProperty('--icon', '"🔄"');
      } else {
        textEl.style.setProperty('--icon', '"✅"');
      }
    }
    
    // Update progress steps
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach(s => s.classList.remove('active', 'completed'));
    
    if (percentage >= 1) {
      steps[0]?.classList.add('completed');
      if (percentage >= 33) steps[1]?.classList.add('active');
    } else {
      steps[0]?.classList.add('active');
    }
    
    if (percentage >= 66) {
      steps[1]?.classList.add('completed');
      steps[2]?.classList.add('active');
    }
    
    if (percentage === 100) {
      steps[2]?.classList.add('completed');
      // Celebration effect
      createConfetti();
    }
  };

  if (usernameInput) {
    usernameInput.addEventListener('input', () => {
      const valid = validateInput(usernameInput, 3, 20, 'Username', 'ইউজারনেম');
      const statusIcon = document.getElementById('game-username-status');
      if (statusIcon) statusIcon.textContent = valid && usernameInput.value.trim() ? '✓' : '';
      updateProgress();
    });
    usernameInput.addEventListener('blur', () => {
      validateInput(usernameInput, 3, 20, 'Username', 'ইউজারনেম');
      updateProgress();
    });
  }
  
  if (gameIdInput) {
    gameIdInput.addEventListener('input', () => {
      const valid = validateInput(gameIdInput, 5, 15, 'Game ID', 'গেম আইডি');
      const statusIcon = document.getElementById('game-id-status');
      if (statusIcon) statusIcon.textContent = valid && gameIdInput.value.trim() ? '✓' : '';
      updateProgress();
    });
    gameIdInput.addEventListener('blur', () => {
      validateInput(gameIdInput, 5, 15, 'Game ID', 'গেম আইডি');
      updateProgress();
    });
  }
  
  if (whatsappInput) {
    whatsappInput.addEventListener('input', () => {
      const valid = validateWhatsApp(whatsappInput);
      const statusIcon = document.getElementById('whatsapp-number-status');
      if (statusIcon) statusIcon.textContent = valid && whatsappInput.value.trim() ? '✓' : '';
      updateProgress();
    });
    whatsappInput.addEventListener('blur', () => {
      validateWhatsApp(whatsappInput);
      updateProgress();
    });
  }
}

// Confetti celebration effect when form is 100% complete
function createConfetti() {
  const colors = ['#3498db', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6'];
  const container = document.querySelector('.registration-form');
  if (!container) return;
  
  for (let i = 0; i < 15; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position: absolute;
      width: 8px;
      height: 8px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      top: 0;
      left: ${Math.random() * 100}%;
      border-radius: 50%;
      opacity: 1;
      pointer-events: none;
      z-index: 1000;
      animation: confettiFall ${1 + Math.random()}s ease-out forwards;
    `;
    container.style.position = 'relative';
    container.appendChild(confetti);
    
    setTimeout(() => confetti.remove(), 1500);
  }
}

// Add confetti animation to CSS via style injection
if (!document.querySelector('#confetti-style')) {
  const style = document.createElement('style');
  style.id = 'confetti-style';
  style.textContent = `
    @keyframes confettiFall {
      0% { 
        transform: translateY(0) rotate(0deg);
        opacity: 1;
      }
      100% { 
        transform: translateY(300px) rotate(720deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

