import { db } from '../../core/firebase.js';
import { validateInput, validateWhatsApp } from './validation.js';
import { showRegistrationMessage } from './preview.js';

export function resetForm(usernameInput, gameIdInput, whatsappInput, termsCheckbox) {
  if (usernameInput) usernameInput.value = '';
  if (gameIdInput) gameIdInput.value = '';
  if (whatsappInput) whatsappInput.value = '';
  if (termsCheckbox) termsCheckbox.checked = false;

  // Reset validation states
  document.querySelectorAll('.input-error').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.form-group input').forEach(input => {
    input.style.borderColor = '#3498db';
  });

  // Reset counters
  const usernameCounter = document.getElementById('game-username-counter');
  const gameIdCounter = document.getElementById('game-id-counter');
  if (usernameCounter) usernameCounter.textContent = '0/20';
  if (gameIdCounter) gameIdCounter.textContent = '0/15';
  
  // Reset status icons
  document.querySelectorAll('.input-status-icon').forEach(el => el.textContent = '');
  
  // Reset progress
  const fillEl = document.getElementById('form-completion-fill');
  const textEl = document.getElementById('completion-text');
  if (fillEl) fillEl.style.width = '0%';
  if (textEl) textEl.textContent = 'ফর্ম সম্পূর্ণতা: 0% / Form Completion: 0%';
  
  document.querySelectorAll('.progress-step').forEach(s => {
    s.classList.remove('active', 'completed');
  });
  document.querySelector('.progress-step[data-step="1"]')?.classList.add('active');
}

export async function submitRegistration(usernameInput, gameIdInput, whatsappInput, termsCheckbox, registerBtn) {
  const gameUsername = (usernameInput?.value || '').trim();
  const gameId = (gameIdInput?.value || '').trim();
  const whatsapp = (whatsappInput?.value || '').trim();
  const termsAccepted = termsCheckbox?.checked;
  const createdBy = localStorage.getItem('username') || '';

  // Validate all fields
  const usernameValid = validateInput(usernameInput, 3, 20, 'Username', 'ইউজারনেম');
  const gameIdValid = validateInput(gameIdInput, 5, 15, 'Game ID', 'গেম আইডি');
  const whatsappValid = validateWhatsApp(whatsappInput);

  if (!usernameValid || !gameIdValid || !whatsappValid) {
    showRegistrationMessage('⚠️ সব তথ্য সঠিকভাবে পূরণ করুন / Please fix the errors above', 'error');
    return;
  }

  if (!whatsapp) {
    showRegistrationMessage('⚠️ WhatsApp নম্বর দিন / Provide WhatsApp number', 'error');
    return;
  }

  if (!termsAccepted) {
    showRegistrationMessage('⚠️ নিয়মাবলী মেনে নিন / You must accept the terms and conditions', 'error');
    return;
  }

  // Disable button and show loading
  registerBtn.disabled = true;
  registerBtn.innerHTML = '<span style=\"display:inline-block;animation:spin 1s linear infinite;\">⏳</span> রেজিস্টার হচ্ছে... / Registering...';

  try {
    const isOpen = await db().ref('settings/registrationOpen').once('value');
    if (!isOpen.val()) {
      throw new Error('রেজিস্ট্রেশন বন্ধ আছে / Registration is closed');
    }

    const existing = await db().ref('registrations').orderByChild('teamName').equalTo(gameUsername).once('value');
    if (existing.exists()) {
      throw new Error('এই ইউজারনেম ইতিমধ্যে নিবন্ধিত / This username is already registered');
    }

    await db().ref('registrations').push({
      teamName: gameUsername,
      gameUsername,
      gameId,
      whatsapp,
      status: 'Pending',
      registeredAt: Date.now(),
      createdBy
    });

    showRegistrationMessage('🎉 রেজিস্ট্রেশন সফল! ২৪ ঘন্টার মধ্যে অনুমোদন হবে। / ✅ Registration successful! Wait for approval within 24 hours.', 'success');

    resetForm(usernameInput, gameIdInput, whatsappInput, termsCheckbox);

  } catch (error) {
    showRegistrationMessage(`❌ ${error.message}`, 'error');
  } finally {
    registerBtn.disabled = false;
    registerBtn.innerHTML = '✅ এখনই রেজিস্টার করুন / Register Now';
  }
}