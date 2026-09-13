import test from 'node:test';
import assert from 'node:assert/strict';
import { colors, touchTargets, typography } from './index.js';
test('Design Tokens Accessibility & Scale Invariants', async (t) => {
    await t.test('Minimum touch target must be at least 48dp for low-cost Android and elderly users', () => {
        assert.ok(touchTargets.minTouchTargetDp >= 48, 'minTouchTargetDp must be at least 48');
        assert.ok(touchTargets.buttonHeightDp >= 48, 'buttonHeightDp must be at least 48');
    });
    await t.test('Typography scale must support at least 200% font scaling', () => {
        assert.ok(typography.maxScaleFactor >= 2.0, 'maxScaleFactor must be at least 2.0');
    });
    await t.test('High-contrast brand colors must be defined', () => {
        assert.ok(colors.primary, 'Primary color must be defined');
        assert.ok(colors.secondary, 'Secondary color must be defined');
        assert.ok(colors.error, 'Error color must be defined');
        assert.ok(colors.textPrimary, 'Primary text color must be defined');
    });
});
//# sourceMappingURL=index.test.js.map