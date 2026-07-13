const { chromium } = require('/opt/node22/lib/node_modules/playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));

  await page.goto('http://localhost:8137/index.html', { waitUntil: 'networkidle' });

  const chips = await page.$$eval('#quickAddList .chip', els => els.length);
  console.log('quick-add chips:', chips);

  await page.click('#quickAddList .chip:first-child');
  await page.waitForTimeout(300);
  let cals = await page.textContent('#totalCalories');
  let logCount = await page.$$eval('#logList .log-item', e => e.length);
  console.log('after quick-add: calories=%s logItems=%s', cals, logCount);

  await page.selectOption('#categorySelect', { index: 1 });
  await page.waitForTimeout(100);
  const foodOpts = await page.$$eval('#foodSelect option', e => e.length);
  await page.selectOption('#foodSelect', { index: 1 });
  await page.waitForTimeout(100);
  const formVisible = await page.isVisible('#addForm');
  await page.click('#addFoodBtn');
  await page.waitForTimeout(200);
  logCount = await page.$$eval('#logList .log-item', e => e.length);
  console.log('picker: foodOpts=%s formVisible=%s logItems=%s', foodOpts, formVisible, logCount);

  await page.fill('#searchInput', 'chick');
  await page.waitForTimeout(200);
  const results = await page.$$eval('#searchResults .result-item', e => e.length);
  await page.click('#searchResults .result-item:first-child');
  await page.waitForTimeout(200);
  logCount = await page.$$eval('#logList .log-item', e => e.length);
  console.log('search: results=%s logItems=%s', results, logCount);

  await page.click('#logList .log-item:first-child .remove-btn');
  await page.waitForTimeout(200);
  logCount = await page.$$eval('#logList .log-item', e => e.length);
  console.log('after remove: logItems=%s', logCount);

  await page.reload({ waitUntil: 'networkidle' });
  logCount = await page.$$eval('#logList .log-item', e => e.length);
  cals = await page.textContent('#totalCalories');
  console.log('after reload: logItems=%s calories=%s', logCount, cals);

  console.log('ERRORS:', errors.length ? JSON.stringify(errors, null, 2) : 'none');
  await browser.close();
  process.exit(errors.length ? 1 : 0);
})();
