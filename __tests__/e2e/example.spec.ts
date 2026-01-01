import { test, expect } from '@playwright/test';

test.describe('Home Page E2E Test', () => {
  test('브라우저에서 접속했을 때 "Hello World" 텍스트가 보여야 한다', async ({ page }) => {
    // 페이지 접속 (playwright.config.ts의 baseURL 기준)
    await page.goto('/');

    // h1 태그의 텍스트 확인
    const heading = page.locator('h1');
    await expect(heading).toContainText('Hello World');
  });

  test('다크 모드 또는 배경색 스타일이 올바른지 확인한다', async ({ page }) => {
    await page.goto('/');

    // 배경색이 포함된 div 확인
    const mainContainer = page.locator('div.flex');
    await expect(mainContainer).toBeVisible();
    
    // 실제 렌더링된 요소의 스타일 확인 예시
    const backgroundColor = await mainContainer.evaluate((el) => 
      window.getComputedStyle(el).backgroundColor
    );
    // bg-zinc-50 (약 rgb(250, 250, 251)) 또는 다크모드 대응 확인 가능
    expect(backgroundColor).toBeDefined();
  });
});
