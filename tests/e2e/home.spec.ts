import { expect, test } from '@playwright/test';

test.describe('home page smoke test', () => {
  test('renders job list from server output', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: /適合前端工程師的好工作/i }),
    ).toBeVisible();

    await expect(
      page.getByRole('link', { name: /查看細節/i }).first(),
    ).toBeVisible();

    const content = await page.content();

    expect(content).toContain('查看細節');
  });

  test('opens and closes detail dialog', async ({ page }) => {
    await page.goto('/');

    await page
      .getByRole('link', { name: /查看細節/i })
      .first()
      .click();

    await expect(
      page.getByRole('heading', { name: /詳細資訊/i }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /關閉/i })).toBeVisible();

    await page.getByRole('button', { name: /關閉/i }).click();

    await expect(
      page.getByRole('heading', { name: /詳細資訊/i }),
    ).not.toBeVisible();
  });
});
