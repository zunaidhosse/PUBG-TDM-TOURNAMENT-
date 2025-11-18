import { setupValidationListeners } from './validation.js';
import { setupPreview } from './preview.js';
import { submitRegistration } from './submit.js';
import { watchMyRegistration } from './status.js';

export function initRegistration() {
  const usernameInput = document.getElementById('game-username');
  const gameIdInput = document.getElementById('game-id');
  const whatsappInput = document.getElementById('whatsapp-number');
  const termsCheckbox = document.getElementById('terms-checkbox');
  const registerBtn = document.getElementById('register-btn');
  
  if (!registerBtn) return;

  // Setup validation
  setupValidationListeners(usernameInput, gameIdInput, whatsappInput);

  // Setup preview
  setupPreview(usernameInput, gameIdInput, whatsappInput, () => {
    submitRegistration(usernameInput, gameIdInput, whatsappInput, termsCheckbox, registerBtn);
  });

  // Direct submit button
  registerBtn.addEventListener('click', () => {
    submitRegistration(usernameInput, gameIdInput, whatsappInput, termsCheckbox, registerBtn);
  });

  // Watch registration status
  watchMyRegistration();
}

export { watchMyRegistration };

