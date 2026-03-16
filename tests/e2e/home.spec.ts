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

  test('keeps detail dialog open when clicking outside the modal', async ({
    page,
  }) => {
    await page.goto('/');

    await page
      .getByRole('link', { name: /查看細節/i })
      .first()
      .click();

    const dialogHeading = page.getByRole('heading', { name: /詳細資訊/i });

    await expect(dialogHeading).toBeVisible();

    await page.mouse.click(10, 10);

    await expect(dialogHeading).toBeVisible();
  });

  test('does not refetch jobs when search conditions are unchanged', async ({
    page,
  }) => {
    let jobsRequestCount = 0;

    page.on('response', (response) => {
      if (response.url().includes('/api/v1/jobs?')) {
        jobsRequestCount += 1;
      }
    });

    await page.goto('/?company_name=%E7%A7%91%E6%8A%80');

    await expect(
      page.getByRole('textbox', { name: /公司名稱/i }),
    ).toHaveValue('科技');

    const initialJobsRequestCount = jobsRequestCount;

    await page.getByRole('button', { name: /條件搜尋/i }).click();
    await page.waitForTimeout(300);

    expect(jobsRequestCount).toBe(initialJobsRequestCount);
  });
});
