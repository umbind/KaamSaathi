import { OtpRequestPayload, OtpVerifyPayload, AuthSessionResponse, CategoryDto } from '@kaamsaathi/contracts';
import { t } from '@kaamsaathi/localization';

export class KaamSaathiWebClient {
  private apiBaseUrl: string;
  private currentLanguage: 'hi' | 'en' = 'hi';

  constructor(apiBaseUrl: string = 'http://localhost:3000') {
    this.apiBaseUrl = apiBaseUrl;
  }

  setLanguage(lang: 'hi' | 'en') {
    this.currentLanguage = lang;
  }

  getLanguage(): 'hi' | 'en' {
    return this.currentLanguage;
  }

  getLocalizedText(key: string, params?: Record<string, string | number>): string {
    return t(key, this.currentLanguage, params);
  }

  async getCategories(): Promise<CategoryDto[]> {
    const res = await fetch(`${this.apiBaseUrl}/api/v1/categories`, {
      method: 'GET',
      headers: {
        'Accept-Language': this.currentLanguage
      }
    });
    return res.json() as Promise<CategoryDto[]>;
  }

  async requestOtp(payload: OtpRequestPayload, idempotencyKey: string): Promise<unknown> {
    const res = await fetch(`${this.apiBaseUrl}/api/v1/auth/otp/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey
      },
      body: JSON.stringify(payload)
    });
    return res.json();
  }

  async verifyOtp(payload: OtpVerifyPayload, idempotencyKey: string): Promise<AuthSessionResponse> {
    const res = await fetch(`${this.apiBaseUrl}/api/v1/auth/otp/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey
      },
      body: JSON.stringify(payload)
    });
    return res.json() as Promise<AuthSessionResponse>;
  }
}

export interface SeoLandingPageParams {
  district: string;
  category: string;
  language?: 'hi' | 'en';
}

export function generateStructuredData(params: SeoLandingPageParams): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: params.category,
    provider: {
      '@type': 'LocalBusiness',
      name: `KaamSaathi ${params.category} Services - ${params.district}`,
      areaServed: {
        '@type': 'AdministrativeArea',
        name: params.district,
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: 'Uttar Pradesh, India',
        },
      },
    },
    termsOfService: 'https://kaamsaathi.in/terms',
  };
}

export function generateLandingPageHtml(params: SeoLandingPageParams): string {
  const isHi = params.language !== 'en';
  const categoryTitle = isHi
    ? (params.category === 'electrician' ? 'बिजली मिस्त्री' : params.category === 'plumber' ? 'नल मिस्त्री' : 'उपकरण मरम्मत')
    : params.category;
  const title = isHi
    ? `${params.district} में सत्यापित ${categoryTitle} | कामसाथी`
    : `Verified ${categoryTitle} in ${params.district} | KaamSaathi`;

  const structuredData = JSON.stringify(generateStructuredData(params));

  return `<!DOCTYPE html>
<html lang="${isHi ? 'hi' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${isHi ? `${params.district}, उत्तर प्रदेश में सर्वश्रेष्ठ स्थानीय मिस्त्री और तकनीशियन खोजें।` : `Find trusted, verified local technicians in ${params.district}, Uttar Pradesh.`}">
  <script type="application/ld+json">
${structuredData}
  </script>
</head>
<body>
  <header>
    <h1>${title}</h1>
  </header>
  <main>
    <div class="disclaimer-banner" role="alert">
      <p><strong>${isHi ? 'सूचना:' : 'Disclaimer:'}</strong> ${
        isHi
          ? 'मंच स्वतंत्र सेवा प्रदाताओं को जोड़ता है। मंच सेवा प्रदाता की व्यक्तिगत क्षमता या व्यक्तिगत सुरक्षा की गारंटी नहीं देता है।'
          : 'The platform connects you with independent service providers. The platform does not guarantee provider competence or personal safety.'
      }</p>
    </div>
    <section class="emergency-safety">
      <p>${isHi ? 'आपातकालीन सहायता:' : 'Emergency Helpline:'} UP 112 (Police) | 1090 (Women Power Line)</p>
    </section>
    <section class="deeplink-cta">
      <a href="kaamsaathi://request?category=${encodeURIComponent(params.category)}&district=${encodeURIComponent(params.district)}" class="btn-primary">
        ${isHi ? 'ऐप में सेवा बुक करें' : 'Book Service in App'}
      </a>
    </section>
  </main>
</body>
</html>`;
}
