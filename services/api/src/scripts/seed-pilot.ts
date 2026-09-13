import crypto from 'node:crypto';
import url from 'node:url';
import { db, UserRecord, ProviderProfileRecord, CustomerProfileRecord, CategoryRecord, ProviderCoverageRecord, ProviderServiceRecord, RequestRecord, LeadRecord, QuoteRecord } from '../database/db.js';
import { CryptoUtils } from '../common/crypto.utils.js';

export interface SeedPilotSummary {
  clusters: string[];
  categoriesCount: number;
  adminEmail: string;
  adminTotpSecret: string;
  providersCount: number;
  customersCount: number;
  activeRequestsCount: number;
  activeQuotesCount: number;
}

export function seedPilotData(options: { reset?: boolean } = { reset: true }): SeedPilotSummary {
  if (options.reset) {
    db.reset();
  }

  // 1. Ensure UP Service Categories
  const categories: CategoryRecord[] = [
    { id: 'electrician', name_en: 'Electrician', name_hi: 'बिजली मिस्त्री', icon_name: 'zap', display_order: 1, is_active: true },
    { id: 'plumber', name_en: 'Plumber', name_hi: 'नल मिस्त्री / प्लंबर', icon_name: 'droplet', display_order: 2, is_active: true },
    { id: 'appliance_repair', name_en: 'Appliance Repair', name_hi: 'उपकरण मरम्मत (AC/फ्रिज)', icon_name: 'cpu', display_order: 3, is_active: true },
  ];
  for (const cat of categories) {
    db.saveCategory(cat);
  }

  // 2. Seed Admin User
  const adminSalt = crypto.randomBytes(16).toString('hex');
  const adminPasswordHash = crypto.scryptSync('AdminSecurePassword123!', adminSalt, 64).toString('hex');
  const adminTotpSecret = '3132333435363738393031323334353637383930'; // Hex secret (RFC 6238)

  const adminUser: UserRecord = {
    id: 'usr_admin_01',
    phone_hmac: CryptoUtils.hashPhone('+919999900001'),
    phone_encrypted: CryptoUtils.encrypt('+919999900001'),
    status: 'ACTIVE',
    roles: ['ADMIN'],
    active_role: 'ADMIN',
    preferred_language: 'en',
    is_admin: true,
    email: 'admin@kaamsaathi.in',
    password_hash: `${adminSalt}:${adminPasswordHash}`,
    totp_secret: adminTotpSecret,
    created_at: new Date(),
    updated_at: new Date(),
  };
  db.saveUser(adminUser);

  // 3. Seed Verified Providers across 3 UP Seed Clusters
  const providerSeeds = [
    {
      userId: 'usr_prov_lko_01',
      providerId: 'prv_lko_01',
      name: 'Ramesh Chandra Verma',
      businessName: 'Verma Electricals & Wiring',
      phone: '+919876500101',
      district: 'lucknow',
      locality: 'Gomti Nagar',
      trade: 'Electrician',
      categoryId: 'electrician',
      visitationFeePaise: 15000,
      pricingNotes: 'Includes 45-min diagnostic inspection & fuse check',
      experience: 8,
      ratingAvg: 4.8,
      ratingCount: 42,
      jobsCount: 56,
      lat: 26.8500,
      lng: 80.9500,
      radiusMeters: 15000,
      badges: [
        { code: 'ID_VERIFIED', label: 'Aadhaar Verified', reviewed_item: 'Government Photo ID', verified_at: new Date().toISOString() },
        { code: 'SKILL_CERTIFIED', label: 'Trade Certified', reviewed_item: 'ITI Electrical Diploma', verified_at: new Date().toISOString() }
      ]
    },
    {
      userId: 'usr_prov_lko_02',
      providerId: 'prv_lko_02',
      name: 'Suresh Kumar Yadav',
      businessName: 'Yadav Sanitation & Plumbing Works',
      phone: '+919876500102',
      district: 'lucknow',
      locality: 'Alambagh',
      trade: 'Plumber',
      categoryId: 'plumber',
      visitationFeePaise: 15000,
      pricingNotes: 'Leakage detection & pipe inspection',
      experience: 10,
      ratingAvg: 4.7,
      ratingCount: 35,
      jobsCount: 48,
      lat: 26.8200,
      lng: 80.9100,
      radiusMeters: 12000,
      badges: [
        { code: 'ID_VERIFIED', label: 'Aadhaar Verified', reviewed_item: 'Government Photo ID', verified_at: new Date().toISOString() },
        { code: 'POLICE_CLEARED', label: 'Background Verified', reviewed_item: 'UP Police Clearance Certificate', verified_at: new Date().toISOString() }
      ]
    },
    {
      userId: 'usr_prov_lko_03',
      providerId: 'prv_lko_03',
      name: 'Mohammad Imran',
      businessName: 'Imran Cool Care & AC Repair',
      phone: '+919876500103',
      district: 'lucknow',
      locality: 'Hazratganj',
      trade: 'Appliance Technician',
      categoryId: 'appliance_repair',
      visitationFeePaise: 20000,
      pricingNotes: 'Digital manifold gauge & electrical compressor diagnosis',
      experience: 6,
      ratingAvg: 4.9,
      ratingCount: 61,
      jobsCount: 72,
      lat: 26.8500,
      lng: 80.9400,
      radiusMeters: 18000,
      badges: [
        { code: 'ID_VERIFIED', label: 'Aadhaar Verified', reviewed_item: 'Government Photo ID', verified_at: new Date().toISOString() },
        { code: 'SKILL_CERTIFIED', label: 'Appliance Certified', reviewed_item: 'HVAC Technician Certificate', verified_at: new Date().toISOString() }
      ]
    },
    {
      userId: 'usr_prov_vns_01',
      providerId: 'prv_vns_01',
      name: 'Anil Kumar Mishra',
      businessName: 'Mishra Bijli Mistri - Sigra',
      phone: '+919876500201',
      district: 'varanasi',
      locality: 'Sigra',
      trade: 'Electrician',
      categoryId: 'electrician',
      visitationFeePaise: 12000,
      pricingNotes: 'Prompt doorstep visit across Sigra and Lanka belt',
      experience: 12,
      ratingAvg: 4.8,
      ratingCount: 53,
      jobsCount: 64,
      lat: 25.3200,
      lng: 82.9800,
      radiusMeters: 12000,
      badges: [
        { code: 'ID_VERIFIED', label: 'Voter ID Verified', reviewed_item: 'Government Photo ID', verified_at: new Date().toISOString() },
        { code: 'SKILL_CERTIFIED', label: 'Certified Wireman', reviewed_item: 'State Electricity Board License', verified_at: new Date().toISOString() }
      ]
    },
    {
      userId: 'usr_prov_vns_02',
      providerId: 'prv_vns_02',
      name: 'Rajesh Prajapati',
      businessName: 'Prajapati Nal Mistri',
      phone: '+919876500202',
      district: 'varanasi',
      locality: 'Lanka',
      trade: 'Plumber',
      categoryId: 'plumber',
      visitationFeePaise: 12000,
      pricingNotes: 'Tap repair, tank plumbing, and sewer clearing',
      experience: 5,
      ratingAvg: 4.6,
      ratingCount: 28,
      jobsCount: 31,
      lat: 25.2800,
      lng: 82.9900,
      radiusMeters: 10000,
      badges: [
        { code: 'ID_VERIFIED', label: 'Aadhaar Verified', reviewed_item: 'Government Photo ID', verified_at: new Date().toISOString() }
      ]
    },
    {
      userId: 'usr_prov_knp_01',
      providerId: 'prv_knp_01',
      name: 'Manoj Sharma',
      businessName: 'Sharma Refrigerator & Washing Machine Service',
      phone: '+919876500301',
      district: 'kanpur_nagar',
      locality: 'Kakadeo',
      trade: 'Appliance Technician',
      categoryId: 'appliance_repair',
      visitationFeePaise: 20000,
      pricingNotes: 'On-site diagnosis with genuine parts warranty',
      experience: 9,
      ratingAvg: 4.7,
      ratingCount: 44,
      jobsCount: 52,
      lat: 26.4700,
      lng: 80.3000,
      radiusMeters: 15000,
      badges: [
        { code: 'ID_VERIFIED', label: 'Aadhaar Verified', reviewed_item: 'Government Photo ID', verified_at: new Date().toISOString() },
        { code: 'SKILL_CERTIFIED', label: 'Appliance Certified', reviewed_item: 'NSDC Skill Certificate', verified_at: new Date().toISOString() }
      ]
    }
  ];

  for (const p of providerSeeds) {
    // Save User
    db.saveUser({
      id: p.userId,
      phone_hmac: CryptoUtils.hashPhone(p.phone),
      phone_encrypted: CryptoUtils.encrypt(p.phone),
      status: 'ACTIVE',
      roles: ['PROVIDER'],
      active_role: 'PROVIDER',
      preferred_language: 'hi',
      is_admin: false,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Save Provider Profile
    db.saveProviderProfile({
      id: p.providerId,
      user_id: p.userId,
      business_name: p.businessName,
      trade_title: p.trade,
      status: 'APPROVED_ACTIVE',
      availability_status: 'AVAILABLE',
      bio: `Professional ${p.trade} operating in ${p.district} (${p.locality}) with ${p.experience} years of field experience.`,
      years_experience: p.experience,
      rating_avg: p.ratingAvg,
      rating_count: p.ratingCount,
      completed_jobs_count: p.jobsCount,
      badges_summary: p.badges,
      created_at: new Date(),
      updated_at: new Date()
    });

    // Save Coverage
    db.saveProviderCoverage({
      id: `cov_${p.providerId}`,
      provider_id: p.providerId,
      district_id: p.district,
      latitude: p.lat,
      longitude: p.lng,
      radius_meters: p.radiusMeters,
      created_at: new Date()
    });

    // Save Category Service
    db.saveProviderServices(p.providerId, [
      {
        id: `srv_${p.providerId}_${p.categoryId}`,
        provider_id: p.providerId,
        category_id: p.categoryId,
        visitation_fee_paise: p.visitationFeePaise,
        pricing_notes: p.pricingNotes,
        created_at: new Date()
      }
    ]);
  }

  // 4. Seed Customers & Active Requests
  // Customer 1: Lucknow (Amit Srivastava)
  const cust1UserId = 'usr_cust_lko_01';
  const cust1ProfileId = 'cst_lko_01';
  db.saveUser({
    id: cust1UserId,
    phone_hmac: CryptoUtils.hashPhone('+919876500901'),
    phone_encrypted: CryptoUtils.encrypt('+919876500901'),
    status: 'ACTIVE',
    roles: ['CUSTOMER'],
    active_role: 'CUSTOMER',
    preferred_language: 'hi',
    is_admin: false,
    created_at: new Date(),
    updated_at: new Date()
  });
  db.saveCustomerProfile({
    id: cust1ProfileId,
    user_id: cust1UserId,
    full_name: 'Amit Srivastava',
    district_id: 'lucknow',
    locality_name: 'Gomti Nagar',
    pin_code: '226010',
    masked_notifications: true,
    created_at: new Date(),
    updated_at: new Date()
  });

  // Request 1: AC Repair with Quote from Mohammad Imran
  const req1Id = 'req_lko_01';
  const lead1Id = 'lead_lko_01';
  const quote1Id = 'qte_lko_01';
  const req1Record: RequestRecord = {
    id: req1Id,
    customer_id: cust1ProfileId,
    category_id: 'appliance_repair',
    request_type: 'BROADCAST',
    status: 'QUOTES_RECEIVED',
    district_id: 'lucknow',
    locality_name: 'Gomti Nagar',
    pin_code: '226010',
    latitude: 26.8520,
    longitude: 80.9530,
    description: '1.5 Ton Split AC is blowing room temperature air and indoor unit is dripping water. Need urgent inspection.',
    preferred_schedule_window: 'Today 2:00 PM - 5:00 PM',
    media_attachment_paths: [],
    dispatched_leads_count: 1,
    version: 2,
    created_at: new Date(),
    updated_at: new Date()
  };
  db.saveRequest(req1Record);

  const lead1Record: LeadRecord = {
    id: lead1Id,
    request_id: req1Id,
    provider_id: 'prv_lko_03', // Mohammad Imran
    status: 'QUOTED',
    expires_at: new Date(Date.now() + 4 * 3600 * 1000),
    created_at: new Date(),
    updated_at: new Date()
  };
  db.saveLead(lead1Record);

  const quote1Record: QuoteRecord = {
    id: quote1Id,
    request_id: req1Id,
    lead_id: lead1Id,
    provider_id: 'prv_lko_03',
    status: 'DISPATCHED',
    visitation_fee_paise: 20000, // INR 200
    estimated_labor_paise: 35000, // INR 350
    estimated_parts_paise: 80000, // INR 800
    total_estimate_paise: 135000, // INR 1,350
    scope_notes: 'Will inspect indoor drain line, flush condensate tray, and check R32 gas pressure.',
    expires_at: new Date(Date.now() + 4 * 3600 * 1000),
    version: 1,
    created_at: new Date(),
    updated_at: new Date()
  };
  db.saveQuote(quote1Record);

  // Customer 2: Varanasi (Priya Gupta)
  const cust2UserId = 'usr_cust_vns_01';
  const cust2ProfileId = 'cst_vns_01';
  db.saveUser({
    id: cust2UserId,
    phone_hmac: CryptoUtils.hashPhone('+919876500902'),
    phone_encrypted: CryptoUtils.encrypt('+919876500902'),
    status: 'ACTIVE',
    roles: ['CUSTOMER'],
    active_role: 'CUSTOMER',
    preferred_language: 'hi',
    is_admin: false,
    created_at: new Date(),
    updated_at: new Date()
  });
  db.saveCustomerProfile({
    id: cust2ProfileId,
    user_id: cust2UserId,
    full_name: 'Priya Gupta',
    district_id: 'varanasi',
    locality_name: 'Sigra',
    pin_code: '221002',
    masked_notifications: true,
    created_at: new Date(),
    updated_at: new Date()
  });

  // Request 2: Electrician Request matching in progress
  const req2Id = 'req_vns_01';
  const lead2Id = 'lead_vns_01';
  const req2Record: RequestRecord = {
    id: req2Id,
    customer_id: cust2ProfileId,
    category_id: 'electrician',
    request_type: 'BROADCAST',
    status: 'MATCHING',
    district_id: 'varanasi',
    locality_name: 'Sigra',
    pin_code: '221002',
    latitude: 25.3210,
    longitude: 82.9810,
    description: 'Kitchen main MCB trips repeatedly when mixer or kettle is turned on. Need load testing.',
    preferred_schedule_window: 'Tomorrow Morning 10:00 AM',
    media_attachment_paths: [],
    dispatched_leads_count: 1,
    version: 1,
    created_at: new Date(),
    updated_at: new Date()
  };
  db.saveRequest(req2Record);

  const lead2Record: LeadRecord = {
    id: lead2Id,
    request_id: req2Id,
    provider_id: 'prv_vns_01', // Anil Kumar Mishra
    status: 'DISPATCHED',
    expires_at: new Date(Date.now() + 4 * 3600 * 1000),
    created_at: new Date(),
    updated_at: new Date()
  };
  db.saveLead(lead2Record);

  return {
    clusters: ['Lucknow', 'Varanasi', 'Kanpur Nagar'],
    categoriesCount: categories.length,
    adminEmail: 'admin@kaamsaathi.in',
    adminTotpSecret,
    providersCount: providerSeeds.length,
    customersCount: 2,
    activeRequestsCount: 2,
    activeQuotesCount: 1,
  };
}

// Standalone CLI runner
if (process.argv[1] && import.meta.url === url.pathToFileURL(process.argv[1]).href) {
  console.log('\n🌱 =========================================================');
  console.log('   KAAMSAATHI (कामसाथी) — UTTAR PRADESH PILOT SEED ENGINE');
  console.log('=========================================================\n');

  const summary = seedPilotData({ reset: true });

  console.log(`✅ Seeded ${summary.categoriesCount} Service Categories: Electrician, Plumber, Appliance Repair`);
  console.log(`✅ Seeded ${summary.clusters.length} UP Clusters: ${summary.clusters.join(', ')}`);
  console.log(`✅ Seeded ${summary.providersCount} Verified Providers with 48dp Compose badges & coverage`);
  console.log(`✅ Seeded ${summary.customersCount} Customer Profiles with active UP service requests`);
  console.log(`✅ Seeded ${summary.activeQuotesCount} Sample Dispatched Quote ready for atomic booking\n`);

  console.log('---------------------------------------------------------');
  console.log('🔐 ADMIN OPERATIONS CREDENTIALS:');
  console.log('   Email:       admin@kaamsaathi.in');
  console.log('   Password:    AdminSecurePassword123!');
  console.log('   TOTP Secret: 3132333435363738393031323334353637383930');
  console.log(`   Sample TOTP: ${CryptoUtils.generateTotp(summary.adminTotpSecret)} (Valid for next 30s)`);
  console.log('---------------------------------------------------------');
  console.log('📱 PILOT TEST ACCOUNTS (Dev OTP: 123456):');
  console.log('   Customer 1 (Lucknow):   +91 9876500901  (Amit Srivastava - AC Repair)');
  console.log('   Customer 2 (Varanasi):  +91 9876500902  (Priya Gupta - Electrician)');
  console.log('   Provider 1 (Lucknow):   +91 9876500101  (Ramesh Verma - Electrician)');
  console.log('   Provider 2 (Lucknow):   +91 9876500102  (Suresh Yadav - Plumber)');
  console.log('   Provider 3 (Lucknow):   +91 9876500103  (Mohammad Imran - AC Repair)');
  console.log('   Provider 4 (Varanasi):  +91 9876500201  (Anil Mishra - Electrician)');
  console.log('   Provider 5 (Varanasi):  +91 9876500202  (Rajesh Prajapati - Plumber)');
  console.log('   Provider 6 (Kanpur):    +91 9876500301  (Manoj Sharma - Appliance Repair)');
  console.log('=========================================================\n');
}
