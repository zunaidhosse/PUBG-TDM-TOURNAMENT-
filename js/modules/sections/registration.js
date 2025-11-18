export function renderRegistrationSection() {
  const el = document.getElementById('registration-section');
  if (!el) return;
  
  el.innerHTML = `
    <h2 class="section-title">📝 টিম রেজিস্ট্রেশন / Team Registration</h2>
    
    <!-- Registration Progress Indicator -->
    <div class="registration-progress">
      <div class="progress-step active" data-step="1">
        <div class="step-number">1</div>
        <div class="step-label">তথ্য / Info</div>
      </div>
      <div class="progress-connector"></div>
      <div class="progress-step" data-step="2">
        <div class="step-number">2</div>
        <div class="step-label">যাচাই / Verify</div>
      </div>
      <div class="progress-connector"></div>
      <div class="progress-step" data-step="3">
        <div class="step-number">3</div>
        <div class="step-label">সম্পন্ন / Done</div>
      </div>
    </div>

    <!-- Registration Process Guide -->
    <div style="background:linear-gradient(135deg, rgba(52,152,219,0.18), rgba(52,152,219,0.08));border:1px solid #3498db;border-radius:12px;padding:18px;margin-bottom:20px;">
      <h3 style="color:#3498db;margin-bottom:12px;font-size:1.1rem;">📋 রেজিস্ট্রেশন প্রক্রিয়া / Registration Process</h3>
      <div style="display:grid;gap:10px;">
        <div style="display:flex;align-items:center;gap:12px;padding:10px;background:rgba(0,0,0,0.2);border-radius:8px;">
          <div style="width:32px;height:32px;border-radius:50%;background:#3498db;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;flex-shrink:0;">1</div>
          <div style="flex:1;">
            <div style="font-weight:700;color:#ecf0f1;margin-bottom:2px;">ফর্ম পূরণ করুন / Fill the Form</div>
            <div style="font-size:0.85rem;color:#95a5a6;">আপনার গেম তথ্য এবং WhatsApp নম্বর দিন</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:12px;padding:10px;background:rgba(0,0,0,0.2);border-radius:8px;">
          <div style="width:32px;height:32px;border-radius:50%;background:#f39c12;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;flex-shrink:0;">2</div>
          <div style="flex:1;">
            <div style="font-weight:700;color:#ecf0f1;margin-bottom:2px;">অনুমোদনের অপেক্ষা / Wait for Approval</div>
            <div style="font-size:0.85rem;color:#95a5a6;">২৪ ঘন্টার মধ্যে অ্যাডমিন যাচাই করবেন / Within 24 hours</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:12px;padding:10px;background:rgba(0,0,0,0.2);border-radius:8px;">
          <div style="width:32px;height:32px;border-radius:50%;background:#2ecc71;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;flex-shrink:0;">3</div>
          <div style="flex:1;">
            <div style="font-weight:700;color:#ecf0f1;margin-bottom:2px;">ম্যাচে অংশ নিন / Join Matches</div>
            <div style="font-size:0.85rem;color:#95a5a6;">অনুমোদনের পর ব্র্যাকেটে আপনার নাম দেখুন</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Registration Benefits -->
    <div style="background:rgba(46,204,113,0.1);border:1px solid #2ecc71;border-radius:10px;padding:14px;margin-bottom:20px;">
      <h4 style="color:#2ecc71;margin-bottom:10px;font-size:1rem;">✨ রেজিস্ট্রেশন সুবিধা / Registration Benefits</h4>
      <ul style="margin:0;padding-left:20px;color:#ecf0f1;line-height:1.8;">
        <li>সম্পূর্ণ বিনামূল্যে প্রবেশ / Free Entry</li>
        <li>প্রাইজ পুল জেতার সুযোগ / Win Prize Pool (UC)</li>
        <li>স্বয়ংক্রিয় ম্যাচ ব্র্যাকেট / Auto Match Bracket</li>
        <li>লাইভ স্কোর আপডেট / Live Score Updates</li>
      </ul>
    </div>

    <div class="registration-form">
        <!-- Form Completion Progress -->
        <div class="form-completion-bar">
          <div class="completion-fill" id="form-completion-fill"></div>
        </div>
        <div class="completion-text" id="completion-text">ফর্ম সম্পূর্ণতা: 0% / Form Completion: 0%</div>

        <!-- Game Username -->
        <div class="form-group">
            <label for="game-username" style="display:flex;justify-content:space-between;align-items:center;">
                <span>
                  🎮 গেম ইউজারনেম / Game Username <span style="color:#e74c3c;">*</span>
                </span>
                <span id="game-username-counter" class="char-counter">0/20</span>
            </label>
            <div class="input-wrapper">
              <input type="text" id="game-username" placeholder="উদাহরণ: ProGamer123 / Example: ProGamer123" maxlength="20">
              <div class="input-status-icon" id="game-username-status"></div>
            </div>
            <span class="input-error" id="game-username-error"></span>
            <div style="font-size:0.8rem;color:#95a5a6;margin-top:4px;">💡 PUBG Mobile এ যে নামে খেলেন / Your in-game display name</div>
        </div>

        <!-- Game ID -->
        <div class="form-group">
            <label for="game-id" style="display:flex;justify-content:space-between;align-items:center;">
                <span>
                  🆔 গেম আইডি / Game ID <span style="color:#e74c3c;">*</span>
                </span>
                <span id="game-id-counter" class="char-counter">0/15</span>
            </label>
            <div class="input-wrapper">
              <input type="text" id="game-id" placeholder="উদাহরণ: 5123456789 / Your numeric ID" maxlength="15" inputmode="numeric">
              <div class="input-status-icon" id="game-id-status"></div>
            </div>
            <span class="input-error" id="game-id-error"></span>
            <div style="font-size:0.8rem;color:#95a5a6;margin-top:4px;">💡 প্রোফাইলে গিয়ে আইডি দেখুন / Find in your PUBG profile</div>
        </div>

        <!-- WhatsApp Number -->
        <div class="form-group">
            <label for="whatsapp-number">
                📱 WhatsApp নম্বর / WhatsApp Number <span style="color:#e74c3c;">*</span>
            </label>
            <div class="input-wrapper">
              <input type="tel" id="whatsapp-number" placeholder="+880 1XXX-XXXXXX অথবা / or +966 5XX-XXX-XXX">
              <div class="input-status-icon" id="whatsapp-number-status"></div>
            </div>
            <span class="input-error" id="whatsapp-number-error"></span>
            <div style="font-size:0.8rem;color:#95a5a6;margin-top:4px;">💡 দেশ কোড সহ দিন / Include country code (e.g., +880, +966)</div>
        </div>

        <!-- Quick Contact Info -->
        <div style="background:rgba(46,204,113,0.1);border:1px solid #2ecc71;border-radius:8px;padding:12px;margin:15px 0;">
          <h4 style="color:#2ecc71;margin-bottom:8px;font-size:0.95rem;">📞 যোগাযোগ তথ্য / Contact Information</h4>
          <p style="color:#ecf0f1;font-size:0.85rem;margin:0;line-height:1.6;">
            WhatsApp নম্বর দিয়ে আপনার প্রতিপক্ষের সাথে ম্যাচ সমন্বয় করুন।
            <br>Use WhatsApp to coordinate matches with your opponents.
          </p>
        </div>

        <!-- Terms -->
        <div class="form-group" style="flex-direction:row; align-items:flex-start; gap:8px;">
            <input type="checkbox" id="terms-checkbox" style="width:auto; margin:4px 0 0 0; flex-shrink:0;">
            <label for="terms-checkbox" style="margin:0; cursor:pointer; user-select:none; flex:1;">
                আমি <a href="#" onclick="navigateToSection('rules-section'); return false;" style="color:#3498db; text-decoration:underline; font-weight:700;">টুর্নামেন্ট নিয়মাবলী</a> পড়েছি এবং মেনে নিয়েছি
                <br>
                <span style="font-size:0.85rem;color:#95a5a6;">I have read and accept the tournament rules</span>
            </label>
        </div>

        <!-- Preview Button -->
        <button class="btn" id="preview-registration-btn" style="background:#34495e;width:100%;margin-bottom:10px;">
          👁️ তথ্য প্রিভিউ করুন / Preview Information
        </button>

        <!-- Submit Button -->
        <button class="btn btn-primary" id="register-btn" style="font-size:1.05rem;padding:14px 24px;">
          ✅ এখনই রেজিস্টার করুন / Register Now
        </button>

        <!-- Status Display -->
        <div id="registration-status-inline" class="registration-status-inline"></div>
    </div>

    <!-- Preview Modal -->
    <div id="registration-preview-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:3000;align-items:center;justify-content:center;">
      <div style="background:rgba(26,26,46,0.98);border:2px solid #3498db;border-radius:12px;padding:24px;width:95%;max-width:500px;max-height:90vh;overflow-y:auto;">
        <h3 style="color:#3498db;margin-bottom:16px;">📋 রেজিস্ট্রেশন তথ্য যাচাই / Verify Registration Info</h3>
        <div id="preview-content" style="background:rgba(0,0,0,0.3);border-radius:8px;padding:16px;margin-bottom:16px;"></div>
        <div style="display:flex;gap:10px;">
          <button class="btn btn-primary" id="confirm-preview-btn" style="flex:1;">✅ নিশ্চিত করুন / Confirm</button>
          <button class="btn" id="cancel-preview-btn" style="flex:1;background:#34495e;">❌ সম্পাদনা / Edit</button>
        </div>
      </div>
    </div>
  `;
}

