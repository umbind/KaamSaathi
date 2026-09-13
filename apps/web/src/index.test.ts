import test from 'node:test';
import assert from 'node:assert/strict';
import { KaamSaathiWebClient, generateStructuredData, generateLandingPageHtml } from './index.js';

test('Web Client Localization & State Invariants', async (t) => {
  await t.test('Language toggle updates active language and correctly returns localized strings', () => {
    const client = new KaamSaathiWebClient();
    assert.strictEqual(client.getLanguage(), 'hi');
    assert.strictEqual(client.getLocalizedText('app.name'), 'कामसाथी');

    client.setLanguage('en');
    assert.strictEqual(client.getLanguage(), 'en');
    assert.strictEqual(client.getLocalizedText('app.name'), 'KaamSaathi');
  });

  await t.test('SEO landing page generates valid schema.org JSON-LD and zero-guarantees disclaimer', () => {
    const data = generateStructuredData({
      district: 'Lucknow',
      category: 'electrician',
      language: 'hi',
    });

    assert.strictEqual(data['@context'], 'https://schema.org');
    assert.strictEqual(data['@type'], 'Service');
    assert.strictEqual(data.serviceType, 'electrician');
    const provider = data.provider as { name: string; areaServed: { name: string } };
    assert.strictEqual(provider.name, 'KaamSaathi electrician Services - Lucknow');
    assert.strictEqual(provider.areaServed.name, 'Lucknow');

    const htmlHi = generateLandingPageHtml({
      district: 'Lucknow',
      category: 'electrician',
      language: 'hi',
    });
    assert.ok(htmlHi.includes('मंच सेवा प्रदाता की व्यक्तिगत क्षमता या व्यक्तिगत सुरक्षा की गारंटी नहीं देता है'));
    assert.ok(htmlHi.includes('UP 112 (Police)'));
    assert.ok(htmlHi.includes('1090 (Women Power Line)'));
    assert.ok(htmlHi.includes('kaamsaathi://request?category=electrician&district=Lucknow'));
    assert.ok(htmlHi.includes('application/ld+json'));

    const htmlEn = generateLandingPageHtml({
      district: 'Varanasi',
      category: 'plumber',
      language: 'en',
    });
    assert.ok(htmlEn.includes('The platform does not guarantee provider competence or personal safety'));
    assert.ok(htmlEn.includes('kaamsaathi://request?category=plumber&district=Varanasi'));
  });
});
