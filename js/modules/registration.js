import { db } from '../core/firebase.js';

export function initRegistration() {
  const btn = document.getElementById('register-btn');
  const usernameInput = document.getElementById('game-username');
  const gameIdInput = document.getElementById('game-id');
  const whatsappInput = document.getElementById('whatsapp-number');
  const termsCheckbox = document.getElementById('terms-checkbox');
  
  if (!btn) return;

  // Live validation
  const validateInput = (input, minLength, maxLength, label) => {
    const errorEl = document.getElementById(`${input.id}-error`);
    const counterEl = document.getElementById(`${input.id}-counter`);
    const value = input.value.trim();
    
    if (counterEl) {
      counterEl.textContent = `${value.length}/${maxLength}`;
      counterEl.style.color = value.length > maxLength ? '#e74c3c' : '#95a5a6';
    }
    
    if (!errorEl) return true;
    
    if (value.length === 0) {
      errorEl.textContent = `${label} is required`;
      errorEl.style.display = 'block';
      input.style.borderColor = '#e74c3c';
      return false;
    }
    
    if (value.length < minLength) {
      errorEl.textContent = `${label} must be at least ${minLength} characters`;
      errorEl.style.display = 'block';
      input.style.borderColor = '#f39c12';
      return false;
    }
    
    if (value.length > maxLength) {
      errorEl.textContent = `${label} cannot exceed ${maxLength} characters`;
      errorEl.style.display = 'block';
      input.style.borderColor = '#e74c3c';
      return false;
    }
    
    errorEl.style.display = 'none';
    input.style.borderColor = '#2ecc71';
    return true;
  };

  const validateWhatsApp = () => {
    const errorEl = document.getElementById('whatsapp-number-error');
    const value = whatsappInput.value.trim();
    
    if (!errorEl) return true;
    
    if (value && !/^[+]?[\d\s-]{10,}$/.test(value)) {
      errorEl.textContent = 'Enter a valid WhatsApp number';
      errorEl.style.display = 'block';
      whatsappInput.style.borderColor = '#e74c3c';
      return false;
    }
    
    errorEl.style.display = 'none';
    whatsappInput.style.borderColor = value ? '#2ecc71' : '#3498db';
    return true;
  };

  if (usernameInput) {
    usernameInput.addEventListener('input', () => validateInput(usernameInput, 3, 20, 'Username'));
    usernameInput.addEventListener('blur', () => validateInput(usernameInput, 3, 20, 'Username'));
  }
  
  if (gameIdInput) {
    gameIdInput.addEventListener('input', () => validateInput(gameIdInput, 5, 15, 'Game ID'));
    gameIdInput.addEventListener('blur', () => validateInput(gameIdInput, 5, 15, 'Game ID'));
  }
  
  if (whatsappInput) {
    whatsappInput.addEventListener('input', validateWhatsApp);
    whatsappInput.addEventListener('blur', validateWhatsApp);
  }

  btn.addEventListener('click', async () => {
    const gameUsername = (usernameInput?.value || '').trim();
    const gameId = (gameIdInput?.value || '').trim();
    const whatsapp = (whatsappInput?.value || '').trim();
    const termsAccepted = termsCheckbox?.checked;
    const createdBy = localStorage.getItem('username') || '';
    
    // Validate all fields
    const usernameValid = validateInput(usernameInput, 3, 20, 'Username');
    const gameIdValid = validateInput(gameIdInput, 5, 15, 'Game ID');
    const whatsappValid = validateWhatsApp();
    
    if (!usernameValid || !gameIdValid || !whatsappValid) {
      showRegistrationMessage('Please fix the errors above', 'error');
      return;
    }
    
    if (!termsAccepted) {
      showRegistrationMessage('You must accept the terms and conditions', 'error');
      return;
    }

    // Disable button and show loading
    btn.disabled = true;
    btn.textContent = 'Registering...';
    
    try {
      const isOpen = await db().ref('settings/registrationOpen').once('value');
      if (!isOpen.val()) {
        throw new Error('Registration is closed');
      }
      
      const existing = await db().ref('registrations').orderByChild('teamName').equalTo(gameUsername).once('value');
      if (existing.exists()) {
        throw new Error('This username is already registered');
      }
      
      await db().ref('registrations').push({
        teamName: gameUsername,
        gameUsername,
        gameId,
        whatsapp: whatsapp || null,
        status: 'Pending',
        registeredAt: Date.now(),
        createdBy
      });
      
      showRegistrationMessage('✅ Registration successful! Wait for approval.', 'success');
      
      // Reset form
      if (usernameInput) usernameInput.value = '';
      if (gameIdInput) gameIdInput.value = '';
      if (whatsappInput) whatsappInput.value = '';
      if (termsCheckbox) termsCheckbox.checked = false;
      
      // Reset validation states
      document.querySelectorAll('.input-error').forEach(el => el.style.display = 'none');
      document.querySelectorAll('.form-group input').forEach(input => {
        input.style.borderColor = '#3498db';
      });
      
    } catch (error) {
      showRegistrationMessage(error.message || 'Registration failed. Please try again.', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Register Now';
    }
  });

  watchMyRegistration();
}

function showRegistrationMessage(message, type) {
  const box = document.getElementById('registration-status-inline');
  if (!box) return;
  
  box.style.display = 'block';
  box.style.borderColor = type === 'success' ? '#2ecc71' : '#e74c3c';
  box.style.background = type === 'success' ? 'rgba(46,204,113,0.15)' : 'rgba(231,76,60,0.15)';
  box.innerHTML = `<p style="margin:0; font-weight:700; color: ${type === 'success' ? '#2ecc71' : '#e74c3c'};">${message}</p>`;
  
  setTimeout(() => {
    if (type === 'error') box.style.display = 'none';
  }, 5000);
}

export function watchMyRegistration() {
  const u = localStorage.getItem('username');
  const box = document.getElementById('registration-status-inline');
  if (!box || !u) { if (box) box.textContent = ''; return; }
  db().ref('registrations').orderByChild('createdBy').equalTo(u).on('value', (snap) => {
    let latest = null;
    snap.forEach(c => { 
        const v = { ...c.val(), id: c.key }; // Include ID
        if (!latest || (v.registeredAt||0) > (latest.registeredAt||0)) latest = v;
    });
    if (!latest || !latest.id) { box.innerHTML = ''; return; }
    
    const regId = latest.id;
    const teamName = latest.teamName || u;
    const approved = latest.status === 'Approved';
    const isPending = !approved;
    const timeText = latest.registeredAt ? new Date(latest.registeredAt).toLocaleString() : 'Just now';

    // Conditional delete button markup: allow deletion ONLY if pending
    const deleteButton = isPending ? 
        `<button class="btn btn-danger" id="delete-my-reg-btn" data-cut="true" style="margin-top: 10px; padding: 8px 14px; font-size: 0.85rem;">Delete Registration</button>` : '';

    box.style.borderColor = approved ? '#2ecc71' : '#f39c12';
    box.style.background = approved ? 'rgba(46,204,113,0.15)' : 'rgba(243,156,18,0.15)';
    box.innerHTML = `
      <div class="reg-status-card">
        <div class="reg-status-header">
          <span class="reg-status-title">📝 Registration</span>
          <span class="reg-status-badge ${approved ? 'approved' : 'pending'}">${approved ? 'কনফার্ম' : 'পেন্ডিং'}</span>
        </div>
        <div class="reg-status-body">
          <div class="team-chip">👥 ${teamName}</div>
          <div class="meta">⏱️ ${timeText}</div>
        </div>
        ${latest.whatsapp ? `<div class="meta" style="margin-top:8px;">📱 ${latest.whatsapp}</div>` : ''}
        ${deleteButton}
      </div>
    `;

    // Add click handler for the delete button if it exists
    const deleteBtnEl = document.getElementById('delete-my-reg-btn');
    if (deleteBtnEl) {
        deleteBtnEl.addEventListener('click', async (e) => {
             // Only execute deletion on the re-triggered click (bypassed cut guard)
             if (e.target.dataset.guardBypass === '1') {
                e.preventDefault(); 
                e.stopPropagation();

                const originalText = deleteBtnEl.textContent;
                deleteBtnEl.textContent = 'Deleting...';
                deleteBtnEl.disabled = true;

                try {
                    await db().ref('registrations/' + regId).remove();
                    showRegistrationMessage(`Registration for ${teamName} deleted.`, 'success');
                } catch (error) {
                    showRegistrationMessage('Failed to delete registration. Try again.', 'error');
                } finally {
                    deleteBtnEl.textContent = originalText;
                    deleteBtnEl.disabled = false;
                }
             }
        });
    }
  });
}