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
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #1E3A8A;
      --primary-hover: #172554;
      --accent: #F59E0B;
      --accent-hover: #D97706;
      --emerald: #059669;
      --emerald-hover: #047857;
      --rose: #DC2626;
      --bg: #F1F5F9;
      --text: #0F172A;
      --text-muted: #334155;
      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 20px;
      --radius-full: 9999px;
      --min-tap: 48px;
      --font-main: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; font-family: var(--font-main); }
    body {
      background: radial-gradient(circle at 10% 20%, rgba(245, 158, 11, 0.06) 0%, transparent 40%),
                  radial-gradient(circle at 90% 80%, rgba(30, 58, 138, 0.07) 0%, transparent 40%),
                  #F8FAFC;
      color: var(--text);
      line-height: 1.6;
      padding-bottom: 80px;
      -webkit-font-smoothing: antialiased;
    }

    /* Accessibility 48dp touch targets */
    button, input, select, a { min-height: var(--min-tap); font-size: 1rem; }

    /* Top Emergency Alert Bar */
    .top-emergency-bar {
      background: linear-gradient(90deg, #7F1D1D 0%, #991B1B 50%, #7F1D1D 100%);
      color: #FFFFFF;
      font-size: 0.9rem;
      font-weight: 700;
      padding: 0.6rem 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.25rem;
      border-bottom: 2px solid #EF4444;
      box-shadow: 0 2px 8px rgba(127, 29, 29, 0.3);
    }
    .top-emergency-bar a {
      color: #000000;
      background: #FDE047;
      text-decoration: none;
      font-weight: 900;
      min-height: auto;
      padding: 0.2rem 0.6rem;
      border-radius: 6px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      transition: transform 0.15s, background 0.15s;
    }
    .top-emergency-bar a:hover {
      background: #FEF08A;
      transform: scale(1.05);
    }

    /* Header */
    header {
      background: linear-gradient(90deg, #0F172A 0%, #1E3A8A 60%, #172554 100%);
      color: white;
      padding: 1.1rem 1.75rem;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 4px 20px rgba(15, 23, 42, 0.25);
      border-bottom: 2px solid #3B82F6;
    }
    .header-container {
      max-width: 1240px;
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
      gap: 0.85rem;
      text-decoration: none;
      color: white;
    }
    .brand-logo-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.7rem;
      box-shadow: 0 4px 14px rgba(245, 158, 11, 0.45);
      border: 2px solid #FEF3C7;
    }
    .brand-title {
      font-size: 1.75rem;
      font-weight: 900;
      letter-spacing: -0.02em;
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    .brand-sub {
      font-size: 0.88rem;
      color: #93C5FD;
      font-weight: 600;
    }
    .header-nav {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .nav-btn {
      color: #F1F5F9;
      text-decoration: none;
      padding: 0.45rem 0.95rem;
      border-radius: var(--radius-sm);
      font-size: 0.92rem;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      transition: all 0.2s;
      border: 1px solid rgba(255,255,255,0.15);
      background: rgba(255, 255, 255, 0.08);
      min-height: 40px;
    }
    .nav-btn:hover {
      background: #3B82F6;
      color: white;
      border-color: #60A5FA;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.35);
    }
    .badge-pill {
      background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
      color: #000000;
      font-size: 0.8rem;
      font-weight: 900;
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-full);
      box-shadow: 0 3px 8px rgba(245, 158, 11, 0.4);
      border: 1px solid #FEF3C7;
    }

    /* Main Container */
    .app-container {
      max-width: 1240px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    /* Statutory Safe Harbor Banner */
    .statutory-banner {
      background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
      border: 2px solid #F59E0B;
      border-left: 10px solid #B45309;
      border-radius: var(--radius-md);
      padding: 1.35rem 1.75rem;
      margin-bottom: 2.25rem;
      box-shadow: 0 8px 24px rgba(217, 119, 6, 0.15);
    }
    .statutory-header {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 1.15rem;
      font-weight: 900;
      color: #78350F;
      margin-bottom: 0.45rem;
    }
    .statutory-tag {
      background: #B45309;
      color: #FFFFFF;
      font-size: 0.78rem;
      font-weight: 900;
      padding: 0.15rem 0.55rem;
      border-radius: 4px;
      letter-spacing: 0.04em;
    }
    .statutory-body {
      font-size: 0.95rem;
      color: #451A03;
      line-height: 1.6;
      font-weight: 600;
    }

    /* Hero Section */
    .hero-card {
      background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #1E293B 100%);
      color: white;
      border-radius: var(--radius-lg);
      padding: 3.25rem 2.25rem;
      box-shadow: 0 20px 45px -5px rgba(15, 23, 42, 0.35);
      position: relative;
      overflow: hidden;
      margin-bottom: 2.75rem;
      border: 2px solid #3B82F6;
    }
    .hero-card::after {
      content: '';
      position: absolute;
      top: -60px;
      right: -60px;
      width: 320px;
      height: 320px;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, rgba(245, 158, 11, 0) 70%);
      border-radius: 50%;
      pointer-events: none;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(245, 158, 11, 0.2);
      border: 2px solid #F59E0B;
      color: #FDE68A;
      padding: 0.4rem 1.1rem;
      border-radius: var(--radius-full);
      font-size: 0.9rem;
      font-weight: 800;
      margin-bottom: 1.4rem;
    }
    .hero-title {
      font-size: 2.6rem;
      font-weight: 900;
      line-height: 1.25;
      margin-bottom: 0.85rem;
      max-width: 860px;
      letter-spacing: -0.02em;
    }
    .hero-title span {
      background: linear-gradient(120deg, #FDE68A 0%, #F59E0B 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 2px 10px rgba(245, 158, 11, 0.3);
    }
    .hero-subtitle {
      font-size: 1.2rem;
      color: #E2E8F0;
      max-width: 800px;
      margin-bottom: 2.25rem;
      font-weight: 600;
      line-height: 1.5;
    }

    /* Live Search & District Bar */
    .search-container {
      background: #FFFFFF;
      border: 3px solid #F59E0B;
      border-radius: var(--radius-md);
      padding: 0.75rem;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
    }
    .search-input-group {
      flex: 2;
      min-width: 260px;
      position: relative;
      display: flex;
      align-items: center;
    }
    .search-input-group svg {
      position: absolute;
      left: 1.1rem;
      color: #1E3A8A;
      width: 22px;
      height: 22px;
    }
    .search-input {
      width: 100%;
      padding: 0.85rem 1rem 0.85rem 3rem;
      border: 2px solid #CBD5E1;
      border-radius: var(--radius-sm);
      font-size: 1.05rem;
      font-weight: 700;
      color: #0F172A;
      outline: none;
      transition: border-color 0.2s;
    }
    .search-input:focus {
      border-color: #1E3A8A;
      box-shadow: 0 0 0 4px rgba(30, 58, 138, 0.2);
    }
    .district-select {
      flex: 1;
      min-width: 190px;
      padding: 0.85rem 1rem;
      border: 2px solid #CBD5E1;
      border-radius: var(--radius-sm);
      font-size: 1rem;
      font-weight: 800;
      color: #0F172A;
      background-color: #F8FAFC;
      cursor: pointer;
      outline: none;
    }
    .district-select:focus { border-color: #1E3A8A; }
    .btn-search {
      background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
      color: #000000;
      font-weight: 900;
      font-size: 1.05rem;
      border: 2px solid #FEF3C7;
      padding: 0.85rem 2rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s;
      box-shadow: 0 6px 16px rgba(245, 158, 11, 0.45);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn-search:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 22px rgba(245, 158, 11, 0.6);
      background: #D97706;
      color: white;
    }

    /* Quick Keyword Chips */
    .quick-chips {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      flex-wrap: wrap;
      margin-top: 1.25rem;
    }
    .chip {
      background: rgba(255, 255, 255, 0.2);
      border: 2px solid rgba(255, 255, 255, 0.4);
      color: #FFFFFF;
      font-size: 0.9rem;
      font-weight: 700;
      padding: 0.35rem 0.9rem;
      border-radius: var(--radius-full);
      cursor: pointer;
      min-height: auto;
      transition: all 0.2s;
    }
    .chip:hover {
      background: #F59E0B;
      color: #000000;
      border-color: #FEF3C7;
      font-weight: 900;
      transform: translateY(-1px);
    }

    /* Search Results Drawer */
    .search-results-panel {
      margin-top: 1.5rem;
      background: #020617;
      border: 2px solid #38BDF8;
      border-radius: var(--radius-md);
      padding: 1.5rem;
      display: none;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }

    /* Section Headers */
    .section-header {
      margin: 3.5rem 0 1.75rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .section-title {
      font-size: 1.85rem;
      font-weight: 900;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 0.65rem;
      letter-spacing: -0.01em;
    }
    .section-desc {
      font-size: 1.05rem;
      color: #475569;
      margin-top: 0.35rem;
      font-weight: 600;
    }

    /* Category Cards Grid */
    .grid-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 1.75rem;
    }
    .service-card {
      border-radius: var(--radius-md);
      padding: 2rem;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
      transition: transform 0.2s, box-shadow 0.2s;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }
    .service-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 18px 36px rgba(15, 23, 42, 0.16);
    }

    /* Individual Card Color Themes */
    .card-amber {
      background: linear-gradient(145deg, #FFFBEB 0%, #FEF3C7 100%);
      border: 3px solid #F59E0B;
    }
    .card-amber .service-icon { background: #D97706; color: #FFFFFF; }
    .card-amber h3 { color: #78350F; }
    .card-amber p { color: #451A03; }
    .card-amber .visit-tag { background: #FDE68A; color: #78350F; border: 2px solid #F59E0B; }
    .card-amber .btn-card-action { background: #B45309; color: #FFFFFF; }
    .card-amber .btn-card-action:hover { background: #78350F; }

    .card-blue {
      background: linear-gradient(145deg, #F0F9FF 0%, #E0F2FE 100%);
      border: 3px solid #0284C7;
    }
    .card-blue .service-icon { background: #0284C7; color: #FFFFFF; }
    .card-blue h3 { color: #0369A1; }
    .card-blue p { color: #0C4A6E; }
    .card-blue .visit-tag { background: #BAE6FD; color: #0369A1; border: 2px solid #0284C7; }
    .card-blue .btn-card-action { background: #0369A1; color: #FFFFFF; }
    .card-blue .btn-card-action:hover { background: #0C4A6E; }

    .card-cyan {
      background: linear-gradient(145deg, #ECFEFF 0%, #CFFAFE 100%);
      border: 3px solid #0891B2;
    }
    .card-cyan .service-icon { background: #0891B2; color: #FFFFFF; }
    .card-cyan h3 { color: #0E7490; }
    .card-cyan p { color: #164E63; }
    .card-cyan .visit-tag { background: #A5F3FC; color: #0E7490; border: 2px solid #0891B2; }
    .card-cyan .btn-card-action { background: #0891B2; color: #FFFFFF; }
    .card-cyan .btn-card-action:hover { background: #164E63; }

    .card-orange {
      background: linear-gradient(145deg, #FFF7ED 0%, #FFEDD5 100%);
      border: 3px solid #EA580C;
    }
    .card-orange .service-icon { background: #EA580C; color: #FFFFFF; }
    .card-orange h3 { color: #C2410C; }
    .card-orange p { color: #7C2D12; }
    .card-orange .visit-tag { background: #FED7AA; color: #C2410C; border: 2px solid #EA580C; }
    .card-orange .btn-card-action { background: #C2410C; color: #FFFFFF; }
    .card-orange .btn-card-action:hover { background: #7C2D12; }

    .card-purple {
      background: linear-gradient(145deg, #FAF5FF 0%, #F3E8FF 100%);
      border: 3px solid #9333EA;
    }
    .card-purple .service-icon { background: #9333EA; color: #FFFFFF; }
    .card-purple h3 { color: #7E22CE; }
    .card-purple p { color: #581C87; }
    .card-purple .visit-tag { background: #E9D5FF; color: #7E22CE; border: 2px solid #9333EA; }
    .card-purple .btn-card-action { background: #7E22CE; color: #FFFFFF; }
    .card-purple .btn-card-action:hover { background: #581C87; }

    .card-emerald {
      background: linear-gradient(145deg, #ECFDF5 0%, #D1FAE5 100%);
      border: 3px solid #059669;
    }
    .card-emerald .service-icon { background: #059669; color: #FFFFFF; }
    .card-emerald h3 { color: #047857; }
    .card-emerald p { color: #064E3B; }
    .card-emerald .visit-tag { background: #A7F3D0; color: #047857; border: 2px solid #059669; }
    .card-emerald .btn-card-action { background: #047857; color: #FFFFFF; }
    .card-emerald .btn-card-action:hover { background: #064E3B; }

    .service-icon {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin-bottom: 1.25rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border: 2px solid rgba(255, 255, 255, 0.6);
    }
    .service-card h3 {
      font-size: 1.35rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
    }
    .service-card p {
      font-size: 0.96rem;
      margin-bottom: 1.5rem;
      line-height: 1.55;
      font-weight: 600;
      flex-grow: 1;
    }
    .service-footer {
      border-top: 2px solid rgba(0, 0, 0, 0.08);
      padding-top: 1.1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
    }
    .visit-tag {
      font-size: 0.9rem;
      font-weight: 800;
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
    }
    .btn-card-action {
      border: none;
      font-weight: 800;
      font-size: 0.95rem;
      padding: 0.55rem 1.2rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.15s;
      min-height: 44px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }
    .btn-card-action:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 14px rgba(0,0,0,0.25);
    }

    /* Modal Overlay */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(2, 6, 23, 0.8);
      backdrop-filter: blur(8px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }
    .modal-overlay.active {
      display: flex;
    }
    .modal-box {
      background: #FFFFFF;
      border-radius: var(--radius-lg);
      max-width: 580px;
      width: 100%;
      border: 3px solid #1E3A8A;
      box-shadow: 0 25px 60px rgba(0,0,0,0.5);
      overflow: hidden;
      animation: popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes popIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .modal-header {
      background: linear-gradient(135deg, #1E3A8A 0%, #172554 100%);
      color: white;
      padding: 1.25rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .modal-header h3 {
      font-size: 1.3rem;
      font-weight: 900;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn-close-modal {
      background: rgba(255,255,255,0.15);
      border: none;
      color: white;
      font-size: 1.3rem;
      width: 38px;
      height: 38px;
      min-height: auto;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
    }
    .btn-close-modal:hover { background: #EF4444; }
    .modal-body {
      padding: 1.5rem;
      max-height: 80vh;
      overflow-y: auto;
    }
    .modal-step-title {
      font-size: 0.95rem;
      font-weight: 800;
      color: #1E3A8A;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .problem-tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
    }
    .problem-tag-pill {
      background: #F1F5F9;
      border: 2px solid #CBD5E1;
      color: #1E293B;
      font-size: 0.88rem;
      font-weight: 700;
      padding: 0.45rem 0.85rem;
      border-radius: var(--radius-full);
      cursor: pointer;
      min-height: auto;
      transition: all 0.15s;
    }
    .problem-tag-pill.selected {
      background: #1E3A8A;
      border-color: #1E3A8A;
      color: white;
    }
    .matched-provider-preview {
      background: #FFFBEB;
      border: 2px solid #F59E0B;
      border-radius: var(--radius-sm);
      padding: 0.85rem;
      margin-bottom: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }

    /* Share Actions */
    .btn-share-action {
      background: #25D366;
      color: #FFFFFF;
      font-weight: 800;
      border: 2px solid #16A34A;
      font-size: 0.92rem;
      padding: 0.55rem 1rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.15s;
      min-height: 44px;
      box-shadow: 0 4px 10px rgba(37, 211, 102, 0.3);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
    }
    .btn-share-action:hover {
      background: #1EBE5D;
      transform: translateY(-2px);
      box-shadow: 0 6px 14px rgba(37, 211, 102, 0.45);
    }

    /* Directory Filter Tabs */
    .directory-filter-bar {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
    }
    .dir-filter-btn {
      background: #FFFFFF;
      border: 2px solid #CBD5E1;
      color: #1E293B;
      font-weight: 700;
      font-size: 0.9rem;
      padding: 0.45rem 1rem;
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: all 0.15s;
    }
    .dir-filter-btn.active, .dir-filter-btn:hover {
      background: #1E3A8A;
      color: white;
      border-color: #1E3A8A;
    }

    /* Verified Providers Directory */
    .providers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
      gap: 1.75rem;
    }
    .provider-card {
      border-radius: var(--radius-md);
      padding: 1.85rem;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.09);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .provider-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 16px 36px rgba(15, 23, 42, 0.16);
    }
    .provider-card-1 {
      background: linear-gradient(145deg, #FFFFFF 0%, #FFFBEB 100%);
      border: 3px solid #F59E0B;
    }
    .provider-card-1 .provider-avatar {
      background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
      border: 3px solid #FEF3C7;
    }
    .provider-card-1 .provider-stats {
      background: #FEF3C7;
      border: 2px solid #FDE68A;
    }
    .provider-card-1 .stat-val { color: #78350F; }
    .provider-card-1 .btn-provider-action {
      background: #1E3A8A;
      color: white;
      border: 2px solid #3B82F6;
    }
    .provider-card-1 .btn-provider-action:hover { background: #172554; }

    .provider-card-2 {
      background: linear-gradient(145deg, #FFFFFF 0%, #F0F9FF 100%);
      border: 3px solid #0284C7;
    }
    .provider-card-2 .provider-avatar {
      background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%);
      border: 3px solid #BAE6FD;
    }
    .provider-card-2 .provider-stats {
      background: #E0F2FE;
      border: 2px solid #BAE6FD;
    }
    .provider-card-2 .stat-val { color: #0369A1; }
    .provider-card-2 .btn-provider-action {
      background: #0284C7;
      color: white;
      border: 2px solid #38BDF8;
    }
    .provider-card-2 .btn-provider-action:hover { background: #0369A1; }

    .provider-card-3 {
      background: linear-gradient(145deg, #FFFFFF 0%, #ECFEFF 100%);
      border: 3px solid #0891B2;
    }
    .provider-card-3 .provider-avatar {
      background: linear-gradient(135deg, #0891B2 0%, #0E7490 100%);
      border: 3px solid #A5F3FC;
    }
    .provider-card-3 .provider-stats {
      background: #CFFAFE;
      border: 2px solid #A5F3FC;
    }
    .provider-card-3 .stat-val { color: #0E7490; }
    .provider-card-3 .btn-provider-action {
      background: #0891B2;
      color: white;
      border: 2px solid #22D3EE;
    }
    .provider-card-3 .btn-provider-action:hover { background: #0E7490; }

    .provider-head {
      display: flex;
      gap: 1.1rem;
      align-items: flex-start;
      margin-bottom: 1.1rem;
    }
    .provider-avatar {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      color: white;
      font-size: 1.5rem;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    .provider-info h4 {
      font-size: 1.3rem;
      font-weight: 900;
      color: #0F172A;
    }
    .provider-trade {
      color: #1E3A8A;
      font-size: 0.95rem;
      font-weight: 800;
      margin-bottom: 0.25rem;
    }
    .provider-location {
      font-size: 0.88rem;
      color: #475569;
      font-weight: 700;
    }
    .badge-check {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      background: #065F46;
      color: #FFFFFF;
      font-size: 0.8rem;
      font-weight: 800;
      padding: 0.25rem 0.65rem;
      border-radius: 6px;
      margin-right: 0.4rem;
      margin-top: 0.5rem;
      box-shadow: 0 2px 4px rgba(6, 95, 70, 0.25);
    }
    .provider-stats {
      margin: 1.25rem 0;
      padding: 0.9rem;
      border-radius: var(--radius-sm);
      display: flex;
      justify-content: space-around;
      text-align: center;
    }
    .stat-val { font-weight: 900; font-size: 1.1rem; }
    .stat-lbl { font-size: 0.8rem; color: #475569; font-weight: 700; }
    .btn-provider-action {
      width: 100%;
      font-weight: 900;
      font-size: 0.95rem;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
    }

    /* Live Interactive Pilot Console */
    .console-section {
      background: linear-gradient(160deg, #020617 0%, #0B132B 50%, #020617 100%);
      border-radius: var(--radius-lg);
      box-shadow: 0 24px 50px rgba(2, 6, 23, 0.6);
      color: #F8FAFC;
      margin: 4rem 0;
      overflow: hidden;
      border: 3px solid #1E3A8A;
    }
    .console-header {
      background: #020617;
      padding: 1.35rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      border-bottom: 2px solid #1E293B;
    }
    .console-title-group {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }
    .console-status-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #22C55E;
      box-shadow: 0 0 12px #22C55E;
    }
    .console-nav-tabs {
      display: flex;
      gap: 0.6rem;
      background: #0F172A;
      padding: 0.45rem;
      border-radius: var(--radius-sm);
      border: 2px solid #1E293B;
    }
    .tab-btn {
      background: transparent;
      border: none;
      color: #94A3B8;
      font-size: 0.92rem;
      font-weight: 700;
      padding: 0.5rem 1.25rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      min-height: 40px;
    }
    .tab-btn.active {
      background: #1E3A8A;
      color: #38BDF8;
      font-weight: 900;
      border: 1px solid #38BDF8;
      box-shadow: 0 2px 10px rgba(56, 189, 248, 0.3);
    }
    .console-content {
      padding: 2.25rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
    @media (max-width: 900px) {
      .console-content { grid-template-columns: 1fr; }
    }

    .form-label {
      display: block;
      font-size: 0.9rem;
      font-weight: 700;
      color: #93C5FD;
      margin-bottom: 0.5rem;
    }
    .quick-account-btn {
      background: #1E293B;
      border: 2px solid #334155;
      color: #F8FAFC;
      font-size: 0.88rem;
      font-weight: 700;
      padding: 0.5rem 0.9rem;
      border-radius: 8px;
      cursor: pointer;
      text-align: left;
      min-height: auto;
      transition: all 0.15s;
    }
    .quick-account-btn:hover {
      background: #3B82F6;
      color: white;
      border-color: #93C5FD;
      transform: translateY(-1px);
    }
    .console-input {
      width: 100%;
      background: #020617;
      border: 2px solid #334155;
      border-radius: var(--radius-sm);
      padding: 0.85rem 1rem;
      color: #38BDF8;
      font-size: 1rem;
      font-family: monospace;
      font-weight: 700;
      outline: none;
      margin-bottom: 1.25rem;
    }
    .console-input:focus {
      border-color: #38BDF8;
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.25);
    }

    .action-button-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      gap: 0.75rem;
      margin-top: 1rem;
    }
    .btn-console-action {
      background: #1E3A8A;
      color: white;
      font-weight: 800;
      border: 2px solid #3B82F6;
      border-radius: var(--radius-sm);
      padding: 0.75rem 1rem;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.15s;
    }
    .btn-console-action:hover {
      background: #2563EB;
      border-color: #93C5FD;
      transform: translateY(-2px);
    }
    .btn-console-success {
      background: #059669;
      border-color: #34D399;
      color: white;
    }
    .btn-console-success:hover {
      background: #10B981;
      border-color: #6EE7B7;
    }

    /* Live Output Terminal */
    .terminal-container {
      background: #000000;
      border: 2px solid #1E293B;
      border-radius: var(--radius-sm);
      display: flex;
      flex-direction: column;
      height: 460px;
      box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
    }
    .terminal-topbar {
      background: #0B1120;
      padding: 0.65rem 1rem;
      border-bottom: 2px solid #1E293B;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.82rem;
      font-weight: 800;
      color: #94A3B8;
    }
    .terminal-code {
      flex: 1;
      padding: 1.25rem;
      color: #22C55E;
      font-family: 'Courier New', Courier, monospace;
      font-size: 0.9rem;
      font-weight: 600;
      line-height: 1.55;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-word;
    }

    /* 360-Degree Legal Shield Section */
    .legal-shield-box {
      background: #FFFFFF;
      border: 3px solid #1E3A8A;
      border-radius: var(--radius-lg);
      padding: 2.75rem 2.25rem;
      box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
      margin: 4.5rem 0;
    }
    .legal-pills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }
    .legal-pill-card {
      border-radius: var(--radius-md);
      padding: 1.5rem;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    }
    .legal-pill-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
    }
    .legal-card-1 {
      background: linear-gradient(145deg, #FEF3C7 0%, #FDE68A 100%);
      border: 3px solid #F59E0B;
    }
    .legal-card-1 .legal-pill-title { color: #78350F; }
    .legal-card-1 .legal-pill-desc { color: #451A03; }

    .legal-card-2 {
      background: linear-gradient(145deg, #DBEAFE 0%, #BFDBFE 100%);
      border: 3px solid #2563EB;
    }
    .legal-card-2 .legal-pill-title { color: #1E3A8A; }
    .legal-card-2 .legal-pill-desc { color: #172554; }

    .legal-card-3 {
      background: linear-gradient(145deg, #FEE2E2 0%, #FECACA 100%);
      border: 3px solid #DC2626;
    }
    .legal-card-3 .legal-pill-title { color: #991B1B; }
    .legal-card-3 .legal-pill-desc { color: #450A0A; }

    .legal-card-4 {
      background: linear-gradient(145deg, #F3E8FF 0%, #E9D5FF 100%);
      border: 3px solid #9333EA;
    }
    .legal-card-4 .legal-pill-title { color: #6B21A8; }
    .legal-card-4 .legal-pill-desc { color: #3B0764; }

    .legal-card-5 {
      background: linear-gradient(145deg, #D1FAE5 0%, #A7F3D0 100%);
      border: 3px solid #059669;
    }
    .legal-card-5 .legal-pill-title { color: #065F46; }
    .legal-card-5 .legal-pill-desc { color: #022C22; }

    .legal-pill-icon { font-size: 2.2rem; margin-bottom: 0.6rem; }
    .legal-pill-title { font-weight: 900; font-size: 1.15rem; margin-bottom: 0.5rem; }
    .legal-pill-desc { font-size: 0.92rem; font-weight: 600; line-height: 1.55; }

    /* Footer */
    footer {
      margin-top: 5rem;
      border-top: 4px solid #1E3A8A;
      padding: 3.5rem 1.75rem 2.5rem;
      background: #020617;
      color: #CBD5E1;
      font-size: 0.92rem;
    }
    .footer-grid {
      max-width: 1240px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 2.5rem;
      margin-bottom: 2.75rem;
    }
    @media (max-width: 800px) {
      .footer-grid { grid-template-columns: 1fr; }
    }
    .footer-title {
      font-weight: 900;
      font-size: 1.15rem;
      color: #F59E0B;
      margin-bottom: 0.9rem;
      letter-spacing: 0.02em;
    }
    .footer-grid a {
      color: #93C5FD;
      text-decoration: none;
      font-weight: 600;
    }
    .footer-grid a:hover {
      color: #FDE047;
      text-decoration: underline;
    }
    .footer-copy {
      max-width: 1240px;
      margin: 0 auto;
      text-align: center;
      border-top: 1px solid #1E293B;
      padding-top: 1.75rem;
      font-size: 0.88rem;
      color: #94A3B8;
      font-weight: 600;
    }
  </style>
</head>
<body>

  <!-- Top UP Emergency Helplines -->
  <div class="top-emergency-bar">
    <span>🚨 <strong>उत्तर प्रदेश आपातकालीन त्वरित हेल्पलाइन:</strong></span>
    <span>पुलिस: <a href="tel:112">112</a></span>
    <span>महिला सुरक्षा: <a href="tel:1090">1090</a></span>
    <span>चाइल्डलाइन: <a href="tel:1098">1098</a></span>
    <span>मुख्यमंत्री हेल्पलाइन: <a href="tel:1076">1076</a></span>
  </div>

  <!-- Main Navigation Header -->
  <header>
    <div class="header-container">
      <a href="#" class="brand-group">
        <div class="brand-logo-icon">🛠️</div>
        <div>
          <div class="brand-title">कामसाथी <span style="font-size:1.15rem; color:#FDE047;">KaamSaathi</span></div>
          <div class="brand-sub">उत्तर प्रदेश का अपना विश्वसनीय हाइपरलोकल सेवा मंच</div>
        </div>
      </a>
      <div class="header-nav">
        <span class="badge-pill">UP Pilot v1.0 • 75 जिले</span>
        <a href="#services" class="nav-btn">✨ सेवाएं</a>
        <a href="#providers" class="nav-btn">👨‍🔧 कारीगर</a>
        <a href="#console" class="nav-btn" style="background:#1E3A8A; border-color:#38BDF8; color:#38BDF8;">⚡ टेस्ट कंसोल</a>
        <a href="#legal" class="nav-btn">🛡️ 360° विधिक कवच</a>
      </div>
    </div>
  </header>

  <div class="app-container">

    <!-- Statutory Section 79 IT Act & UP Consumer Protection Shield -->
    <div class="statutory-banner">
      <div class="statutory-header">
        <span>⚖️</span>
        <span>सांविधिक सुरक्षित पनाहगाह सूचना</span>
        <span class="statutory-tag">SECTION 79 IT ACT 2000</span>
      </div>
      <div class="statutory-body">
        <strong>कामसाथी केवल एक विशुद्ध तकनीकी मध्यवर्ती (Technology Intermediary) है।</strong> यह मंच उत्तर प्रदेश के नागरिकों को स्वतंत्र सेवा प्रदाताओं (मिस्त्री, तकनीशियन, प्लंबर) से सीधे जोड़ने की सुविधा प्रदान करता है। कामसाथी किसी कारीगर का नियोक्ता (Employer) नहीं है। कार्य की गुणवत्ता, अंतिम दरें और व्यक्तिगत सुरक्षा का पारस्परिक सत्यापन ग्राहक एवं सेवा प्रदाता आपसी सहमति से स्वयं करें।
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
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
        <span style="font-size:0.92rem; color:#FDE047; font-weight:800;">तुरंत चुनें:</span>
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
        <p class="section-desc">नीचे किसी भी सेवा के बटन पर क्लिक करके तुरंत समस्या चुनें और नजदीकी कारीगर से संपर्क करें।</p>
      </div>
      <span class="badge-check" style="font-size:0.9rem; padding:0.45rem 0.95rem; background:#047857;">✓ 0% प्लेटफ़ॉर्म कमीशन</span>
    </div>

    <div class="grid-cards">
      <!-- 1. Electrician -->
      <div class="service-card card-amber">
        <div>
          <div class="service-icon">⚡</div>
          <h3>बिजली मिस्त्री (Electrician)</h3>
          <p>स्विच-सॉकेट, पंखा मरम्मत, MCB ट्रिपिंग, इन्वर्टर वायरिंग, शॉर्ट-सर्किट जांच और संपूर्ण घरेलू वायरिंग समाधान।</p>
        </div>
        <div class="service-footer">
          <div class="visit-tag">विजिट: ₹120 - ₹150</div>
          <button class="btn-card-action" onclick="openBookingModal('cat_electrician', 'बिजली मिस्त्री (Electrician)', '⚡', 150, ['पंखा बंद / आवाज़ कर रहा है', 'स्विच या सॉकेट जल गया', 'MCB बार-बार ट्रिप हो रही है', 'इन्वर्टर / मेन वायरिंग जांच', 'नया पंखा या लाइट फिटिंग'])">
            <span>⚡ मिस्त्री खोजें</span>
          </button>
        </div>
      </div>

      <!-- 2. Plumber -->
      <div class="service-card card-blue">
        <div>
          <div class="service-icon">💧</div>
          <h3>नल मिस्त्री / प्लंबर (Plumber)</h3>
          <p>नल लीकेज, पानी की मोटर पंप, टंकी फिटिंग, फ्लश रिपेयर, पाइपलाइन ब्लॉकेज और सीवर लाइन समाधान।</p>
        </div>
        <div class="service-footer">
          <div class="visit-tag">विजिट: ₹120 - ₹150</div>
          <button class="btn-card-action" onclick="openBookingModal('cat_plumber', 'नल मिस्त्री / प्लंबर (Plumber)', '💧', 150, ['नल से पानी टपक रहा है (लीकेज)', 'पानी की मोटर नहीं चल रही', 'टंकी ओवरफ्लो / नई फिटिंग', 'कमोड / फ्लश रिपेयर', 'पाइपलाइन ब्लॉकेज / जाम'])">
            <span>💧 प्लंबर खोजें</span>
          </button>
        </div>
      </div>

      <!-- 3. Appliance -->
      <div class="service-card card-cyan">
        <div>
          <div class="service-icon">❄️</div>
          <h3>AC व उपकरण मरम्मत (Appliance Care)</h3>
          <p>स्प्लिट व विंडो AC सर्विस, गैस चार्जिंग, रेफ्रिजरेटर, माइक्रोवेव, और वॉशिंग मशीन की त्वरित मरम्मत।</p>
        </div>
        <div class="service-footer">
          <div class="visit-tag">विजिट: ₹200</div>
          <button class="btn-card-action" onclick="openBookingModal('cat_appliance', 'AC व उपकरण मरम्मत (Appliance Care)', '❄️', 200, ['AC कूलिंग नहीं कर रहा', 'AC गैस लीकेज / चार्जिंग', 'फ्रिज में बर्फ नहीं जम रही', 'वॉशिंग मशीन स्पिन नहीं कर रही', 'गीजर पानी गर्म नहीं कर रहा'])">
            <span>❄️ तकनीशियन खोजें</span>
          </button>
        </div>
      </div>

      <!-- 4. Carpenter -->
      <div class="service-card card-orange">
        <div>
          <div class="service-icon">🚪</div>
          <h3>बढ़ई / कारपेंटर (Carpenter)</h3>
          <p>दरवाज़े और खिड़की की मरम्मत, लॉक/कब्ज़ा फिटिंग, अलमारी स्लाइडर, और मॉड्यूलर फर्नीचर असेंबली।</p>
        </div>
        <div class="service-footer">
          <div class="visit-tag">विजिट: ₹150</div>
          <button class="btn-card-action" onclick="openBookingModal('cat_carpenter', 'बढ़ई / कारपेंटर (Carpenter)', '🚪', 150, ['दरवाज़ा अटक रहा है / बंद नहीं होता', 'नया लॉक या सिटकनी फिटिंग', 'अलमारी स्लाइडर व हिंज रिपेयर', 'बेड / सोफा की मरम्मत', 'मॉड्यूलर फर्नीचर असेंबली'])">
            <span>🚪 बढ़ई खोजें</span>
          </button>
        </div>
      </div>

      <!-- 5. Painter -->
      <div class="service-card card-purple">
        <div>
          <div class="service-icon">🎨</div>
          <h3>पेंटर / रंगाई (Painter & Polishing)</h3>
          <p>दीवार पुट्टी, डिस्टेंपर, वॉटरप्रूफिंग, इमल्शन पेंट और लकड़ी व लोहे की खिड़कियों की पॉलिशिंग कार्य।</p>
        </div>
        <div class="service-footer">
          <div class="visit-tag">विजिट: ₹200</div>
          <button class="btn-card-action" onclick="openBookingModal('cat_painter', 'पेंटर / रंगाई (Painter)', '🎨', 200, ['एक कमरे का टच-अप पेंट', 'सीलन / वॉटरप्रूफिंग उपचार', 'संपूर्ण घर का पुट्टी व पेंट', 'लकड़ी के दरवाज़ों की पॉलिश', 'लोहे की ग्रिल / गेट पेंटिंग'])">
            <span>🎨 पेंटर खोजें</span>
          </button>
        </div>
      </div>

      <!-- 6. Cleaning -->
      <div class="service-card card-emerald">
        <div>
          <div class="service-icon">🧹</div>
          <h3>घर की डीप क्लीनिंग (Deep Cleaning)</h3>
          <p>बाथरूम एसिड वॉश, किचन डीग्रीजिंग, सोफा व गद्दों की शैम्पू सफाई और संपूर्ण घर का सैनिटाइजेशन।</p>
        </div>
        <div class="service-footer">
          <div class="visit-tag">विजिट: ₹250</div>
          <button class="btn-card-action" onclick="openBookingModal('cat_cleaning', 'घर की डीप क्लीनिंग (Deep Cleaning)', '🧹', 250, ['बाथरूम टाइल्स एसिड वॉश', 'किचन चिमनी व डीग्रीजिंग', 'सोफा व गद्दों की वैक्यूमिंग', 'पूरे मकान की डीप क्लीनिंग', 'पानी की टंकी की अंदरूनी सफाई'])">
            <span>🧹 क्लीनर खोजें</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Interactive Booking / Contact Modal Dialog -->
    <div id="bookingModal" class="modal-overlay">
      <div class="modal-box">
        <div class="modal-header">
          <h3 id="modalTitle">⚡ सेवा का अनुरोध करें</h3>
          <button class="btn-close-modal" onclick="closeBookingModal()">✕</button>
        </div>
        <div class="modal-body">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; background:#F8FAFC; padding:0.75rem 1rem; border-radius:8px; border:1px solid #CBD5E1;">
            <div>
              <span style="font-size:0.85rem; color:#64748B;">चयनित श्रेणी:</span>
              <div id="modalCategoryBadge" style="font-weight:900; color:#1E3A8A; font-size:1.1rem;">बिजली मिस्त्री</div>
            </div>
            <div style="text-align:right;">
              <span style="font-size:0.85rem; color:#64748B;">विजिट शुल्क:</span>
              <div id="modalVisitFee" style="font-weight:900; color:#B45309; font-size:1.1rem;">₹150</div>
            </div>
          </div>

          <!-- Step 1: Problem Selection -->
          <div class="modal-step-title">1. अपनी समस्या चुनें (या नीचे लिखें):</div>
          <div id="modalProblemTags" class="problem-tags-container"></div>
          <input type="text" id="modalCustomDesc" class="search-input" style="padding-left:1rem; margin-bottom:1.25rem;" placeholder="अन्य समस्या का विवरण लिखें...">

          <!-- Step 2: Location -->
          <div class="modal-step-title">2. अपना जिला व मोहल्ला:</div>
          <div style="display:flex; gap:0.5rem; margin-bottom:1.25rem;">
            <select id="modalDistrictSelect" class="district-select" style="min-width:140px;">
              <option value="lucknow">लखनऊ (Lucknow)</option>
              <option value="varanasi">वाराणसी (Varanasi)</option>
              <option value="kanpur_nagar">कानपुर नगर (Kanpur)</option>
            </select>
            <input type="text" id="modalAddress" class="search-input" style="padding-left:1rem;" placeholder="मोहल्ला (उदा: गोमती नगर, विभूति खंड)" value="गोमती नगर, विभूति खंड">
          </div>

          <!-- Step 3: Matched Provider Preview -->
          <div class="modal-step-title">3. इस अनुरोध को प्राप्त करने वाले नजदीकी कामसाथी:</div>
          <div class="matched-provider-preview">
            <div style="font-size:2rem;">👨‍🔧</div>
            <div style="flex:1;">
              <div id="modalProviderName" style="font-weight:900; color:#0F172A;">रमेश चंद्र वर्मा (Verma Electricals)</div>
              <div style="font-size:0.85rem; color:#64748B;">📍 गोमती नगर, लखनऊ • ★ 4.8 (56 कार्य पूर्ण)</div>
              <div style="font-size:0.75rem; color:#065F46; font-weight:800;">✓ पहचान सत्यापित • ITI डिप्लोमा धारक</div>
            </div>
          </div>

          <!-- Action Button -->
          <button id="btnModalSubmit" class="btn-search" style="width:100%; justify-content:center; padding:1rem; font-size:1.15rem;" onclick="submitModalRequest()">
            <span>📲 मिस्त्री से संपर्क करें (Send Request)</span>
          </button>
          
          <div id="modalSuccessBox" style="display:none; margin-top:1rem; background:#DCFCE7; border:2px solid #22C55E; color:#065F46; padding:1rem; border-radius:8px; font-size:0.95rem; line-height:1.5;">
            <div style="font-weight:900; font-size:1.1rem; margin-bottom:0.4rem;">🎉 अनुरोध सफलतापूर्वक दर्ज हो गया!</div>
            <div>आपका अनुरोध गोमती नगर के सत्यापित कारीगरों को भेज दिया गया है। कारीगर का कोटेशन प्राप्त होते ही फोन नंबर अनलॉक हो जाएगा।</div>
            <div style="margin-top:0.75rem;">
              <button class="btn-card-action" style="background:#065F46; color:white;" onclick="closeBookingModal(); scrollToProviders();">
                👨‍🔧 कारीगर की पूरी प्रोफ़ाइल देखें
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Digital Visiting Card & Profile Share Modal -->
    <div id="shareProfileModal" class="modal-overlay">
      <div class="modal-box" style="max-width:520px;">
        <div class="modal-header" style="background:linear-gradient(135deg, #065F46 0%, #047857 100%);">
          <h3>📲 डिजिटल प्रोफ़ाइल शेयर करें</h3>
          <button class="btn-close-modal" onclick="closeShareModal()">✕</button>
        </div>
        <div class="modal-body">
          <!-- Visiting Card Preview -->
          <div style="background:linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%); color:white; border-radius:14px; padding:1.5rem; border:2px solid #F59E0B; box-shadow:0 10px 25px rgba(0,0,0,0.25); margin-bottom:1.5rem; position:relative;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div>
                <div style="font-size:0.75rem; background:#F59E0B; color:black; font-weight:900; padding:0.2rem 0.55rem; border-radius:4px; display:inline-block; margin-bottom:0.5rem;">
                  कामसाथी सत्यापित डिजिटल कार्ड
                </div>
                <h4 id="shareModalName" style="font-size:1.4rem; font-weight:900;">रमेश चंद्र वर्मा</h4>
                <div id="shareModalTrade" style="font-size:0.95rem; color:#93C5FD; font-weight:700;">वर्मा इलेक्ट्रिकल्स • गोमती नगर, लखनऊ</div>
              </div>
              <div style="background:#10B981; color:white; font-weight:900; padding:0.4rem 0.75rem; border-radius:8px; font-size:0.9rem; text-align:center;">
                <div id="shareModalRating">★ 4.8</div>
                <div style="font-size:0.7rem; opacity:0.9;">सत्यापित</div>
              </div>
            </div>
            <div style="margin-top:1rem; border-top:1px solid rgba(255,255,255,0.2); padding-top:0.75rem; display:flex; gap:0.5rem; flex-wrap:wrap; font-size:0.78rem;">
              <span style="background:rgba(255,255,255,0.15); padding:0.2rem 0.5rem; border-radius:4px;">✓ सरकारी पहचान पत्र सत्यापित</span>
              <span style="background:rgba(255,255,255,0.15); padding:0.2rem 0.5rem; border-radius:4px;">✓ 0% प्लेटफ़ॉर्म कमीशन</span>
              <span style="background:rgba(255,255,255,0.15); padding:0.2rem 0.5rem; border-radius:4px;">✓ सीधा भुगतान (Cash/UPI)</span>
            </div>
          </div>

          <!-- Share on WhatsApp CTA -->
          <div style="margin-bottom:1.25rem;">
            <a id="shareModalWhatsappBtn" href="#" target="_blank" class="btn-share-action" style="display:flex; width:100%; text-decoration:none; padding:0.95rem; font-size:1.05rem; border-radius:10px;">
              <span>🟢 सीधे WhatsApp पर शेयर करें</span>
            </a>
          </div>

          <!-- Copy Link Box -->
          <div class="modal-step-title">या लिंक कॉपी करके कहीं भी भेजें:</div>
          <div style="display:flex; gap:0.5rem; margin-bottom:1rem;">
            <input type="text" id="shareModalLinkInput" class="console-input" style="margin-bottom:0; background:#F8FAFC; color:#0F172A; border-color:#CBD5E1; font-weight:700;" readonly>
            <button class="btn-console-action" style="background:#1E3A8A; white-space:nowrap; padding:0.75rem 1.25rem;" onclick="copyShareLink()">
              📋 लिंक कॉपी करें
            </button>
          </div>

          <!-- Copy Toast -->
          <div id="shareCopyToast" style="display:none; background:#DCFCE7; border:2px solid #22C55E; color:#065F46; padding:0.75rem 1rem; border-radius:8px; font-size:0.9rem; font-weight:800; text-align:center;">
            ✅ लिंक कॉपी हो गया! अब आप इसे WhatsApp, SMS या कहीं भी पेस्ट कर सकते हैं।
          </div>
        </div>
      </div>
    </div>

    <!-- Verified Providers Directory -->
    <div id="providers" class="section-header">
      <div>
        <h2 class="section-title">👨‍🔧 सत्यापित कामसाथी डायरेक्टरी (Verified Providers)</h2>
        <p class="section-desc">उत्तर प्रदेश के सत्यापित और विश्वसनीय स्थानीय सेवा प्रदाता।</p>
      </div>
      <div style="font-size:0.9rem; color:#1E3A8A; font-weight:800; background:#DBEAFE; padding:0.4rem 0.8rem; border-radius:6px; border:1px solid #93C5FD;">
        🔒 संपर्क विवरण सुरक्षित (Gated Contact Reveal - APP-002)
      </div>
    </div>

    <!-- Category Filter Bar for Directory -->
    <div class="directory-filter-bar">
      <button class="dir-filter-btn active" onclick="filterProviders('all')">सभी कारीगर (All)</button>
      <button class="dir-filter-btn" onclick="filterProviders('cat_electrician')">⚡ बिजली मिस्त्री</button>
      <button class="dir-filter-btn" onclick="filterProviders('cat_plumber')">💧 नल मिस्त्री</button>
      <button class="dir-filter-btn" onclick="filterProviders('cat_appliance')">❄️ उपकरण मरम्मत</button>
    </div>

    <div class="providers-grid">
      <!-- Provider 1 -->
      <div id="provider-p_lucknow_elec_001" class="provider-card provider-card-1" data-cat="cat_electrician">
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
            <span class="badge-check" style="background:#1E3A8A;">✓ ITI इलेक्ट्रीशियन</span>
            <span class="badge-check" style="background:#B45309;">✓ वायरमैन लाइसेंस</span>
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
        <div style="display:flex; gap:0.6rem; margin-top:1rem;">
          <button class="btn-provider-action" style="flex:2;" onclick="openBookingModal('cat_electrician', 'बिजली मिस्त्री (Electrician)', '⚡', 150, ['पंखा रिपेयर', 'स्विच-सॉकेट', 'MCB ट्रिपिंग'])">
            ⚡ कोटेशन मंगवाएं
          </button>
          <button class="btn-share-action" style="flex:1;" onclick="shareProviderProfile('p_lucknow_elec_001', 'रमेश चंद्र वर्मा', 'वर्मा इलेक्ट्रिकल्स', 'गोमती नगर, लखनऊ', '4.8', '56')">
            📲 शेयर करें
          </button>
        </div>
      </div>

      <!-- Provider 2 -->
      <div id="provider-p_lucknow_plum_001" class="provider-card provider-card-2" data-cat="cat_plumber">
        <div>
          <div class="provider-head">
            <div class="provider-avatar">सु</div>
            <div class="provider-info">
              <h4>सुरेश कुमार यादव</h4>
              <div class="provider-trade">यादव सेनेटरी एवं प्लंबिंग वर्क्स</div>
              <div class="provider-location">📍 आलमबाग, लखनऊ (UP)</div>
            </div>
          </div>
          <div>
            <span class="badge-check">✓ पहचान पत्र सत्यापित</span>
            <span class="badge-check" style="background:#0369A1;">✓ पुलिस सत्यापनीय</span>
            <span class="badge-check" style="background:#047857;">✓ 100% संतोष दर</span>
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
        <div style="display:flex; gap:0.6rem; margin-top:1rem;">
          <button class="btn-provider-action" style="flex:2;" onclick="openBookingModal('cat_plumber', 'नल मिस्त्री / प्लंबर (Plumber)', '💧', 150, ['नल लीकेज', 'मोटर रिपेयर', 'टंकी फिटिंग'])">
            💧 कोटेशन मंगवाएं
          </button>
          <button class="btn-share-action" style="flex:1;" onclick="shareProviderProfile('p_lucknow_plum_001', 'सुरेश कुमार यादव', 'यादव सेनेटरी एवं प्लंबिंग', 'आलमबाग, लखनऊ', '4.7', '48')">
            📲 शेयर करें
          </button>
        </div>
      </div>

      <!-- Provider 3 -->
      <div id="provider-p_lucknow_hvac_001" class="provider-card provider-card-3" data-cat="cat_appliance">
        <div>
          <div class="provider-head">
            <div class="provider-avatar">मो</div>
            <div class="provider-info">
              <h4>मोहम्मद इमरान</h4>
              <div class="provider-trade">इमरान कूल केयर एवं AC सर्विस</div>
              <div class="provider-location">📍 हजरतगंज, लखनऊ (UP)</div>
            </div>
          </div>
          <div>
            <span class="badge-check">✓ पहचान पत्र सत्यापित</span>
            <span class="badge-check" style="background:#0891B2;">✓ HVAC प्रमाणित</span>
            <span class="badge-check" style="background:#7C2D12;">✓ उपकरण विशेषज्ञ</span>
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
        <div style="display:flex; gap:0.6rem; margin-top:1rem;">
          <button class="btn-provider-action" style="flex:2;" onclick="openBookingModal('cat_appliance', 'AC व उपकरण मरम्मत (Appliance Care)', '❄️', 200, ['AC सर्विस', 'गैस चार्जिंग', 'फ्रिज रिपेयर'])">
            ❄️ कोटेशन मंगवाएं
          </button>
          <button class="btn-share-action" style="flex:1;" onclick="shareProviderProfile('p_lucknow_hvac_001', 'मोहम्मद इमरान', 'इमरान कूल केयर एवं AC', 'हजरतगंज, लखनऊ', '4.9', '72')">
            📲 शेयर करें
          </button>
        </div>
      </div>
    </div>

    <!-- Live Interactive API & Pilot Test Console -->
    <div id="console" class="console-section">
      <div class="console-header">
        <div class="console-title-group">
          <div class="console-status-dot"></div>
          <h3 style="font-size:1.25rem; font-weight:900; color:white; letter-spacing:0.02em;">⚡ लाइव पायलट टेस्ट कंसोल (Browser Test Console)</h3>
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
            <div style="display:flex; gap:0.6rem; flex-wrap:wrap; margin-bottom:1.25rem;">
              <button class="quick-account-btn" onclick="selectAccount('+919876500901', 'Amit Srivastava', 'lucknow')">👤 अमित श्रीवास्तव (लखनऊ)</button>
              <button class="quick-account-btn" onclick="selectAccount('+919876500902', 'Priya Gupta', 'varanasi')">👤 प्रिया गुप्ता (वाराणसी)</button>
              <button class="quick-account-btn" onclick="selectAccount('+919876500903', 'Sanjay Bajpai', 'kanpur_nagar')">👤 संजय बाजपेई (कानपुर)</button>
            </div>

            <label class="form-label" for="phoneInput">ग्राहक फोन नंबर (Customer Phone):</label>
            <input type="text" id="phoneInput" class="console-input" value="+919876500901">

            <div style="display:flex; gap:0.6rem; margin-bottom:1.25rem;">
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

          <!-- Tab 2: Provider Controls -->
          <div id="providerControls" style="display:none;">
            <label class="form-label">सीधे प्रदाता चुनें (Quick Pre-fill Provider):</label>
            <div style="display:flex; gap:0.6rem; flex-wrap:wrap; margin-bottom:1.25rem;">
              <button class="quick-account-btn" onclick="selectProviderAccount('+919876500101', 'Ramesh Verma', 'Electrician')">🛠️ रमेश वर्मा (बिजली मिस्त्री)</button>
              <button class="quick-account-btn" onclick="selectProviderAccount('+919876500102', 'Suresh Yadav', 'Plumber')">🛠️ सुरेश यादव (प्लंबर)</button>
              <button class="quick-account-btn" onclick="selectProviderAccount('+919876500103', 'Mohd. Imran', 'Appliance')">🛠️ मो. इमरान (AC रिपेयर)</button>
            </div>

            <label class="form-label" for="providerPhoneInput">प्रदाता फोन नंबर:</label>
            <input type="text" id="providerPhoneInput" class="console-input" value="+919876500101">

            <div style="display:flex; gap:0.6rem; margin-bottom:1.25rem;">
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
              <button class="btn-console-action" style="background:#25D366; border-color:#16A34A; color:#000; font-weight:900;" onclick="shareProviderProfile('p_lucknow_elec_001', 'रमेश चंद्र वर्मा', 'वर्मा इलेक्ट्रिकल्स', 'गोमती नगर, लखनऊ', '4.8', '56')">
                📲 मेरी प्रोफ़ाइल शेयर करें (WhatsApp)
              </button>
            </div>
          </div>

          <!-- Tab 3: Admin Controls -->
          <div id="adminControls" style="display:none;">
            <label class="form-label">प्रशासक लॉगिन क्रेडेंशियल्स (Admin Credentials):</label>
            <input type="text" id="adminEmailInput" class="console-input" value="admin@kaamsaathi.in">
            <input type="password" id="adminPasswordInput" class="console-input" value="Admin@Pass1234!">

            <div style="display:flex; gap:0.6rem; margin-bottom:1.5rem;">
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
            <span id="terminalStatusBadge" style="color:#22C55E;">IDLE</span>
          </div>
          <div id="terminalOutput" class="terminal-code">// कामसाथी इंटरएक्टिव API कंसोल तैयार है।
// किसी भी सेवा कार्ड के 'खोजें' या 'शेयर करें' बटन पर क्लिक करके सीधे मोडल का परीक्षण करें।
// सभी एंडपॉइंट्स वास्तविक इन-मेमोरी टेस्ट डेटाबेस से जुड़े हैं।</div>
        </div>
      </div>
    </div>

    <!-- 360-Degree Legal & Regulatory Shield -->
    <div id="legal" class="legal-shield-box">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
        <div>
          <h2 class="section-title">🛡️ 360° विधिक व नियामक रक्षा कवच (Legal Immunization Shield)</h2>
          <p class="section-desc">उत्तर प्रदेश में 100% सुरक्षित, गैर-विवादित और नियामकीय रूप से प्रतिरक्षा प्रणाली।</p>
        </div>
        <span class="badge-pill" style="background:#059669; color:white; border-color:#34D399; font-size:0.9rem; padding:0.35rem 0.9rem;">✓ कानूनी प्रतिरक्षा सक्रिय</span>
      </div>

      <div class="legal-pills-grid">
        <div class="legal-pill-card legal-card-1">
          <div class="legal-pill-icon">⚖️</div>
          <div class="legal-pill-title">1. उपभोक्ता संरक्षण एवं Safe Harbor</div>
          <div class="legal-pill-desc">
            IT Act धारा 79 एवं Consumer Protection Rules 2020 के तहत पूर्ण सुरक्षित पनाहगाह। कामसाथी शून्य मार्कअप रखता है और कार्य की वारंटी नहीं देता।
          </div>
        </div>

        <div class="legal-pill-card legal-card-2">
          <div class="legal-pill-icon">💼</div>
          <div class="legal-pill-title">2. श्रम कानून एवं गिग वर्कर सुरक्षा</div>
          <div class="legal-pill-desc">
            सभी कामसाथी <strong>स्वतंत्र सेवा प्रदाता (Independent Contractors)</strong> हैं। कोई निश्चित समय, कोई अनिवार्यता नहीं। कारीगर अपनी दरें स्वयं तय करते हैं।
          </div>
        </div>

        <div class="legal-pill-card legal-card-3">
          <div class="legal-pill-icon">👮</div>
          <div class="legal-pill-title">3. आपराधिक व पुलिस सहयोग (CrPC 91)</div>
          <div class="legal-pill-desc">
            शारीरिक पहचान पत्र (Voter ID/DL) का अनिवार्य सत्यापन। पुलिस या न्यायिक जांच हेतु धारा 91 CrPC के तहत 24 घंटे में त्वरित रिकॉर्ड सहयोग।
          </div>
        </div>

        <div class="legal-pill-card legal-card-4">
          <div class="legal-pill-icon">🔒</div>
          <div class="legal-pill-title">4. डेटा गोपनीयता (DPDP Act 2023)</div>
          <div class="legal-pill-desc">
            संपर्क नंबर और पते का क्रिप्टोग्राफिक एन्क्रिप्शन। ग्राहक द्वारा कोटेशन स्वीकार किए जाने से पहले फोन नंबर किसी को नहीं दिखाया जाता (APP-002)।
          </div>
        </div>

        <div class="legal-pill-card legal-card-5">
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
        <div class="brand-title" style="color:#F59E0B; margin-bottom:0.6rem;">कामसाथी (KaamSaathi)</div>
        <p style="margin-bottom:1.1rem; line-height:1.6; font-weight:600;">उत्तर प्रदेश के स्थानीय मिस्त्री, कारीगर और परिवारों को तकनीकी रूप से सशक्त बनाने वाला हाइपरलोकल मंच।</p>
        <p><strong style="color:#FFFFFF;">शिकायत निवारण अधिकारी (Grievance Officer):</strong></p>
        <p style="color:#E2E8F0;">श्री राजेश्वर दयाल वर्मा, प्रमुख — ट्रस्ट, सुरक्षा एवं विधिक मामले</p>
        <p style="color:#94A3B8;">कार्यालय: 4th Floor, Cyber Heights, Vibhuti Khand, Gomti Nagar, Lucknow, Uttar Pradesh – 226010</p>
        <p style="margin-top:0.35rem;">ईमेल: <a href="mailto:grievance-officer@kaamsaathi.in">grievance-officer@kaamsaathi.in</a> | फोन: <a href="tel:+915224918000">+91 522 491 8000</a></p>
      </div>
      <div>
        <div class="footer-title">विधिक नीतियां एवं प्रलेख</div>
        <p><a href="#" onclick="alert('नियम एवं शर्तें (Terms of Service) प्रलेख docs/legal/TERMS_OF_SERVICE.md में उपलब्ध है।'); return false;">📄 सेवा की शर्तें (Terms of Service)</a></p>
        <p style="margin-top:0.55rem;"><a href="#" onclick="alert('प्रदाता अनुबंध (Provider Partner Agreement) प्रलेख docs/legal/PROVIDER_PARTNER_AGREEMENT.md में उपलब्ध है।'); return false;">📄 कारीगर अनुबंध (Partner Agreement)</a></p>
        <p style="margin-top:0.55rem;"><a href="#" onclick="alert('गोपनीयता नीति (Privacy Policy) प्रलेख docs/legal/PRIVACY_POLICY.md में उपलब्ध है।'); return false;">🔒 डेटा गोपनीयता नीति (Privacy Policy)</a></p>
        <p style="margin-top:0.55rem;"><a href="#" onclick="alert('विधिक सुरक्षा विवरण docs/legal/COMPREHENSIVE_LEGAL_AND_REGULATORY_SHIELD.md में उपलब्ध है।'); return false;">🛡️ 360° विधिक कवच गाइड</a></p>
      </div>
      <div>
        <div class="footer-title">पायलट जिले (Pilot Districts)</div>
        <p>📍 <strong>लखनऊ (Lucknow)</strong> — गोमती नगर, आलमबाग, हजरतगंज</p>
        <p style="margin-top:0.4rem;">📍 <strong>वाराणसी (Varanasi)</strong> — सिगरा, लंका, भेलूपुर</p>
        <p style="margin-top:0.4rem;">📍 <strong>कानपुर नगर (Kanpur)</strong> — काकादेव, गोविंद नगर</p>
        <p style="margin-top:1.1rem; font-size:0.85rem; color:#FDE047; font-weight:700;">चरण-2 में उत्तर प्रदेश के सभी 75 जिलों में विस्तार प्रस्तावित।</p>
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
    let activeModalCategoryId = null;

    function setTerminalOutput(title, status, data, latencyMs) {
      const badge = document.getElementById('terminalStatusBadge');
      if (badge) {
        badge.innerText = status ? 'HTTP ' + status + ' (' + latencyMs + 'ms)' : 'BUSY';
        badge.style.color = (status >= 200 && status < 300) ? '#22C55E' : '#EF4444';
      }

      const terminal = document.getElementById('terminalOutput');
      if (terminal) {
        terminal.innerText = '>>> ' + title + '\\n' +
                             (status ? '>>> STATUS: ' + status + ' | LATENCY: ' + latencyMs + 'ms\\n\\n' : '') +
                             (typeof data === 'object' ? JSON.stringify(data, null, 2) : data);
      }
    }

    // Modal Functions
    function openBookingModal(catId, catName, icon, visitPaise, problemTags) {
      activeModalCategoryId = catId;
      const modal = document.getElementById('bookingModal');
      if (!modal) return;

      document.getElementById('modalTitle').innerHTML = icon + ' ' + catName + ' खोजें व संपर्क करें';
      document.getElementById('modalCategoryBadge').innerText = catName;
      document.getElementById('modalVisitFee').innerText = '₹' + visitPaise;
      document.getElementById('modalSuccessBox').style.display = 'none';
      document.getElementById('btnModalSubmit').style.display = 'flex';

      const provNameEl = document.getElementById('modalProviderName');
      if (provNameEl) {
        if (catId === 'cat_electrician') {
          provNameEl.innerHTML = 'रमेश चंद्र वर्मा (Verma Electricals) • ★ 4.8';
        } else if (catId === 'cat_plumber') {
          provNameEl.innerHTML = 'सुरेश कुमार यादव (Yadav Sanitation) • ★ 4.7';
        } else {
          provNameEl.innerHTML = 'मोहम्मद इमरान (Imran Cool Care) • ★ 4.9';
        }
      }

      const tagsContainer = document.getElementById('modalProblemTags');
      if (tagsContainer) {
        tagsContainer.innerHTML = '';
        problemTags.forEach((tag, idx) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'problem-tag-pill' + (idx === 0 ? ' selected' : '');
          btn.innerText = tag;
          btn.onclick = function() {
            btn.classList.toggle('selected');
          };
          tagsContainer.appendChild(btn);
        });
      }

      filterProviders(catId);
      modal.classList.add('active');
    }

    function closeBookingModal() {
      const modal = document.getElementById('bookingModal');
      if (modal) modal.classList.remove('active');
    }

    function scrollToProviders() {
      const el = document.getElementById('providers');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }

    function filterProviders(catId) {
      const filterBtns = document.querySelectorAll('.dir-filter-btn');
      filterBtns.forEach(btn => btn.classList.remove('active'));

      const cards = document.querySelectorAll('.providers-grid .provider-card');
      cards.forEach(card => {
        if (catId === 'all' || card.getAttribute('data-cat') === catId) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }

    // Share Profile & WhatsApp Functions
    function shareProviderProfile(id, name, trade, location, rating, jobs) {
      const shareModal = document.getElementById('shareProfileModal');
      if (!shareModal) return;

      const profileUrl = window.location.origin + '/#provider-' + id;
      const shareText = 'नमस्ते! कामसाथी मंच पर ' + name + ' (' + trade + ', ' + location + ') की सत्यापित प्रोफाइल देखें। रेटिंग: ★ ' + rating + ' (' + jobs + ' कार्य पूर्ण)। सीधे काम बुक करने या दरें देखने के लिए लिंक खोलें: ' + profileUrl;

      document.getElementById('shareModalName').innerText = name;
      document.getElementById('shareModalTrade').innerText = trade + ' • ' + location;
      document.getElementById('shareModalRating').innerText = '★ ' + rating;
      document.getElementById('shareModalLinkInput').value = profileUrl;

      const whatsappBtn = document.getElementById('shareModalWhatsappBtn');
      if (whatsappBtn) {
        whatsappBtn.href = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(shareText);
      }

      document.getElementById('shareCopyToast').style.display = 'none';
      shareModal.classList.add('active');

      if (navigator.share && /mobile/i.test(navigator.userAgent)) {
        navigator.share({
          title: name + ' - कामसाथी सत्यापित कारीगर',
          text: shareText,
          url: profileUrl
        }).catch(function(e) { console.log('Share dismissed', e); });
      }
    }

    function closeShareModal() {
      const shareModal = document.getElementById('shareProfileModal');
      if (shareModal) shareModal.classList.remove('active');
    }

    function copyShareLink() {
      const input = document.getElementById('shareModalLinkInput');
      if (!input) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(input.value).then(showShareToast);
      } else {
        input.select();
        document.execCommand('copy');
        showShareToast();
      }
    }

    function showShareToast() {
      const toast = document.getElementById('shareCopyToast');
      if (toast) {
        toast.style.display = 'block';
        setTimeout(function() { toast.style.display = 'none'; }, 3500);
      }
    }

    // URL Hash listener for direct shared link
    window.addEventListener('DOMContentLoaded', function() {
      if (window.location.hash && window.location.hash.startsWith('#provider-')) {
        const targetId = window.location.hash.substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          setTimeout(function() {
            targetEl.scrollIntoView({ behavior: 'smooth' });
            targetEl.style.boxShadow = '0 0 0 6px #F59E0B';
          }, 400);
        }
      }
    });

    async function submitModalRequest() {
      const selectedPills = document.querySelectorAll('#modalProblemTags .problem-tag-pill.selected');
      const pillTexts = Array.from(selectedPills).map(p => p.innerText);
      const customDesc = document.getElementById('modalCustomDesc').value;
      const finalDesc = (pillTexts.join(', ') + (customDesc ? ' — ' + customDesc : '')).trim() || 'त्वरित मरम्मत आवश्यकता';

      const district = document.getElementById('modalDistrictSelect').value;
      const address = document.getElementById('modalAddress').value || 'गोमती नगर, विभूति खंड, लखनऊ';

      if (!currentCustomerToken) {
        try {
          const authRes = await fetch('/api/v1/auth/otp/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone_number: '+919876500901', otp_code: '123456' })
          });
          const authData = await authRes.json();
          if (authData.access_token) {
            currentCustomerToken = authData.access_token;
          }
        } catch (e) {
          console.error(e);
        }
      }

      const t0 = performance.now();
      try {
        const res = await fetch('/api/v1/requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + (currentCustomerToken || '')
          },
          body: JSON.stringify({
            category_id: activeModalCategoryId || 'cat_electrician',
            district_id: district,
            address_line: address,
            description: finalDesc,
            service_timing: 'IMMEDIATE',
            photos: []
          })
        });
        const data = await res.json();
        const latency = Math.round(performance.now() - t0);

        setTerminalOutput('POST /api/v1/requests (Modal Service Booking)', res.status, data, latency);

        document.getElementById('btnModalSubmit').style.display = 'none';
        document.getElementById('modalSuccessBox').style.display = 'block';
      } catch (err) {
        alert('अनुरोध भेजने में त्रुटि: ' + err.message);
      }
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

    function selectProviderAccount(phone, name, trade) {
      document.getElementById('providerPhoneInput').value = phone;
      setTerminalOutput('प्रदाता चयनित: ' + name + ' (' + trade + ')', 200, {
        provider_name: name,
        trade: trade,
        phone: phone,
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
      resBox.innerHTML = '<span style="color:#FDE047; font-weight:800;">⏳ खोज रहे हैं...</span>';

      const t0 = performance.now();
      try {
        const res = await fetch('/api/v1/services/search?q=' + encodeURIComponent(q) + '&district_id=' + encodeURIComponent(district) + '&lang=hi');
        const data = await res.json();
        const latency = Math.round(performance.now() - t0);

        setTerminalOutput('GET /api/v1/services/search?q=' + q, res.status, data, latency);

        if (data.categories && data.categories.length > 0) {
          let html = '<div style="font-weight:900; color:#FDE047; margin-bottom:0.75rem; font-size:1.05rem;">✅ खोज परिणाम (' + data.categories.length + ' श्रेणियां उपलब्ध):</div>';
          html += '<div style="display:flex; gap:0.75rem; flex-wrap:wrap;">';
          data.categories.forEach(c => {
            html += '<div style="background:#0F172A; border:2px solid #38BDF8; padding:0.6rem 1rem; border-radius:8px; color:white;">' +
                    '<strong style="color:#FDE047; font-size:1rem;">' + c.name_hi + '</strong> (' + c.name_en + ') — <span style="color:#34D399; font-weight:800;">न्यूनतम विजिट ₹' + (c.base_fare_paise / 100) + '</span>' +
                    '</div>';
          });
          html += '</div>';
          resBox.innerHTML = html;
        } else {
          resBox.innerHTML = '<span style="color:#FCA5A5; font-weight:700;">⚠️ कोई परिणाम नहीं मिला। कृपया bijli, nal, ac, fan आदि खोजें।</span>';
        }
      } catch (err) {
        resBox.innerHTML = '<span style="color:#FCA5A5; font-weight:700;">त्रुटि: ' + err.message + '</span>';
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
  </script>
</body>
</html>`;
}
