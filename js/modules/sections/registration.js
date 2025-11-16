export function renderRegistrationSection() {
  const el = document.getElementById('registration-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">📝 Team Registration</h2>
    <div class="registration-form">
        <div class="form-group">
            <label for="game-username">
                Game Username <span style="color:#e74c3c;">*</span>
                <span id="game-username-counter" class="char-counter">0/20</span>
            </label>
            <input type="text" id="game-username" placeholder="Enter your game username" maxlength="20">
            <span class="input-error" id="game-username-error"></span>
        </div>
        <div class="form-group">
            <label for="game-id">
                Game ID <span style="color:#e74c3c;">*</span>
                <span id="game-id-counter" class="char-counter">0/15</span>
            </label>
            <input type="text" id="game-id" placeholder="Enter your game ID" maxlength="15">
            <span class="input-error" id="game-id-error"></span>
        </div>
        <div class="form-group">
            <label for="whatsapp-number">
                WhatsApp Number
                <span style="color:#95a5a6; font-size:0.85rem;">(for team coordination)</span>
            </label>
            <input type="tel" id="whatsapp-number" placeholder="+880 1XXX-XXXXXX">
            <span class="input-error" id="whatsapp-number-error"></span>
        </div>
        <div class="form-group">
            <label for="discord-contact">
                Discord Username
                <span style="color:#95a5a6; font-size:0.85rem;">(optional - helps international coordination)</span>
            </label>
            <input type="text" id="discord-contact" placeholder="username#1234">
        </div>
        <div class="form-group">
            <label for="telegram-contact">
                Telegram Username
                <span style="color:#95a5a6; font-size:0.85rem;">(optional - alternative contact)</span>
            </label>
            <input type="text" id="telegram-contact" placeholder="@username">
        </div>
        <div class="form-group" style="flex-direction:row; align-items:center; gap:8px;">
            <input type="checkbox" id="terms-checkbox" style="width:auto; margin:0;">
            <label for="terms-checkbox" style="margin:0; cursor:pointer; user-select:none;">
                I accept the <a href="#" onclick="navigateToSection('rules-section'); return false;" style="color:#3498db; text-decoration:underline;">tournament rules</a>
            </label>
        </div>
        <button class="btn btn-primary" id="register-btn">Register Now</button>
        <div id="registration-status-inline" class="registration-status-inline"></div>
    </div>
  `;
}

