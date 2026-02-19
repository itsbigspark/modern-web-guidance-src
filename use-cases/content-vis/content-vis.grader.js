const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

function runTests(filePath, expectSuccess = true) {
  const demoUrl = `file://${filePath}`;
  const demoName = path.basename(filePath);

  test.describe(`content-visibility Expectations: ${demoName}`, () => {

    // --- Static Content Assertions ---
    test(`Should ${expectSuccess ? '' : 'NOT '}contain content-visibility: auto`, async () => {
      const html = fs.readFileSync(filePath, 'utf-8');
      if (expectSuccess) {
        expect(html).toContain('content-visibility: auto');
      } else {
        expect(html).not.toContain('content-visibility: auto');
      }
    });

    test(`Should ${expectSuccess ? '' : 'NOT '}contain contain-intrinsic-size`, async () => {
      const html = fs.readFileSync(filePath, 'utf-8');
      if (expectSuccess) {
        expect(html).toContain('contain-intrinsic-size:');
      } else {
        expect(html).not.toContain('contain-intrinsic-size:');
      }
    });

    // --- Functional Browser Assertions ---
    test.beforeEach(async ({ page }) => {
      await page.goto(demoUrl);
      // Wait for the cards to be rendered (the demo has a 500ms delay)
      await page.waitForSelector('.card');
    });

    test(`Cards below the fold should ${expectSuccess ? '' : 'NOT '}have content-visibility: auto`, async ({ page }) => {
      const cards = page.locator('.card');

      // Check a card that is definitely off-screen (e.g., the 100th card)
      const offscreenCard = cards.nth(99);
      const cv = await offscreenCard.evaluate(el => getComputedStyle(el).contentVisibility);

      if (expectSuccess) {
        expect(cv).toBe('auto');
      } else {
        expect(cv).toBe('visible');
      }
    });

    test(`Cards should ${expectSuccess ? '' : 'NOT '}have contain-intrinsic-size set`, async ({ page }) => {
      const firstCard = page.locator('.card').first();
      const cis = await firstCard.evaluate(el => getComputedStyle(el).containIntrinsicSize);

      if (expectSuccess) {
        expect(cis).not.toBe('none');
        expect(cis).not.toBe('0px');
      } else {
        expect(cis).toBe('none');
      }
    });

    test(`Initial render should be ${expectSuccess ? 'FAST (<150ms)' : 'SLOW (>150ms)'}`, async ({ page }) => {
      const timerText = await page.innerText('#timer');
      const duration = parseInt(timerText.replace('ms', ''));

      console.log(`${demoName} Initial Render: ${duration}ms`);

      if (expectSuccess) {
        expect(duration).toBeLessThan(150);
      } else {
        expect(duration).toBeGreaterThan(150);
      }
    });

    test('Off-screen content remains in A11y tree', async ({ page }) => {
      const lastCardBadge = page.locator('.card').last().locator('.badge');
      // Should be findable regardless of CV setting
      const text = await lastCardBadge.textContent();
      expect(text).toContain('Item #500');
    });

    if (expectSuccess) {
      test('No console warnings for forced layout', async ({ page }) => {
        const warnings = [];
        page.on('console', msg => {
          if (msg.type() === 'warning' || msg.type() === 'error') {
            warnings.push(msg.text());
          }
        });

        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(500);

        const forcedLayoutWarnings = warnings.filter(w => w.includes('forced reflow') || w.includes('content-visibility'));
        expect(forcedLayoutWarnings).toHaveLength(0);
      });
    }
  });
}

const targetFile = process.env.TARGET_FILE;

if (targetFile) {
  runTests(path.resolve(targetFile));
} else {
  runTests(path.join(__dirname, 'golden-demo.html'));
  runTests(path.join(__dirname, 'negative-demo.html'), false);
}
