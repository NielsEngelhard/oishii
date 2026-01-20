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

test('screenshot my recipes with filter', async ({ page }) => {
  await page.goto('/recipes/my');
  await page.waitForLoadState('networkidle');
  // Click the filter icon button (the one next to search bar)
  const filterButton = page.locator('button').filter({ has: page.locator('svg.lucide-list-filter') });
  await filterButton.click({ force: true });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/recipes-filter.png', fullPage: true });
});
