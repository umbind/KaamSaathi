import test from 'node:test';
import assert from 'node:assert/strict';
import { KaamSaathiWebClient } from './index.js';

test('Web Client Localization & State Invariants', async (t) => {
  await t.test('Language toggle updates active language and correctly returns localized strings', () => {
    const client = new KaamSaathiWebClient();
    assert.strictEqual(client.getLanguage(), 'hi');
    assert.strictEqual(client.getLocalizedText('app.name'), 'कामसाथी');

    client.setLanguage('en');
    assert.strictEqual(client.getLanguage(), 'en');
    assert.strictEqual(client.getLocalizedText('app.name'), 'KaamSaathi');
  });
});
