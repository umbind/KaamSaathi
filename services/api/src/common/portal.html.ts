export function getInteractivePortalHtml(): string {
  return `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>कामसाथी (KaamSaathi) — उत्तर प्रदेश का विश्वसनीय हाइपरलोकल सेवा मंच</title>
  <meta name="description" content="उत्तर प्रदेश के सभी 75 जिलों के लिए विश्वसनीय, सत्यापित बिजली मिस्त्री, प्लंबर और उपकरण मरम्मत मंच।">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Rozha+One&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #1E3A8A;
      --primary-hover: #1E40AF;
      --primary-dark: #0F172A;
      --accent: #F59E0B;
      --accent-hover: #D97706;
      --accent-soft: #FEF3C7;
      --emerald: #10B981;
      --emerald-soft: #D1FAE5;
      --rose: #EF4444;
      --rose-soft: #FEE2E2;
      --bg: #F8FAFC;
      --card-bg: #FFFFFF;
      --card-border: #E2E8F0;
      --text: #0F172A;
      --text-muted: #64748B;
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 18px;
      --radius-full: 9999px;
      --min-tap: 48px;
      --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
      --shadow-md: 0 4px 12px -2px rgba(15, 23, 42, 0.08);
      --shadow-lg: 0 12px 32px -4px rgba(15, 23, 42, 0.12);
      --font-main: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; font-family: var(--font-main); }
    body { background: var(--bg); color: var(--text); line-height: 1.6; padding-bottom: 80px; -webkit-font-smoothing: antialiased; }

    /* Accessibility 48dp touch targets */
    button, input, select, a { min-height: var(--min-tap); font-size: 1rem; }

    /* Top Emergency Alert Bar */
    .top-emergency-bar {
      background: #7F1D1D;
      color: #FEE2E2;
      font-size: 0.85rem;
      padding: 0.5rem 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      border-bottom: 1px solid rgba(239, 68, 68, 0.3);
    }
    .top-emergency-bar a {
      color: #FDE047;
      text-decoration: none;
      font-weight: 700;
      min-height: auto;
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
      background: rgba(254, 240, 138, 0.15);
    }
    .top-emergency-bar a:hover { text-decoration: underline; background: rgba(254, 240, 138, 0.25); }

    /* Header */
    header {
      background: linear-gradient(90deg, #1E3A8A 0%, #172554 100%);
      color: white;
      padding: 1rem 1.5rem;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: var(--shadow-md);
    }
    .header-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .brand-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: white;
    }
    .brand-logo-icon {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #F59E0B 0%, #EA580C 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      box-shadow: 0 4px 10px rgba(245, 158, 11, 0.3);
    }
    .brand-title {
      font-size: 1.6rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      display: flex;
      align-items: baseline;
      gap: 0.4rem;
    }
    .brand-sub {
      font-size: 0.85rem;
      color: #93C5FD;
      font-weight: 500;
    }
    .header-nav {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .nav-btn {
      color: #E2E8F0;
      text-decoration: none;
      padding: 0.4rem 0.8rem;
      border-radius: var(--radius-sm);
      font-size: 0.9rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      transition: all 0.2s;
      border: 1px solid transparent;
      min-height: 40px;
    }
    .nav-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border-color: rgba(255, 255, 255, 0.2);
    }
    .badge-pill {
      background: #F59E0B;
      color: #000;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 0.2rem 0.6rem;
      border-radius: var(--radius-full);
      box-shadow: 0 2px 6px rgba(245, 158, 11, 0.25);
    }

    /* Container */
    .app-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1.5rem 1rem;
    }

    /* Statutory Safe Harbor Banner */
    .statutory-banner {
      background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
      border: 1px solid #FCD34D;
      border-left: 6px solid #D97706;
      border-radius: var(--radius-md);
      padding: 1.25rem 1.5rem;
      margin-bottom: 2rem;
      box-shadow: var(--shadow-sm);
    }
    .statutory-header {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 1.05rem;
      font-weight: 700;
      color: #92400E;
      margin-bottom: 0.4rem;
    }
    .statutory-body {
      font-size: 0.9rem;
      color: #78350F;
      line-height: 1.55;
    }

    /* Hero Section */
    .hero-card {
      background: linear-gradient(135deg, #1E3A8A 0%, #1E40AF 60%, #0F172A 100%);
      color: white;
      border-radius: var(--radius-lg);
      padding: 3rem 2rem;
      box-shadow: var(--shadow-lg);
      position: relative;
      overflow: hidden;
      margin-bottom: 2.5rem;
    }
    .hero-card::after {
      content: '';
      position: absolute;
      top: -40px;
      right: -40px;
      width: 280px;
      height: 280px;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0) 70%);
      border-radius: 50%;
      pointer-events: none;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(8px);
      padding: 0.35rem 0.9rem;
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 1.25rem;
      border: 1px solid rgba(255, 255, 255, 0.25);
    }
    .hero-title {
      font-size: 2.4rem;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 0.75rem;
      max-width: 800px;
    }
    .hero-title span {
      background: linear-gradient(120deg, #FDE68A 0%, #F59E0B 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-subtitle {
      font-size: 1.15rem;
      color: #DBEAFE;
      max-width: 750px;
      margin-bottom: 2rem;
      font-weight: 400;
    }

    /* Live Search & District Bar */
    .search-container {
      background: white;
      border-radius: var(--radius-md);
      padding: 0.6rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      align-items: center;
    }
    .search-input-group {
      flex: 2;
      min-width: 250px;
      position: relative;
      display: flex;
      align-items: center;
    }
    .search-input-group svg {
      position: absolute;
      left: 1rem;
      color: var(--text-muted);
      width: 20px;
      height: 20px;
    }
    .search-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.75rem;
      border: 1px solid var(--card-border);
      border-radius: var(--radius-sm);
      font-size: 1rem;
      color: var(--text);
      outline: none;
      transition: border-color 0.2s;
    }
    .search-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.15);
    }
    .district-select {
      flex: 1;
      min-width: 180px;
      padding: 0.75rem 1rem;
      border: 1px solid var(--card-border);
      border-radius: var(--radius-sm);
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text);
      background-color: white;
      cursor: pointer;
      outline: none;
    }
    .btn-search {
      background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
      color: #000;
      font-weight: 800;
      border: none;
      padding: 0.75rem 1.75rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s;
      box-shadow: 0 4px 10px rgba(245, 158, 11, 0.35);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn-search:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 14px rgba(245, 158, 11, 0.45);
    }

    /* Quick Keyword Chips */
    .quick-chips {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-top: 1rem;
    }
    .chip {
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.25);
      color: white;
      font-size: 0.85rem;
      font-weight: 500;
      padding: 0.3rem 0.75rem;
      border-radius: var(--radius-full);
      cursor: pointer;
      min-height: auto;
      transition: all 0.2s;
    }
    .chip:hover {
      background: white;
      color: var(--primary);
      border-color: white;
    }

    /* Search Results Drawer */
    .search-results-panel {
      margin-top: 1.25rem;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      display: none;
    }

    /* Section Headers */
    .section-header {
      margin: 3rem 0 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .section-title {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .section-desc {
      font-size: 0.95rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }

    /* Categories Grid */
    .grid-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    .service-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: var(--radius-md);
      padding: 1.75rem;
      box-shadow: var(--shadow-sm);
      transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .service-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
      border-color: #93C5FD;
    }
    .service-icon-wrapper {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      margin-bottom: 1.25rem;
    }
    .bg-amber { background: #FEF3C7; color: #D97706; }
    .bg-sky { background: #E0F2FE; color: #0284C7; }
    .bg-cyan { background: #CFFAFE; color: #0891B2; }
    .bg-emerald { background: #D1FAE5; color: #059669; }
    .bg-purple { background: #F3E8FF; color: #7E22CE; }
    .bg-orange { background: #FFEDD5; color: #C2410C; }

    .service-card h3 {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: var(--text);
    }
    .service-card p {
      color: var(--text-muted);
      font-size: 0.92rem;
      margin-bottom: 1.25rem;
      flex-grow: 1;
    }
    .service-footer {
      border-top: 1px solid #F1F5F9;
      padding-top: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .visit-price {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--primary);
    }
    .btn-outline-sm {
      background: #F8FAFC;
      border: 1px solid var(--card-border);
      color: var(--text);
      font-weight: 600;
      font-size: 0.85rem;
      padding: 0.4rem 0.9rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.2s;
      min-height: 38px;
    }
    .btn-outline-sm:hover {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    /* Live Interactive Pilot Console */
    .console-section {
      background: #0B1120;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      color: #E2E8F0;
      margin: 3.5rem 0;
      overflow: hidden;
      border: 1px solid #1E293B;
    }
    .console-header {
      background: #020617;
      padding: 1.25rem 1.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      border-bottom: 1px solid #1E293B;
    }
    .console-title-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .console-status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 8px #10B981;
    }
    .console-nav-tabs {
      display: flex;
      gap: 0.5rem;
      background: #0F172A;
      padding: 0.35rem;
      border-radius: var(--radius-sm);
      border: 1px solid #1E293B;
    }
    .tab-btn {
      background: transparent;
      border: none;
      color: #94A3B8;
      font-size: 0.88rem;
      font-weight: 600;
      padding: 0.45rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s;
      min-height: 36px;
    }
    .tab-btn.active {
      background: #1E293B;
      color: #38BDF8;
      font-weight: 700;
    }
    .console-content {
      padding: 1.75rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    @media (max-width: 860px) {
      .console-content { grid-template-columns: 1fr; }
    }

    .form-label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: #94A3B8;
      margin-bottom: 0.4rem;
    }
    .quick-account-btn {
      background: #1E293B;
      border: 1px solid #334155;
      color: #CBD5E1;
      font-size: 0.82rem;
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      cursor: pointer;
      text-align: left;
      min-height: auto;
      transition: all 0.15s;
    }
    .quick-account-btn:hover {
      background: #334155;
      color: white;
      border-color: #475569;
    }
    .console-input {
      width: 100%;
      background: #020617;
      border: 1px solid #334155;
      border-radius: var(--radius-sm);
      padding: 0.75rem 1rem;
      color: white;
      font-size: 0.95rem;
      font-family: monospace;
      outline: none;
      margin-bottom: 1rem;
    }
    .console-input:focus { border-color: #38BDF8; }

    .action-button-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 0.6rem;
      margin-top: 0.75rem;
    }
    .btn-console-action {
      background: #1E3A8A;
      color: white;
      font-weight: 600;
      border: 1px solid #2563EB;
      border-radius: var(--radius-sm);
      padding: 0.65rem 1rem;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s;
    }
    .btn-console-action:hover {
      background: #2563EB;
    }
    .btn-console-success {
      background: #065F46;
      border-color: #059669;
    }
    .btn-console-success:hover { background: #059669; }

    /* Live Output Terminal */
    .terminal-container {
      background: #020617;
      border: 1px solid #1E293B;
      border-radius: var(--radius-sm);
      display: flex;
      flex-direction: column;
      height: 420px;
    }
    .terminal-topbar {
      background: #0B1120;
      padding: 0.5rem 0.9rem;
      border-bottom: 1px solid #1E293B;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.78rem;
      color: #64748B;
    }
    .terminal-code {
      flex: 1;
      padding: 1rem;
      color: #34D399;
      font-family: 'Courier New', Courier, monospace;
      font-size: 0.85rem;
      line-height: 1.5;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-word;
    }

    /* Verified Providers Directory */
    .providers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 1.5rem;
    }
    .provider-card {
      background: white;
      border: 1px solid var(--card-border);
      border-radius: var(--radius-md);
      padding: 1.5rem;
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .provider-head {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      margin-bottom: 1rem;
    }
    .provider-avatar {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
      color: white;
      font-size: 1.3rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border: 2px solid #BFDBFE;
    }
    .provider-info h4 {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text);
    }
    .provider-trade {
      color: #2563EB;
      font-size: 0.88rem;
      font-weight: 600;
      margin-bottom: 0.2rem;
    }
    .provider-location {
      font-size: 0.82rem;
      color: var(--text-muted);
    }
    .badge-check {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      background: var(--emerald-soft);
      color: #065F46;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.55rem;
      border-radius: 4px;
      margin-right: 0.35rem;
      margin-top: 0.4rem;
    }
    .provider-stats {
      margin: 1rem 0;
      padding: 0.75rem;
      background: #F8FAFC;
      border-radius: var(--radius-sm);
      display: flex;
      justify-content: space-around;
      text-align: center;
    }
    .stat-val { font-weight: 800; color: var(--text); font-size: 1rem; }
    .stat-lbl { font-size: 0.75rem; color: var(--text-muted); }

    /* 360-Degree Legal & Regulatory Shield Accordion */
    .legal-shield-box {
      background: white;
      border: 1px solid var(--card-border);
      border-radius: var(--radius-lg);
      padding: 2.25rem;
      box-shadow: var(--shadow-sm);
      margin: 3.5rem 0;
    }
    .legal-pills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
      margin-top: 1.5rem;
    }
    .legal-pill-card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: var(--radius-md);
      padding: 1.25rem;
      transition: all 0.2s;
    }
    .legal-pill-card:hover {
      background: #F1F5F9;
      border-color: #CBD5E1;
    }
    .legal-pill-icon { font-size: 1.8rem; margin-bottom: 0.5rem; }
    .legal-pill-title { font-weight: 700; font-size: 1.05rem; color: var(--text); margin-bottom: 0.35rem; }
    .legal-pill-desc { font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; }

    /* Footer */
    footer {
      margin-top: 5rem;
      border-top: 1px solid var(--card-border);
      padding: 3rem 1.5rem 2rem;
      background: white;
      font-size: 0.88rem;
      color: var(--text-muted);
    }
    .footer-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2.5rem;
    }
    @media (max-width: 768px) {
      .footer-grid { grid-template-columns: 1fr; }
    }
    .footer-title {
      font-weight: 700;
      font-size: 1rem;
      color: var(--text);
      margin-bottom: 0.75rem;
    }
    .footer-copy {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
      border-top: 1px solid #F1F5F9;
      padding-top: 1.5rem;
      font-size: 0.82rem;
    }
  </style>
</head>
<body>

  <!-- Top UP Emergency Helplines -->
  <div class="top-emergency-bar">
    <span>🚨 <strong>उत्तर प्रदेश आपातकालीन सहायता:</strong></span>
    <span>पुलिस: <a href="tel:112">112</a></span>
    <span>महिला हेल्पलाइन: <a href="tel:1090">1090</a></span>
    <span>चाइल्डलाइन: <a href="tel:1098">1098</a></span>
    <span>मुख्यमंत्री हेल्पलाइन: <a href="tel:1076">1076</a></span>
  </div>

  <!-- Main Navigation Header -->
  <header>
    <div class="header-container">
      <a href="#" class="brand-group">
        <div class="brand-logo-icon">🛠️</div>
        <div>
          <div class="brand-title">कामसाथी <span style="font-size:1.1rem; opacity:0.85;">KaamSaathi</span></div>
          <div class="brand-sub">उत्तर प्रदेश का अपना विश्वसनीय हाइपरलोकल सेवा मंच</div>
        </div>
      </a>
      <div class="header-nav">
        <span class="badge-pill">UP Pilot v1.0 • 75 जिले</span>
        <a href="#services" class="nav-btn">सेवाएं</a>
        <a href="#providers" class="nav-btn">सत्यापित कारीगर</a>
        <a href="#console" class="nav-btn" style="background:rgba(255,255,255,0.15); color:#FDE047;">⚡ टेस्ट कंसोल</a>
        <a href="#legal" class="nav-btn">360° विधिक कवच</a>
      </div>
    </div>
  </header>

  <div class="app-container">

    <!-- Statutory Section 79 IT Act & UP Consumer Protection Shield -->
    <div class="statutory-banner">
      <div class="statutory-header">
        <span>⚖️</span>
        <span>सांविधिक सुरक्षित पनाहगाह सूचना (Statutory Safe Harbor Notice — Section 79 IT Act)</span>
      </div>
      <div class="statutory-body">
        <strong>कामसाथी केवल एक स्वतंत्र तकनीकी मध्यवर्ती (Technology Intermediary) है।</strong> यह मंच उत्तर प्रदेश के नागरिकों को स्वतंत्र सेवा प्रदाताओं (मिस्त्री, तकनीशियन, प्लंबर) से सीधे जोड़ने की सुविधा प्रदान करता है। कामसाथी किसी कारीगर का नियोक्ता (Employer) नहीं है। कार्य की गुणवत्ता, अंतिम भुगतान और व्यक्तिगत सुरक्षा का पारस्परिक सत्यापन ग्राहक एवं सेवा प्रदाता आपसी सहमति से स्वयं करें।
      </div>
    </div>

    <!-- Hero Section -->
    <section class="hero-card">
      <div class="hero-badge">
        <span>📍</span> लखनऊ, वाराणसी और कानपुर नगर में सक्रिय पायलट
      </div>
      <h1 class="hero-title">
        अपने मोहल्ले का <span>हुनरमंद कामसाथी</span> अब केवल एक क्लिक में
      </h1>
      <p class="hero-subtitle">
        बिजली, नल और घरेलू उपकरणों की मरम्मत के लिए पहचान-सत्यापित स्थानीय कारीगरों से सीधे जुड़ें। 0% प्लेटफ़ॉर्म कमीशन, उचित दरें और सीधा भुगतान।
      </p>

      <!-- Live Search & District Selector -->
      <div class="search-container">
        <div class="search-input-group">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="text" id="searchInput" class="search-input" placeholder="जैसे 'bijli mistri', 'nal mistri', 'ac repair', 'fan'..." value="bijli mistri">
        </div>
        <select id="districtSelect" class="district-select">
          <option value="lucknow">लखनऊ (Lucknow)</option>
          <option value="varanasi">वाराणसी (Varanasi)</option>
          <option value="kanpur_nagar">कानपुर नगर (Kanpur)</option>
          <option value="prayagraj">प्रयागराज (Prayagraj)</option>
          <option value="gorakhpur">गोरखपुर (Gorakhpur)</option>
          <option value="agra">आगरा (Agra)</option>
          <option value="meerut">मेरठ (Meerut)</option>
        </select>
        <button class="btn-search" onclick="runSearch()">
          <span>खोजें (Search)</span>
        </button>
      </div>

      <!-- Quick Chips -->
      <div class="quick-chips">
        <span style="font-size:0.85rem; color:#93C5FD;">तुरंत खोजें:</span>
        <button class="chip" onclick="quickSearch('bijli mistri')">⚡ बिजली मिस्त्री</button>
        <button class="chip" onclick="quickSearch('nal mistri')">💧 नल मिस्त्री / प्लंबर</button>
        <button class="chip" onclick="quickSearch('ac repair')">❄️ AC रिपेयर</button>
        <button class="chip" onclick="quickSearch('fan repair')">🌀 पंखे की मरम्मत</button>
        <button class="chip" onclick="quickSearch('house wiring')">🔌 वायरिंग व MCB</button>
      </div>

      <!-- Live Search Results Panel -->
      <div id="searchResultBox" class="search-results-panel"></div>
    </section>

    <!-- Services Grid -->
    <div id="services" class="section-header">
      <div>
        <h2 class="section-title">✨ लोकप्रिय सेवा श्रेणियां (Service Categories)</h2>
        <p class="section-desc">पारदर्शी दरें, शून्य छिपा हुआ शुल्क, और घर बैठे कुशल कारीगरों की त्वरित सेवा।</p>
      </div>
      <span class="badge-check" style="font-size:0.85rem; padding:0.4rem 0.8rem;">✓ 0% प्लेटफ़ॉर्म कमीशन</span>
    </div>

    <div class="grid-cards">
      <!-- 1. Electrician -->
      <div class="service-card">
        <div>
          <div class="service-icon-wrapper bg-amber">⚡</div>
          <h3>बिजली मिस्त्री (Electrician)</h3>
          <p>स्विच-सॉकेट, पंखा मरम्मत, MCB ट्रिपिंग, इन्वर्टर वायरिंग, शॉर्ट-सर्किट जांच और संपूर्ण घरेलू वायरिंग।</p>
        </div>
        <div class="service-footer">
          <div class="visit-price">न्यूनतम विजिट: ₹120 - ₹150</div>
          <button class="btn-outline-sm" onclick="quickSearch('bijli mistri')">मिस्त्री देखें</button>
        </div>
      </div>

      <!-- 2. Plumber -->
      <div class="service-card">
        <div>
          <div class="service-icon-wrapper bg-sky">💧</div>
          <h3>नल मिस्त्री / प्लंबर (Plumber)</h3>
          <p>नल लीकेज, पानी की मोटर पंप, टंकी फिटिंग, फ्लश रिपेयर, पाइपलाइन ब्लॉकेज और सीवर लाइन समाधान।</p>
        </div>
        <div class="service-footer">
          <div class="visit-price">न्यूनतम विजिट: ₹120 - ₹150</div>
          <button class="btn-outline-sm" onclick="quickSearch('nal mistri')">प्लंबर देखें</button>
        </div>
      </div>

      <!-- 3. Appliance -->
      <div class="service-card">
        <div>
          <div class="service-icon-wrapper bg-cyan">❄️</div>
          <h3>AC व उपकरण मरम्मत (Appliance Care)</h3>
          <p>स्प्लिट व विंडो AC सर्विस, गैस चार्जिंग, रेफ्रिजरेटर, माइक्रोवेव, और वॉशिंग मशीन की त्वरित मरम्मत।</p>
        </div>
        <div class="service-footer">
          <div class="visit-price">न्यूनतम विजिट: ₹200</div>
          <button class="btn-outline-sm" onclick="quickSearch('ac repair')">तकनीशियन देखें</button>
        </div>
      </div>

      <!-- 4. Carpenter -->
      <div class="service-card">
        <div>
          <div class="service-icon-wrapper bg-orange">🚪</div>
          <h3>बढ़ई / कारपेंटर (Carpenter)</h3>
          <p>दरवाज़े और खिड़की की मरम्मत, लॉक/कब्ज़ा फिटिंग, अलमारी स्लाइडर, और मॉड्यूलर फर्नीचर असेंबली।</p>
        </div>
        <div class="service-footer">
          <div class="visit-price">न्यूनतम विजिट: ₹150</div>
          <button class="btn-outline-sm" onclick="quickSearch('carpenter')">बढ़ई देखें</button>
        </div>
      </div>

      <!-- 5. Painter -->
      <div class="service-card">
        <div>
          <div class="service-icon-wrapper bg-purple">🎨</div>
          <h3>पेंटर / रंगाई (Painter & Polishing)</h3>
          <p>दीवार पुट्टी, डिस्टेंपर, वॉटरप्रूफिंग, इमल्शन पेंट और लकड़ी व लोहे की खिड़कियों की पॉलिशिंग।</p>
        </div>
        <div class="service-footer">
          <div class="visit-price">न्यूनतम विजिट: ₹200</div>
          <button class="btn-outline-sm" onclick="quickSearch('painter')">पेंटर देखें</button>
        </div>
      </div>

      <!-- 6. Cleaning -->
      <div class="service-card">
        <div>
          <div class="service-icon-wrapper bg-emerald">🧹</div>
          <h3>घर की डीप क्लीनिंग (Deep Cleaning)</h3>
          <p>बाथरूम एसिड वॉश, किचन डीग्रीजिंग, सोफा व गद्दों की शैम्पू सफाई और संपूर्ण घर का सैनिटाइजेशन।</p>
        </div>
        <div class="service-footer">
          <div class="visit-price">न्यूनतम विजिट: ₹250</div>
          <button class="btn-outline-sm" onclick="quickSearch('cleaning')">क्लीनर देखें</button>
        </div>
      </div>
    </div>

    <!-- Live Interactive API & Pilot Test Console -->
    <div id="console" class="console-section">
      <div class="console-header">
        <div class="console-title-group">
          <div class="console-status-dot"></div>
          <h3 style="font-size:1.15rem; font-weight:700; color:white;">लाइव पायलट टेस्ट कंसोल (Developer & Demo Console)</h3>
        </div>
        <div class="console-nav-tabs">
          <button class="tab-btn active" id="tabCustomer" onclick="switchConsoleTab('customer')">👤 ग्राहक (Customer)</button>
          <button class="tab-btn" id="tabProvider" onclick="switchConsoleTab('provider')">🛠️ प्रदाता (Provider)</button>
          <button class="tab-btn" id="tabAdmin" onclick="switchConsoleTab('admin')">🔐 प्रशासक (Admin MFA)</button>
        </div>
      </div>

      <div class="console-content">
        <!-- Controls Column -->
        <div>
          <!-- Tab 1: Customer Controls -->
          <div id="customerControls">
            <label class="form-label">सीधे खाता चुनें (Quick Pre-fill Customer):</label>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1rem;">
              <button class="quick-account-btn" onclick="selectAccount('+919876500901', 'Amit Srivastava', 'lucknow')">अमित श्रीवास्तव (लखनऊ)</button>
              <button class="quick-account-btn" onclick="selectAccount('+919876500902', 'Priya Gupta', 'varanasi')">प्रिया गुप्ता (वाराणसी)</button>
              <button class="quick-account-btn" onclick="selectAccount('+919876500903', 'Sanjay Bajpai', 'kanpur_nagar')">संजय बाजपेई (कानपुर)</button>
            </div>

            <label class="form-label" for="phoneInput">फोन नंबर (Phone Number):</label>
            <input type="text" id="phoneInput" class="console-input" value="+919876500901">

            <div style="display:flex; gap:0.5rem; margin-bottom:1rem;">
              <div style="flex:1;">
                <label class="form-label" for="otpInput">OTP कोड (Mock Pilot):</label>
                <input type="text" id="otpInput" class="console-input" value="123456" style="margin-bottom:0;">
              </div>
              <div style="align-self:flex-end;">
                <button class="btn-console-action" onclick="requestOtp()">1. OTP भेजें</button>
              </div>
              <div style="align-self:flex-end;">
                <button class="btn-console-action btn-console-success" onclick="verifyOtp()">2. लॉगिन करें</button>
              </div>
            </div>

            <label class="form-label">ग्राहक क्रियाएं (Authenticated Customer Actions):</label>
            <div class="action-button-grid">
              <button class="btn-console-action" onclick="fetchCustomerProfile()">👤 मेरी प्रोफ़ाइल (Profile)</button>
              <button class="btn-console-action" onclick="createSampleRequest()">⚡ नया अनुरोध (Create Request)</button>
              <button class="btn-console-action" onclick="fetchCustomerRequests()">📋 मेरे अनुरोध (My Requests)</button>
            </div>
          </div>

          <!-- Tab 2: Provider Controls (Hidden initially) -->
          <div id="providerControls" style="display:none;">
            <label class="form-label">सीधे प्रदाता चुनें (Quick Pre-fill Provider):</label>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1rem;">
              <button class="quick-account-btn" onclick="selectAccount('+919876500101', 'Ramesh Verma', 'lucknow')">रमेश वर्मा (बिजली मिस्त्री - लखनऊ)</button>
              <button class="quick-account-btn" onclick="selectAccount('+919876500102', 'Suresh Yadav', 'lucknow')">सुरेश यादव (प्लंबर - लखनऊ)</button>
              <button class="quick-account-btn" onclick="selectAccount('+919876500103', 'Mohd. Imran', 'lucknow')">मो. इमरान (AC तकनीशियन - लखनऊ)</button>
            </div>

            <label class="form-label" for="providerPhoneInput">प्रदाता फोन नंबर:</label>
            <input type="text" id="providerPhoneInput" class="console-input" value="+919876500101">

            <div style="display:flex; gap:0.5rem; margin-bottom:1rem;">
              <div style="flex:1;">
                <label class="form-label" for="providerOtpInput">OTP कोड:</label>
                <input type="text" id="providerOtpInput" class="console-input" value="123456" style="margin-bottom:0;">
              </div>
              <div style="align-self:flex-end;">
                <button class="btn-console-action" onclick="requestProviderOtp()">1. OTP भेजें</button>
              </div>
              <div style="align-self:flex-end;">
                <button class="btn-console-action btn-console-success" onclick="verifyProviderOtp()">2. प्रदाता लॉगिन</button>
              </div>
            </div>

            <label class="form-label">प्रदाता क्रियाएं (Authenticated Provider Actions):</label>
            <div class="action-button-grid">
              <button class="btn-console-action" onclick="fetchProviderProfile()">📜 प्रदाता प्रोफ़ाइल</button>
              <button class="btn-console-action" onclick="fetchProviderLeads()">🔔 नए कार्य अवसर (Leads)</button>
              <button class="btn-console-action" onclick="fetchCategories()">📂 श्रेणियां सूची (Categories)</button>
            </div>
          </div>

          <!-- Tab 3: Admin Controls (Hidden initially) -->
          <div id="adminControls" style="display:none;">
            <label class="form-label">प्रशासक लॉगिन क्रेडेंशियल्स (Admin Credentials):</label>
            <input type="text" id="adminEmailInput" class="console-input" value="admin@kaamsaathi.in">
            <input type="password" id="adminPasswordInput" class="console-input" value="Admin@Pass1234!">

            <div style="display:flex; gap:0.5rem; margin-bottom:1.5rem;">
              <div style="flex:1;">
                <label class="form-label" for="adminTotpInput">TOTP कोड (2FA):</label>
                <input type="text" id="adminTotpInput" class="console-input" value="000000" style="margin-bottom:0;">
              </div>
              <div style="align-self:flex-end;">
                <button class="btn-console-action btn-console-success" onclick="loginAdmin()">प्रशासक लॉगिन करें</button>
              </div>
            </div>

            <label class="form-label">अनुपालन व प्रशासन क्रियाएं:</label>
            <div class="action-button-grid">
              <button class="btn-console-action" onclick="fetchAdminVerificationQueue()">📋 सत्यापन कतार (Queue)</button>
              <button class="btn-console-action" onclick="checkApiHealth()">💚 API स्वास्थ्य स्थिति (Health)</button>
            </div>
          </div>
        </div>

        <!-- Terminal Output Column -->
        <div class="terminal-container">
          <div class="terminal-topbar">
            <span>LIVE HTTP & RESPONSE CONSOLE</span>
            <span id="terminalStatusBadge" style="color:#10B981;">IDLE</span>
          </div>
          <div id="terminalOutput" class="terminal-code">// कामसाथी इंटरएक्टिव API कंसोल तैयार है।
// बाएं पैनल से कोई भी खाता चुनें और 'OTP भेजें' या 'लॉगिन करें' पर क्लिक करें।
// सभी एंडपॉइंट्स वास्तविक इन-मेमोरी टेस्ट डेटाबेस से जुड़े हैं।</div>
        </div>
      </div>
    </div>

    <!-- Verified Providers Directory -->
    <div id="providers" class="section-header">
      <div>
        <h2 class="section-title">👨‍🔧 सत्यापित कामसाथी डायरेक्टरी (Verified Providers)</h2>
        <p class="section-desc">उत्तर प्रदेश के सत्यापित और विश्वसनीय स्थानीय सेवा प्रदाता।</p>
      </div>
      <div style="font-size:0.85rem; color:var(--text-muted);">🔒 संपर्क विवरण सुरक्षित (Gated Contact Reveal)</div>
    </div>

    <div class="providers-grid">
      <!-- Provider 1 -->
      <div class="provider-card">
        <div>
          <div class="provider-head">
            <div class="provider-avatar">र</div>
            <div class="provider-info">
              <h4>रमेश चंद्र वर्मा</h4>
              <div class="provider-trade">वर्मा इलेक्ट्रिकल्स एवं हाउस वायरिंग</div>
              <div class="provider-location">📍 गोमती नगर, लखनऊ (UP)</div>
            </div>
          </div>
          <div>
            <span class="badge-check">✓ पहचान पत्र सत्यापित</span>
            <span class="badge-check">✓ ITI इलेक्ट्रीशियन</span>
            <span class="badge-check">✓ राज्य वायरमैन लाइसेंस</span>
          </div>
          <div class="provider-stats">
            <div>
              <div class="stat-val">★ 4.8</div>
              <div class="stat-lbl">रेटिंग (56 कार्य)</div>
            </div>
            <div>
              <div class="stat-val">8 वर्ष</div>
              <div class="stat-lbl">अनुभव</div>
            </div>
            <div>
              <div class="stat-val">₹150</div>
              <div class="stat-lbl">विजिट शुल्क</div>
            </div>
          </div>
        </div>
        <button class="btn-outline-sm" style="width:100%; text-align:center;" onclick="quickBookProvider('+919876500101', 'रमेश चंद्र वर्मा', 'Electrician')">
          ⚡ कोटेशन का अनुरोध भेजें
        </button>
      </div>

      <!-- Provider 2 -->
      <div class="provider-card">
        <div>
          <div class="provider-head">
            <div class="provider-avatar" style="background:linear-gradient(135deg, #0284C7 0%, #0369A1 100%);">सु</div>
            <div class="provider-info">
              <h4>सुरेश कुमार यादव</h4>
              <div class="provider-trade">यादव सेनेटरी एवं प्लंबिंग वर्क्स</div>
              <div class="provider-location">📍 आलमबाग, लखनऊ (UP)</div>
            </div>
          </div>
          <div>
            <span class="badge-check">✓ पहचान पत्र सत्यापित</span>
            <span class="badge-check">✓ पुलिस सत्यापनीय</span>
            <span class="badge-check">✓ 100% संतोष गारंटी</span>
          </div>
          <div class="provider-stats">
            <div>
              <div class="stat-val">★ 4.7</div>
              <div class="stat-lbl">रेटिंग (48 कार्य)</div>
            </div>
            <div>
              <div class="stat-val">10 वर्ष</div>
              <div class="stat-lbl">अनुभव</div>
            </div>
            <div>
              <div class="stat-val">₹150</div>
              <div class="stat-lbl">विजिट शुल्क</div>
            </div>
          </div>
        </div>
        <button class="btn-outline-sm" style="width:100%; text-align:center;" onclick="quickBookProvider('+919876500102', 'सुरेश कुमार यादव', 'Plumber')">
          💧 कोटेशन का अनुरोध भेजें
        </button>
      </div>

      <!-- Provider 3 -->
      <div class="provider-card">
        <div>
          <div class="provider-head">
            <div class="provider-avatar" style="background:linear-gradient(135deg, #0891B2 0%, #0E7490 100%);">मो</div>
            <div class="provider-info">
              <h4>मोहम्मद इमरान</h4>
              <div class="provider-trade">इमरान कूल केयर एवं AC सर्विस</div>
              <div class="provider-location">📍 हजरतगंज, लखनऊ (UP)</div>
            </div>
          </div>
          <div>
            <span class="badge-check">✓ पहचान पत्र सत्यापित</span>
            <span class="badge-check">✓ HVAC प्रमाणित</span>
            <span class="badge-check">✓ उपकरण विशेषज्ञ</span>
          </div>
          <div class="provider-stats">
            <div>
              <div class="stat-val">★ 4.9</div>
              <div class="stat-lbl">रेटिंग (72 कार्य)</div>
            </div>
            <div>
              <div class="stat-val">6 वर्ष</div>
              <div class="stat-lbl">अनुभव</div>
            </div>
            <div>
              <div class="stat-val">₹200</div>
              <div class="stat-lbl">विजिट शुल्क</div>
            </div>
          </div>
        </div>
        <button class="btn-outline-sm" style="width:100%; text-align:center;" onclick="quickBookProvider('+919876500103', 'मोहम्मद इमरान', 'Appliance Repair')">
          ❄️ कोटेशन का अनुरोध भेजें
        </button>
      </div>
    </div>

    <!-- 360-Degree Legal & Regulatory Shield -->
    <div id="legal" class="legal-shield-box">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
        <div>
          <h2 class="section-title">🛡️ 360° विधिक व नियामक रक्षा कवच (Legal Immunization Shield)</h2>
          <p class="section-desc">उत्तर प्रदेश में 100% सुरक्षित, गैर-विवादित और नियामकीय रूप से प्रतिरक्षा प्रणाली।</p>
        </div>
        <span class="badge-pill" style="background:#10B981; color:white;">कानूनी प्रतिरक्षा सक्रिय</span>
      </div>

      <div class="legal-pills-grid">
        <!-- Pillar 1 -->
        <div class="legal-pill-card">
          <div class="legal-pill-icon">⚖️</div>
          <div class="legal-pill-title">1. उपभोक्ता संरक्षण एवं Safe Harbor</div>
          <div class="legal-pill-desc">
            IT Act की धारा 79 एवं Consumer Protection (E-Commerce) Rules 2020 के तहत पूर्ण सुरक्षित पनाहगाह। कामसाथी शून्य मार्कअप रखता है और कार्य की वारंटी नहीं देता।
          </div>
        </div>

        <!-- Pillar 2 -->
        <div class="legal-pill-card">
          <div class="legal-pill-icon">💼</div>
          <div class="legal-pill-title">2. श्रम कानून एवं गिग वर्कर सुरक्षा</div>
          <div class="legal-pill-desc">
            सभी कामसाथी <strong>स्वतंत्र सेवा प्रदाता (Independent Contractors)</strong> हैं। कोई निश्चित समय, कोई अनिवार्यता नहीं। कारीगर अपनी दरें स्वयं तय करते हैं।
          </div>
        </div>

        <!-- Pillar 3 -->
        <div class="legal-pill-card">
          <div class="legal-pill-icon">👮</div>
          <div class="legal-pill-title">3. आपराधिक व पुलिस सहयोग (CrPC 91)</div>
          <div class="legal-pill-desc">
            शारीरिक पहचान पत्र (Voter ID/DL) का अनिवार्य सत्यापन। पुलिस या न्यायिक जांच हेतु धारा 91 CrPC के तहत 24 घंटे में त्वरित रिकॉर्ड सहयोग।
          </div>
        </div>

        <!-- Pillar 4 -->
        <div class="legal-pill-card">
          <div class="legal-pill-icon">🔒</div>
          <div class="legal-pill-title">4. डेटा गोपनीयता (DPDP Act 2023)</div>
          <div class="legal-pill-desc">
            संपर्क नंबर और पते का क्रिप्टोग्राफिक एन्क्रिप्शन। ग्राहक द्वारा कोटेशन स्वीकार किए जाने से पहले फोन नंबर किसी को नहीं दिखाया जाता (APP-002)।
          </div>
        </div>

        <!-- Pillar 5 -->
        <div class="legal-pill-card">
          <div class="legal-pill-icon">💰</div>
          <div class="legal-pill-title">5. कर व वित्तीय सुरक्षा (Direct UPI/Cash)</div>
          <div class="legal-pill-desc">
            ग्राहक और कारीगर के बीच सीधा UPI या नकद भुगतान। 0% पायलट कमीशन के कारण RBI Payment Aggregator नियमों का कोई उल्लंघन नहीं।
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- Statutory Footer -->
  <footer>
    <div class="footer-grid">
      <div>
        <div class="brand-title" style="color:var(--primary); margin-bottom:0.5rem;">कामसाथी (KaamSaathi)</div>
        <p style="margin-bottom:1rem;">उत्तर प्रदेश के स्थानीय मिस्त्री, कारीगर और परिवारों को तकनीकी रूप से सशक्त बनाने वाला हाइपरलोकल मंच।</p>
        <p><strong>शिकायत निवारण अधिकारी (Grievance Officer):</strong></p>
        <p>श्री राजेश्वर दयाल वर्मा, प्रमुख — ट्रस्ट, सुरक्षा एवं विधिक मामले</p>
        <p>कार्यालय: 4th Floor, Cyber Heights, Vibhuti Khand, Gomti Nagar, Lucknow, Uttar Pradesh – 226010</p>
        <p>ईमेल: <a href="mailto:grievance-officer@kaamsaathi.in">grievance-officer@kaamsaathi.in</a> | फोन: +91 522 491 8000</p>
      </div>
      <div>
        <div class="footer-title">विधिक नीतियां एवं प्रलेख</div>
        <p><a href="#" onclick="alert('नियम एवं शर्तें (Terms of Service) प्रलेख docs/legal/TERMS_OF_SERVICE.md में उपलब्ध है।'); return false;">सेवा की शर्तें (Terms of Service)</a></p>
        <p style="margin-top:0.4rem;"><a href="#" onclick="alert('प्रदाता अनुबंध (Provider Partner Agreement) प्रलेख docs/legal/PROVIDER_PARTNER_AGREEMENT.md में उपलब्ध है।'); return false;">कारीगर अनुबंध (Partner Agreement)</a></p>
        <p style="margin-top:0.4rem;"><a href="#" onclick="alert('गोपनीयता नीति (Privacy Policy) प्रलेख docs/legal/PRIVACY_POLICY.md में उपलब्ध है।'); return false;">डेटा गोपनीयता नीति (Privacy Policy)</a></p>
        <p style="margin-top:0.4rem;"><a href="#" onclick="alert('विधिक सुरक्षा विवरण docs/legal/COMPREHENSIVE_LEGAL_AND_REGULATORY_SHIELD.md में उपलब्ध है।'); return false;">360° विधिक कवच गाइड</a></p>
      </div>
      <div>
        <div class="footer-title">पायलट जिले (Pilot Districts)</div>
        <p>📍 लखनऊ (Lucknow)</p>
        <p>📍 वाराणसी (Varanasi)</p>
        <p>📍 कानपुर नगर (Kanpur Nagar)</p>
        <p style="margin-top:1rem; font-size:0.8rem; color:#94A3B8;">चरण-2 में उत्तर प्रदेश के सभी 75 जिलों में विस्तार प्रस्तावित।</p>
      </div>
    </div>
    <div class="footer-copy">
      © 2026 KaamSaathi Hyperlocal Marketplace. सूचना प्रौद्योगिकी अधिनियम 2000 एवं DPDP अधिनियम 2023 के अंतर्गत पूर्ण अनुपालित।
    </div>
  </footer>

  <script>
    // State management in browser
    let currentCustomerToken = null;
    let currentProviderToken = null;
    let currentAdminToken = null;

    function setTerminalOutput(title, status, data, latencyMs) {
      const badge = document.getElementById('terminalStatusBadge');
      badge.innerText = status ? 'HTTP ' + status + ' (' + latencyMs + 'ms)' : 'BUSY';
      badge.style.color = (status >= 200 && status < 300) ? '#10B981' : '#EF4444';

      const terminal = document.getElementById('terminalOutput');
      terminal.innerText = '>>> ' + title + '\\n' +
                           (status ? '>>> STATUS: ' + status + ' | LATENCY: ' + latencyMs + 'ms\\n\\n' : '') +
                           (typeof data === 'object' ? JSON.stringify(data, null, 2) : data);
    }

    function switchConsoleTab(tab) {
      document.getElementById('tabCustomer').classList.remove('active');
      document.getElementById('tabProvider').classList.remove('active');
      document.getElementById('tabAdmin').classList.remove('active');

      document.getElementById('customerControls').style.display = 'none';
      document.getElementById('providerControls').style.display = 'none';
      document.getElementById('adminControls').style.display = 'none';

      if (tab === 'customer') {
        document.getElementById('tabCustomer').classList.add('active');
        document.getElementById('customerControls').style.display = 'block';
      } else if (tab === 'provider') {
        document.getElementById('tabProvider').classList.add('active');
        document.getElementById('providerControls').style.display = 'block';
      } else if (tab === 'admin') {
        document.getElementById('tabAdmin').classList.add('active');
        document.getElementById('adminControls').style.display = 'block';
      }
    }

    function selectAccount(phone, name, district) {
      document.getElementById('phoneInput').value = phone;
      document.getElementById('districtSelect').value = district;
      setTerminalOutput('खाता चयनित: ' + name + ' (' + phone + ')', 200, {
        name: name,
        phone: phone,
        district: district,
        status: 'READY_TO_AUTH'
      }, 0);
    }

    async function quickSearch(term) {
      document.getElementById('searchInput').value = term;
      await runSearch();
    }

    async function runSearch() {
      const q = document.getElementById('searchInput').value;
      const district = document.getElementById('districtSelect').value;
      const resBox = document.getElementById('searchResultBox');
      resBox.style.display = 'block';
      resBox.innerHTML = '<span style="color:#FDE047;">⏳ खोज रहे हैं...</span>';

      const t0 = performance.now();
      try {
        const res = await fetch('/api/v1/services/search?q=' + encodeURIComponent(q) + '&district_id=' + encodeURIComponent(district) + '&lang=hi');
        const data = await res.json();
        const latency = Math.round(performance.now() - t0);

        setTerminalOutput('GET /api/v1/services/search?q=' + q, res.status, data, latency);

        if (data.categories && data.categories.length > 0) {
          let html = '<div style="font-weight:700; color:#FDE047; margin-bottom:0.5rem;">✅ खोज परिणाम (' + data.categories.length + ' श्रेणियां मिलीं):</div>';
          html += '<div style="display:flex; gap:0.5rem; flex-wrap:wrap;">';
          data.categories.forEach(c => {
            html += '<div style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); padding:0.4rem 0.8rem; border-radius:6px;">' +
                    '<strong>' + c.name_hi + '</strong> (' + c.name_en + ') — न्यूनतम विजिट ₹' + (c.base_fare_paise / 100) +
                    '</div>';
          });
          html += '</div>';
          resBox.innerHTML = html;
        } else {
          resBox.innerHTML = '<span style="color:#FCA5A5;">⚠️ कोई परिणाम नहीं मिला। कृपया \'bijli\', \'nal\', \'ac\', \'fan\' आदि खोजें।</span>';
        }
      } catch (err) {
        resBox.innerHTML = '<span style="color:#FCA5A5;">त्रुटि: ' + err.message + '</span>';
      }
    }

    // Customer Auth Flows
    async function requestOtp() {
      const phone = document.getElementById('phoneInput').value;
      setTerminalOutput('POST /api/v1/auth/otp/request', null, 'अनुरोध भेजा जा रहा है...', 0);
      const t0 = performance.now();
      try {
        const res = await fetch('/api/v1/auth/otp/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone_number: phone })
        });
        const data = await res.json();
        const latency = Math.round(performance.now() - t0);
        setTerminalOutput('POST /api/v1/auth/otp/request', res.status, data, latency);
      } catch (err) {
        setTerminalOutput('OTP अनुरोध विफल', 500, err.message, 0);
      }
    }

    async function verifyOtp() {
      const phone = document.getElementById('phoneInput').value;
      const otp = document.getElementById('otpInput').value;
      setTerminalOutput('POST /api/v1/auth/otp/verify', null, 'सत्यापन किया जा रहा है...', 0);
      const t0 = performance.now();
      try {
        const res = await fetch('/api/v1/auth/otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone_number: phone, otp_code: otp })
        });
        const data = await res.json();
        const latency = Math.round(performance.now() - t0);
        if (data.access_token) {
          currentCustomerToken = data.access_token;
        }
        setTerminalOutput('POST /api/v1/auth/otp/verify', res.status, data, latency);
      } catch (err) {
        setTerminalOutput('OTP सत्यापन विफल', 500, err.message, 0);
      }
    }

    async function fetchCustomerProfile() {
      if (!currentCustomerToken) {
        alert('कृपया पहले लॉगिन करें (Verify OTP)!');
        return;
      }
      const t0 = performance.now();
      try {
        const res = await fetch('/api/v1/customer/profile', {
          headers: { 'Authorization': 'Bearer ' + currentCustomerToken }
        });
        const data = await res.json();
        const latency = Math.round(performance.now() - t0);
        setTerminalOutput('GET /api/v1/customer/profile', res.status, data, latency);
      } catch (err) {
        setTerminalOutput('प्रोफ़ाइल लोड विफल', 500, err.message, 0);
      }
    }

    async function createSampleRequest() {
      if (!currentCustomerToken) {
        alert('कृपया पहले ग्राहक के रूप में लॉगिन करें (Verify OTP)!');
        return;
      }
      const t0 = performance.now();
      try {
        const res = await fetch('/api/v1/requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + currentCustomerToken
          },
          body: JSON.stringify({
            category_id: 'cat_electrician',
            district_id: 'lucknow',
            address_line: 'House 42, Vibhuti Khand, Gomti Nagar',
            description: 'Living room ceiling fan making loud rattling noise and switch sparking',
            service_timing: 'IMMEDIATE',
            photos: []
          })
        });
        const data = await res.json();
        const latency = Math.round(performance.now() - t0);
        setTerminalOutput('POST /api/v1/requests (Created Service Request)', res.status, data, latency);
      } catch (err) {
        setTerminalOutput('अनुरोध निर्माण विफल', 500, err.message, 0);
      }
    }

    async function fetchCustomerRequests() {
      if (!currentCustomerToken) {
        alert('कृपया पहले ग्राहक के रूप में लॉगिन करें!');
        return;
      }
      const t0 = performance.now();
      try {
        const res = await fetch('/api/v1/customer/requests', {
          headers: { 'Authorization': 'Bearer ' + currentCustomerToken }
        });
        const data = await res.json();
        const latency = Math.round(performance.now() - t0);
        setTerminalOutput('GET /api/v1/customer/requests', res.status, data, latency);
      } catch (err) {
        setTerminalOutput('अनुरोध सूची लोड विफल', 500, err.message, 0);
      }
    }

    // Provider Auth Flows
    async function requestProviderOtp() {
      const phone = document.getElementById('providerPhoneInput').value;
      const t0 = performance.now();
      try {
        const res = await fetch('/api/v1/auth/otp/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone_number: phone })
        });
        const data = await res.json();
        const latency = Math.round(performance.now() - t0);
        setTerminalOutput('POST /api/v1/auth/otp/request (Provider)', res.status, data, latency);
      } catch (err) {
        setTerminalOutput('प्रदाता OTP अनुरोध विफल', 500, err.message, 0);
      }
    }

    async function verifyProviderOtp() {
      const phone = document.getElementById('providerPhoneInput').value;
      const otp = document.getElementById('providerOtpInput').value;
      const t0 = performance.now();
      try {
        const res = await fetch('/api/v1/auth/otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone_number: phone, otp_code: otp })
        });
        const data = await res.json();
        const latency = Math.round(performance.now() - t0);
        if (data.access_token) {
          currentProviderToken = data.access_token;
        }
        setTerminalOutput('POST /api/v1/auth/otp/verify (Provider Login)', res.status, data, latency);
      } catch (err) {
        setTerminalOutput('प्रदाता लॉगिन विफल', 500, err.message, 0);
      }
    }

    async function fetchProviderProfile() {
      if (!currentProviderToken) {
        alert('कृपया पहले प्रदाता लॉगिन करें!');
        return;
      }
      const t0 = performance.now();
      try {
        const res = await fetch('/api/v1/provider/profile', {
          headers: { 'Authorization': 'Bearer ' + currentProviderToken }
        });
        const data = await res.json();
        const latency = Math.round(performance.now() - t0);
        setTerminalOutput('GET /api/v1/provider/profile', res.status, data, latency);
      } catch (err) {
        setTerminalOutput('प्रदाता प्रोफ़ाइल लोड विफल', 500, err.message, 0);
      }
    }

    async function fetchProviderLeads() {
      if (!currentProviderToken) {
        alert('कृपया पहले प्रदाता लॉगिन करें!');
        return;
      }
      const t0 = performance.now();
      try {
        const res = await fetch('/api/v1/provider/leads', {
          headers: { 'Authorization': 'Bearer ' + currentProviderToken }
        });
        const data = await res.json();
        const latency = Math.round(performance.now() - t0);
        setTerminalOutput('GET /api/v1/provider/leads', res.status, data, latency);
      } catch (err) {
        setTerminalOutput('कार्य अवसर लोड विफल', 500, err.message, 0);
      }
    }

    async function fetchCategories() {
      const t0 = performance.now();
      try {
        const res = await fetch('/api/v1/categories');
        const data = await res.json();
        const latency = Math.round(performance.now() - t0);
        setTerminalOutput('GET /api/v1/categories', res.status, data, latency);
      } catch (err) {
        setTerminalOutput('श्रेणियां लोड विफल', 500, err.message, 0);
      }
    }

    // Admin Flow
    async function loginAdmin() {
      const email = document.getElementById('adminEmailInput').value;
      const password = document.getElementById('adminPasswordInput').value;
      const totp = document.getElementById('adminTotpInput').value;
      const t0 = performance.now();
      try {
        const res = await fetch('/api/v1/admin/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, password: password, totp_code: totp })
        });
        const data = await res.json();
        const latency = Math.round(performance.now() - t0);
        if (data.access_token) {
          currentAdminToken = data.access_token;
        }
        setTerminalOutput('POST /api/v1/admin/auth/login', res.status, data, latency);
      } catch (err) {
        setTerminalOutput('प्रशासक लॉगिन विफल', 500, err.message, 0);
      }
    }

    async function fetchAdminVerificationQueue() {
      if (!currentAdminToken) {
        alert('कृपया पहले व्यवस्थापक लॉगिन करें!');
        return;
      }
      const t0 = performance.now();
      try {
        const res = await fetch('/api/v1/admin/verifications/queue', {
          headers: { 'Authorization': 'Bearer ' + currentAdminToken }
        });
        const data = await res.json();
        const latency = Math.round(performance.now() - t0);
        setTerminalOutput('GET /api/v1/admin/verifications/queue', res.status, data, latency);
      } catch (err) {
        setTerminalOutput('कतार लोड विफल', 500, err.message, 0);
      }
    }

    async function checkApiHealth() {
      const t0 = performance.now();
      try {
        const res = await fetch('/health');
        const data = await res.json();
        const latency = Math.round(performance.now() - t0);
        setTerminalOutput('GET /health', res.status, data, latency);
      } catch (err) {
        setTerminalOutput('हेल्थ चेक विफल', 500, err.message, 0);
      }
    }

    function quickBookProvider(phone, name, trade) {
      switchConsoleTab('customer');
      document.getElementById('console').scrollIntoView({ behavior: 'smooth' });
      setTerminalOutput('कारीगर चयन: ' + name + ' (' + trade + ')', 200, {
        selected_provider: name,
        trade: trade,
        phone: phone,
        status: 'READY_TO_BOOK_OR_REQUEST_QUOTE',
        action_note: 'कृपया ग्राहक के रूप में लॉगिन करके \'नया अनुरोध\' बटन दबाएं।'
      }, 0);
    }
  </script>
</body>
</html>`;
}
