import { test } from '@playwright/test';

test('screenshot create recipe page', async ({ page }) => {
  await page.goto('/recipe/create');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'screenshots/create-recipe.png', fullPage: true });
});

test('screenshot recipe details page', async ({ page }) => {
  // This will need an actual recipe ID - using a placeholder
  await page.goto('/recipe/1');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'screenshots/recipe-details.png', fullPage: true });
});
