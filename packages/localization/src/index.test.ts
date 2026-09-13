import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { t, dictionaries, transliteratedAliases } from './index.js';

describe('Localization Package Integrity', () => {
  test('Both Hindi and English dictionaries have required top-level keys', () => {
    const requiredSections = ['app', 'common', 'auth', 'customer', 'provider', 'categories', 'errors'];
    for (const section of requiredSections) {
      assert.ok(section in dictionaries.en, `English dictionary missing section: ${section}`);
      assert.ok(section in dictionaries.hi, `Hindi dictionary missing section: ${section}`);
    }
  });

  test('t() helper translates and formats parameters in Hindi and English', () => {
    const resEn = t('auth.resend_in', 'en', { seconds: 45 });
    assert.equal(resEn, 'Resend in 45s');

    const resHi = t('auth.resend_in', 'hi', { seconds: 45 });
    assert.equal(resHi, '45 सेकंड में दोबारा भेजें');
  });

  test('Transliterated aliases contain key UP service colloquialisms', () => {
    assert.ok(transliteratedAliases.electrician.includes('bijli mistri'));
    assert.ok(transliteratedAliases.plumber.includes('nal mistri'));
    assert.ok(transliteratedAliases.plumber.includes('paani tapak raha'));
    assert.ok(transliteratedAliases.appliance_repair.includes('fridge'));
  });
});
