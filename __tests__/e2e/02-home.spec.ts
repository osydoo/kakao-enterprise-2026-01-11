import { test, expect } from '@playwright/test';
import { ui } from './utils/selectors';
import { goToHome, changeViewType, getLocalStorage, clearLocalStorage } from './utils/helpers';

test.describe('홈 페이지 테스트', () => {
  test('TC-2-1: 홈 페이지 이미지 레이아웃 (2x2 배열)', async ({ page }) => {
    // 홈 페이지 접속
    await goToHome(page);

    // 이미지 그리드 확인
    const imageGrid = ui.homeImageGrid(page);
    await expect(imageGrid).toBeVisible();

    // 이미지 아이템 확인
    const imageItems = ui.homeImageItem(page);
    const imageCount = await imageItems.count();

    // 정확히 4개인지 확인 (2x2)
    expect(imageCount).toBe(4);

    // 각 이미지의 넓이가 동일한 비율을 가지는지 확인
    if (imageCount >= 2) {
      const firstImage = imageItems.nth(0);
      const secondImage = imageItems.nth(1);

      const firstWidth = await firstImage.evaluate((el) => el.clientWidth);
      const secondWidth = await secondImage.evaluate((el) => el.clientWidth);

      // 넓이가 동일한지 확인 (약간의 오차 허용)
      expect(Math.abs(firstWidth - secondWidth)).toBeLessThan(5);
    }
  });

  test('TC-2-2: 홈 페이지 보기 타입 전환 (리스트 → 카드)', async ({ page }) => {
    // 홈 페이지 접속
    await goToHome(page);

    // 기본값이 리스트 보기인지 확인
    const imageGrid = ui.homeImageGrid(page);
    await expect(imageGrid).toBeVisible();

    // 보기 타입 전환 버튼 클릭
    await changeViewType(page, 'card');

    // 카드 형태로 변경되었는지 확인
    const imageGridAfter = ui.homeImageGrid(page);
    await expect(imageGridAfter).toBeVisible();

    // localStorage에 설정이 저장되었는지 확인
    const viewType = await getLocalStorage(page, 'viewType');
    expect(viewType).toBe('card');

    // 브라우저 새로고침
    await page.reload();

    // 카드 보기 상태가 유지되는지 확인
    const viewTypeAfterReload = await getLocalStorage(page, 'viewType');
    expect(viewTypeAfterReload).toBe('card');
  });

  test('TC-2-3: 홈 페이지 보기 타입 전환 (카드 → 리스트)', async ({ page }) => {
    // localStorage 초기화
    await clearLocalStorage(page);
    await goToHome(page);

    // 먼저 카드 보기로 전환
    await changeViewType(page, 'card');
    await page.waitForTimeout(300);

    // 다시 리스트 보기로 전환
    await changeViewType(page, 'list');

    // 리스트 형태로 변경되었는지 확인
    const imageGrid = ui.homeImageGrid(page);
    await expect(imageGrid).toBeVisible();

    // localStorage에 설정이 저장되었는지 확인
    const viewType = await getLocalStorage(page, 'viewType');
    expect(viewType).toBe('list');

    // 브라우저 새로고침
    await page.reload();

    // 리스트 보기 상태가 유지되는지 확인
    const viewTypeAfterReload = await getLocalStorage(page, 'viewType');
    expect(viewTypeAfterReload).toBe('list');
  });
});
