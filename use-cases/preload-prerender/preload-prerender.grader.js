const { test, expect } = require('@playwright/test');
const path = require('path');

function runTests(filePath) {
  const demoUrl = `file://${filePath}`;
  const demoName = path.basename(filePath);

  test.describe(`Preload-Prerender Expectations: ${demoName}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(demoUrl);
    });

    // 1. Check for <script type="speculationrules">
    test('Should have <script type="speculationrules">', async ({ page }) => {
      const count = await page.locator('script[type="speculationrules"]').count();
      expect(count).toBeGreaterThan(0);
    });

    // 2. Speculation rules exclude /logout
    test('Speculation rules should exclude /logout', async ({ page }) => {
      const scripts = page.locator('script[type="speculationrules"]');
      const count = await scripts.count();
      expect(count).toBeGreaterThan(0);

      let excludesLogout = false;

      // Check all speculation rules scripts
      for (let i = 0; i < count; i++) {
        const content = await scripts.nth(i).innerHTML();
        if (!content) continue;

        try {
          const json = JSON.parse(content);
          if (hasLogoutExclusion(json)) {
            excludesLogout = true;
            break;
          }
        } catch (e) {
          console.error('Failed to parse speculation rules JSON:', e);
        }
      }

      expect(excludesLogout, 'Speculation rules do not exclude /logout').toBe(true);
    });

    // 3. No deprecated <link rel="prerender"> tag found
    test('Should NOT have deprecated <link rel="prerender"> tag', async ({ page }) => {
      const count = await page.locator('link[rel="prerender"]').count();
      expect(count).toBe(0);
    });
  });
}

// Helper to recursively search for "not" -> "href_matches": "/logout"
function hasLogoutExclusion(obj) {
  if (!obj || typeof obj !== 'object') return false;

  for (const key in obj) {
    const value = obj[key];

    if (key === 'not') {
      if (value && typeof value === 'object') {
        const matches = value.href_matches;
        if (matches === '/logout') return true;
        if (Array.isArray(matches) && matches.includes('/logout')) return true;
      }
    }

    if (hasLogoutExclusion(value)) return true;
  }
  return false;
}

const targetFile = process.env.TARGET_FILE;

if (targetFile) {
  runTests(path.resolve(targetFile));
} else {
  runTests(path.join(__dirname, 'golden-demo.html'));
  runTests(path.join(__dirname, 'negative-demo.html'), false);
}
