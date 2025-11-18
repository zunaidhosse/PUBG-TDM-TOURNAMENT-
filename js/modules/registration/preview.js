import { validateInput, validateWhatsApp } from './validation.js';
import { showToast } from '../ui/toast.js';

export function showRegistrationMessage(message, type) {
  showToast(message, type === 'success' ? 'success' : 'error', 5000);
}

export function setupPreview(usernameInput, gameIdInput, whatsappInput, onConfirm) {
  const previewBtn = document.getElementById('preview-registration-btn');
  const confirmBtn = document.getElementById('confirm-preview-btn');
  const cancelBtn = document.getElementById('cancel-preview-btn');
  const modal = document.getElementById('registration-preview-modal');
  
  if (previewBtn) {
    previewBtn.addEventListener('click', () => {
      const gameUsername = (usernameInput?.value || '').trim();
      const gameId = (gameIdInput?.value || '').trim();
      const whatsapp = (whatsappInput?.value || '').trim();
      
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
      
      const content = document.getElementById('preview-content');
      
      if (modal && content) {
        content.innerHTML = `
          <div style="display:grid;gap:12px;">
            <div style="padding:10px;background:rgba(52,152,219,0.15);border-radius:6px;">
              <div style="color:#95a5a6;font-size:0.85rem;margin-bottom:4px;">🎮 ইউজারনেম / Username</div>
              <div style="color:#ecf0f1;font-weight:700;font-size:1.1rem;">${gameUsername}</div>
            </div>
            <div style="padding:10px;background:rgba(52,152,219,0.15);border-radius:6px;">
              <div style="color:#95a5a6;font-size:0.85rem;margin-bottom:4px;">🆔 গেম আইডি / Game ID</div>
              <div style="color:#ecf0f1;font-weight:700;font-size:1.1rem;">${gameId}</div>
            </div>
            <div style="padding:10px;background:rgba(46,204,113,0.15);border-radius:6px;">
              <div style="color:#95a5a6;font-size:0.85rem;margin-bottom:6px;">📞 যোগাযোগ / Contact</div>
              <div style="color:#ecf0f1;">📱 WhatsApp: ${whatsapp}</div>
            </div>
          </div>
          <div style="margin-top:12px;padding:10px;background:rgba(243,156,18,0.1);border:1px solid #f39c12;border-radius:6px;">
            <div style="color:#f39c12;font-size:0.9rem;text-align:center;">
              ✅ তথ্য সঠিক থাকলে "নিশ্চিত করুন" চাপুন<br>
              <span style="font-size:0.85rem;">Press "Confirm" if information is correct</span>
            </div>
          </div>
        `;
        
        modal.style.display = 'flex';
      }
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (modal) modal.style.display = 'none';
      onConfirm();
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      if (modal) modal.style.display = 'none';
    });
  }
}

