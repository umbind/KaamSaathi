export function getInteractivePortalHtml(): string {
  return `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>कामसाथी (KaamSaathi) — उत्तर प्रदेश का विश्वसनीय सेवा मंच</title>
  <style>
    :root {
      --primary: #1E3A8A;
      --primary-light: #3B82F6;
      --accent: #F59E0B;
      --bg: #F8FAFC;
      --card-bg: #FFFFFF;
      --text: #0F172A;
      --text-muted: #64748B;
      --border: #E2E8F0;
      --danger: #DC2626;
      --success: #16A34A;
      --radius: 12px;
      --min-tap: 48px;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: var(--bg); color: var(--text); line-height: 1.5; padding-bottom: 60px; }
    
    /* Accessibility touch targets */
    button, input, select, a { min-height: var(--min-tap); font-size: 1rem; }
    
    /* Header */
    header { background: var(--primary); color: white; padding: 1rem 1.5rem; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header-container { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; }
    .brand { display: flex; align-items: center; gap: 0.5rem; font-size: 1.4rem; font-weight: 700; }
    .brand-badge { background: var(--accent); color: #000; font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 999px; font-weight: 800; }
    .helplines { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; background: rgba(255,255,255,0.15); padding: 0.4rem 0.8rem; border-radius: 8px; }
    
    /* Statutory Banner */
    .disclaimer-banner { background: #FEF3C7; border-left: 5px solid var(--accent); padding: 0.75rem 1rem; margin: 1rem auto; max-width: 1100px; border-radius: 4px; font-size: 0.9rem; color: #92400E; }
    
    /* Main Layout */
    main { max-width: 1100px; margin: 0 auto; padding: 0 1rem; }
    
    /* Hero / Search Section */
    .hero { background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%); color: white; padding: 2.5rem 1.5rem; border-radius: var(--radius); margin-bottom: 2rem; box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.2); }
    .hero h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    .hero p { opacity: 0.9; margin-bottom: 1.5rem; font-size: 1.1rem; }
    .search-box { display: flex; flex-wrap: wrap; gap: 0.5rem; background: white; padding: 0.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .search-input { flex: 2; min-width: 240px; border: 1px solid var(--border); padding: 0.75rem 1rem; border-radius: 6px; outline: none; }
    .district-select { flex: 1; min-width: 150px; border: 1px solid var(--border); padding: 0.75rem 1rem; border-radius: 6px; background: white; }
    .btn-search { background: var(--accent); color: #000; font-weight: 700; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; transition: 0.2s; }
    .btn-search:hover { filter: brightness(0.95); }
    
    /* Categories Grid */
    .section-title { font-size: 1.4rem; margin: 2rem 0 1rem; display: flex; justify-content: space-between; align-items: center; }
    .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; }
    .card { background: var(--card-bg); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .card-icon { font-size: 2rem; margin-bottom: 0.75rem; }
    .card h3 { margin-bottom: 0.35rem; font-size: 1.2rem; }
    .card p { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem; }
    
    /* Interactive Test Console */
    .console-box { background: #0F172A; color: #F8FAFC; border-radius: var(--radius); padding: 1.5rem; margin: 2rem 0; }
    .console-box h2 { color: #38BDF8; font-size: 1.3rem; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem; }
    .console-desc { font-size: 0.9rem; color: #94A3B8; margin-bottom: 1.25rem; }
    .test-chips { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
    .chip-btn { background: #1E293B; color: #E2E8F0; border: 1px solid #334155; padding: 0.4rem 0.8rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem; }
    .chip-btn:hover { background: #334155; }
    .auth-form { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
    .auth-input { background: #1E293B; border: 1px solid #334155; color: white; padding: 0.75rem 1rem; border-radius: 6px; flex: 1; min-width: 200px; }
    .btn-auth { background: #38BDF8; color: #000; font-weight: 700; border: none; padding: 0.75rem 1.25rem; border-radius: 6px; cursor: pointer; }
    .result-terminal { background: #020617; border: 1px solid #1E293B; border-radius: 6px; padding: 1rem; font-family: monospace; font-size: 0.85rem; color: #34D399; max-height: 250px; overflow-y: auto; white-space: pre-wrap; }
    
    /* Verified Providers List */
    .provider-card { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding: 1rem 0; flex-wrap: wrap; gap: 0.75rem; }
    .provider-info h4 { font-size: 1.1rem; }
    .badge { display: inline-block; background: #DCFCE7; color: #15803D; font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.5rem; border-radius: 4px; margin-right: 0.3rem; }
    .rating { color: #F59E0B; font-weight: 700; font-size: 0.9rem; }
    
    /* Footer */
    footer { margin-top: 3rem; border-top: 1px solid var(--border); padding: 2rem 1rem; font-size: 0.85rem; color: var(--text-muted); text-align: center; }
  </style>
</head>
<body>

  <header>
    <div class="header-container">
      <div class="brand">
        <span>कामसाथी</span>
        <span style="font-size:1rem; opacity:0.85;">(KaamSaathi)</span>
        <span class="brand-badge">UP Pilot v1.0</span>
      </div>
      <div class="helplines">
        <span>🚨 आपातकालीन सहायता: <strong>112 (Police)</strong> | <strong>1090 (Women)</strong> | <strong>1098 (Child)</strong></span>
      </div>
    </div>
  </header>

  <div class="disclaimer-banner">
    <strong>⚠️ सांविधिक कानूनी सूचना (Statutory Notice):</strong> कामसाथी मंच उत्तर प्रदेश के निवासियों को स्वतंत्र सेवा प्रदाताओं से जोड़ता है। मंच सेवा प्रदाता की व्यक्तिगत क्षमता या व्यक्तिगत सुरक्षा की कोई गारंटी नहीं देता है। सभी दरों और कार्य का सत्यापन ग्राहक स्वयं करें।
  </div>

  <main>
    <!-- Hero & Search -->
    <section class="hero">
      <h1>उत्तर प्रदेश में सत्यापित मिस्त्री और तकनीशियन</h1>
      <p>बिजली, नल और घरेलू उपकरणों की मरम्मत के लिए अपने मोहल्ले का कुशल कामसाथी खोजें।</p>
      
      <div class="search-box">
        <input type="text" id="searchInput" class="search-input" placeholder="जैसे 'bijli mistri', 'nal mistri', 'ac repair', 'fan'..." value="bijli mistri">
        <select id="districtSelect" class="district-select">
          <option value="lucknow">लखनऊ (Lucknow)</option>
          <option value="varanasi">वाराणसी (Varanasi)</option>
          <option value="kanpur_nagar">कानपुर नगर (Kanpur)</option>
        </select>
        <button class="btn-search" onclick="runSearch()">खोजें (Search)</button>
      </div>
      <div id="searchResultBox" style="margin-top: 1rem; display: none; background: rgba(255,255,255,0.15); padding: 0.75rem 1rem; border-radius: 6px; font-size: 0.95rem;"></div>
    </section>

    <!-- Categories -->
    <h2 class="section-title">प्रमुख सेवा श्रेणियां (Categories)</h2>
    <div class="grid-3">
      <div class="card">
        <div class="card-icon">⚡</div>
        <h3>बिजली मिस्त्री (Electrician)</h3>
        <p>स्विच-सॉकेट, पंखा, MCB ट्रिपिंग, इन्वर्टर वायरिंग और घरेलू बिजली के सभी कार्य।</p>
        <div style="font-weight:700; color:var(--primary); font-size:0.9rem;">न्यूनतम विजिट शुल्क: ₹120 - ₹150</div>
      </div>
      <div class="card">
        <div class="card-icon">💧</div>
        <h3>नल मिस्त्री / प्लंबर (Plumber)</h3>
        <p>नल लीकेज, पानी की टंकी, पाइपलाइन फिटिंग, फ्लश रिपेयर और सीवर लाइन समाधान।</p>
        <div style="font-weight:700; color:var(--primary); font-size:0.9rem;">न्यूनतम विजिट शुल्क: ₹120 - ₹150</div>
      </div>
      <div class="card">
        <div class="card-icon">❄️</div>
        <h3>उपकरण मरम्मत (Appliance Repair)</h3>
        <p>स्प्लिट/विंडो AC सर्विस, गैस चार्जिंग, रेफ्रिजरेटर, और वॉशिंग मशीन मरम्मत।</p>
        <div style="font-weight:700; color:var(--primary); font-size:0.9rem;">न्यूनतम विजिट शुल्क: ₹200</div>
      </div>
    </div>

    <!-- Live Interactive Auth & API Test Console -->
    <div class="console-box">
      <h2>⚡ लाइव पायलट टेस्ट कंसोल (Browser Test Console)</h2>
      <p class="console-desc">नीचे दिए गए टेस्ट खातों से तुरंत OTP मंगाकर लॉगिन करें और लाइव JWT सेशन का परीक्षण करें:</p>
      
      <div class="test-chips">
        <span style="font-size:0.85rem; color:#94A3B8; align-self:center;">तुरंत चुनें:</span>
        <button class="chip-btn" onclick="setPhone('+919876500901')">👤 ग्राहक: अमित श्रीवास्तव (लखनऊ)</button>
        <button class="chip-btn" onclick="setPhone('+919876500902')">👤 ग्राहक: प्रिया गुप्ता (वाराणसी)</button>
        <button class="chip-btn" onclick="setPhone('+919876500101')">🛠️ प्रदाता: रमेश वर्मा (बिजली मिस्त्री)</button>
        <button class="chip-btn" onclick="setPhone('+919876500103')">🛠️ प्रदाता: मो. इमरान (AC तकनीशियन)</button>
      </div>

      <div class="auth-form">
        <input type="text" id="phoneInput" class="auth-input" placeholder="+919876500901" value="+919876500901">
        <button class="btn-auth" onclick="requestOtp()">1. OTP भेजें (Request)</button>
        <input type="text" id="otpInput" class="auth-input" style="max-width:120px;" placeholder="123456" value="123456">
        <button class="btn-auth" style="background:#34D399;" onclick="verifyOtp()">2. लॉगिन करें (Verify)</button>
      </div>

      <div class="result-terminal" id="terminalOutput">// लाइव रिस्पॉन्स यहां दिखेगा...
// 'OTP भेजें' या 'लॉगिन करें' पर क्लिक करें।</div>
    </div>

    <!-- Seeded Providers Directory -->
    <h2 class="section-title">सत्यापित कामसाथी प्रदाता (Verified Pilot Providers)</h2>
    <div class="card">
      <div class="provider-card">
        <div class="provider-info">
          <h4>रमेश चंद्र वर्मा (Verma Electricals & Wiring)</h4>
          <p style="margin:0.2rem 0; color:var(--text-muted);">गोमती नगर, लखनऊ • अनुभव: 8 वर्ष • विजिट: ₹150</p>
          <div>
            <span class="badge">✓ आधार सत्यापित</span>
            <span class="badge">✓ ITI प्रमाणित</span>
          </div>
        </div>
        <div class="rating">★ 4.8 (42 समीक्षाएं / 56 कार्य पूर्ण)</div>
      </div>

      <div class="provider-card">
        <div class="provider-info">
          <h4>सुरेश कुमार यादव (Yadav Sanitation & Plumbing)</h4>
          <p style="margin:0.2rem 0; color:var(--text-muted);">आलमबाग, लखनऊ • अनुभव: 10 वर्ष • विजिट: ₹150</p>
          <div>
            <span class="badge">✓ आधार सत्यापित</span>
            <span class="badge">✓ पुलिस क्लीयरेंस</span>
          </div>
        </div>
        <div class="rating">★ 4.7 (35 समीक्षाएं / 48 कार्य पूर्ण)</div>
      </div>

      <div class="provider-card">
        <div class="provider-info">
          <h4>मोहम्मद इमरान (Imran Cool Care & AC Repair)</h4>
          <p style="margin:0.2rem 0; color:var(--text-muted);">हजरतगंज, लखनऊ • अनुभव: 6 वर्ष • विजिट: ₹200</p>
          <div>
            <span class="badge">✓ आधार सत्यापित</span>
            <span class="badge">✓ HVAC प्रमाणित</span>
          </div>
        </div>
        <div class="rating">★ 4.9 (61 समीक्षाएं / 72 कार्य पूर्ण)</div>
      </div>

      <div class="provider-card">
        <div class="provider-info">
          <h4>अनिल कुमार मिश्रा (Mishra Bijli Mistri)</h4>
          <p style="margin:0.2rem 0; color:var(--text-muted);">सिगरा, वाराणसी • अनुभव: 12 वर्ष • विजिट: ₹120</p>
          <div>
            <span class="badge">✓ पहचान सत्यापित</span>
            <span class="badge">✓ राज्य वायरमैन लाइसेंस</span>
          </div>
        </div>
        <div class="rating">★ 4.8 (53 समीक्षाएं / 64 कार्य पूर्ण)</div>
      </div>
    </div>
  </main>

  <footer>
    <p><strong>कामसाथी शिकायत निवारण अधिकारी (IT Rules 2021):</strong> श्री राजेश्वर दयाल वर्मा, प्रमुख - ट्रस्ट एवं सुरक्षा</p>
    <p>कार्यालय: 4th Floor, Cyber Heights, Vibhuti Khand, Gomti Nagar, Lucknow, UP – 226010 | ईमेल: grievance-officer@kaamsaathi.in | फोन: +91 522 491 8000</p>
    <p style="margin-top:0.5rem;">© 2026 KaamSaathi Hyperlocal Marketplace. All rights reserved across all 75 Districts of Uttar Pradesh.</p>
  </footer>

  <script>
    function setPhone(phone) {
      document.getElementById('phoneInput').value = phone;
    }

    async function runSearch() {
      const q = document.getElementById('searchInput').value;
      const district = document.getElementById('districtSelect').value;
      const resBox = document.getElementById('searchResultBox');
      resBox.style.display = 'block';
      resBox.innerHTML = 'खोज रहे हैं... (Searching)';

      try {
        const res = await fetch('/api/v1/services/search?q=' + encodeURIComponent(q) + '&district_id=' + encodeURIComponent(district));
        const data = await res.json();
        if (data.categories && data.categories.length > 0) {
          const names = data.categories.map(c => c.name_hi + ' (' + c.name_en + ')').join(', ');
          resBox.innerHTML = '✅ <strong>परिणाम:</strong> ' + names + (data.categories[0].matched_alias ? ' [मैच उपनाम: "' + data.categories[0].matched_alias + '"]' : '');
        } else {
          resBox.innerHTML = '⚠️ कोई श्रेणी नहीं मिली। "bijli", "nal" या "ac" खोजें।';
        }
      } catch (err) {
        resBox.innerHTML = 'त्रुटि: ' + err.message;
      }
    }

    async function requestOtp() {
      const phone = document.getElementById('phoneInput').value;
      const terminal = document.getElementById('terminalOutput');
      terminal.innerText = 'OTP अनुरोध भेजा जा रहा है...';

      try {
        const res = await fetch('/api/v1/auth/otp/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone_number: phone })
        });
        const data = await res.json();
        terminal.innerText = '>>> HTTP ' + res.status + '\\n' + JSON.stringify(data, null, 2) + '\\n\\n[सूचना: पायलट टेस्ट OTP है: 123456]';
      } catch (err) {
        terminal.innerText = 'त्रुटि: ' + err.message;
      }
    }

    async function verifyOtp() {
      const phone = document.getElementById('phoneInput').value;
      const otp = document.getElementById('otpInput').value;
      const terminal = document.getElementById('terminalOutput');
      terminal.innerText = 'OTP सत्यापित किया जा रहा है...';

      try {
        const res = await fetch('/api/v1/auth/otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone_number: phone, otp_code: otp })
        });
        const data = await res.json();
        terminal.innerText = '>>> HTTP ' + res.status + ' (सत्यापन सफल!)\\n' + JSON.stringify(data, null, 2);
      } catch (err) {
        terminal.innerText = 'त्रुटि: ' + err.message;
      }
    }
  </script>
</body>
</html>`;
}
