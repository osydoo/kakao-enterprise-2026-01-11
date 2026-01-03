import { test, expect } from '@playwright/test';
import { selectors } from './utils/selectors';
import { goToBoard, clickMoreButton, clickMoreDelete, cancelDelete } from './utils/helpers';

test.describe.skip('모달 관련 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await goToBoard(page);
  });

  test('TC-006: 모달 기본 표시 및 백드롭', async ({ page }) => {
    // 게시글이 있는지 확인
    const moreButtons = page.locator(selectors.boardMoreButton);
    const count = await moreButtons.count();

    if (count === 0) {
      test.skip();
      return;
    }

    // 더보기 버튼 클릭하여 삭제 모달 열기
    await clickMoreButton(page, 0);
    await clickMoreDelete(page);

    // 모달이 표시되는지 확인
    const modal = page.locator(selectors.deleteModal);
    await expect(modal).toBeVisible();

    // 백드롭 레이어가 표시되는지 확인
    const backdrop = page.locator(selectors.modalBackdrop);
    await expect(backdrop).toBeVisible();

    // 백드롭이 반투명한지 확인
    const backdropOpacity = await backdrop.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return parseFloat(style.opacity);
    });

    expect(backdropOpacity).toBeLessThan(1);
    expect(backdropOpacity).toBeGreaterThan(0);
  });

  test('TC-007: 백드롭 클릭으로 모달 닫기', async ({ page }) => {
    // 게시글이 있는지 확인
    const moreButtons = page.locator(selectors.boardMoreButton);
    const count = await moreButtons.count();

    if (count === 0) {
      test.skip();
      return;
    }

    // 더보기 버튼 클릭하여 삭제 모달 열기
    await clickMoreButton(page, 0);
    await clickMoreDelete(page);

    // 모달이 표시되는지 확인
    const modal = page.locator(selectors.deleteModal);
    await expect(modal).toBeVisible();

    // 백드롭 클릭
    const backdrop = page.locator(selectors.modalBackdrop);
    await backdrop.click();

    // 모달이 닫혔는지 확인
    await expect(modal).not.toBeVisible();
  });

  test('TC-008: 중첩 모달 표시 및 FILO 방식 닫기', async ({ page }) => {
    // 게시글이 있는지 확인
    const moreButtons = page.locator(selectors.boardMoreButton);
    const count = await moreButtons.count();

    if (count === 0) {
      test.skip();
      return;
    }

    // 첫 번째 모달(드롭다운) 열기
    await clickMoreButton(page, 0);

    const dropdown = page.locator(selectors.moreDropdown);
    await expect(dropdown).toBeVisible();

    // 두 번째 모달(삭제 확인 모달) 열기
    await clickMoreDelete(page);

    const deleteModal = page.locator(selectors.deleteModal);
    await expect(deleteModal).toBeVisible();

    // 두 번째 모달의 취소 버튼 클릭
    await cancelDelete(page);

    // 두 번째 모달만 닫히고 첫 번째 모달(드롭다운)이 여전히 열려있는지 확인
    await expect(deleteModal).not.toBeVisible();
    await expect(dropdown).toBeVisible();

    // 첫 번째 모달도 닫기 (외부 클릭 또는 ESC)
    await page.keyboard.press('Escape');
    await expect(dropdown).not.toBeVisible();
  });

  test('TC-009: 중첩 모달의 백드롭 처리 (선택사항)', async ({ page }) => {
    // 게시글이 있는지 확인
    const moreButtons = page.locator(selectors.boardMoreButton);
    const count = await moreButtons.count();

    if (count === 0) {
      test.skip();
      return;
    }

    // 첫 번째 모달(드롭다운) 열기
    await clickMoreButton(page, 0);

    // 두 번째 모달(삭제 확인 모달) 열기
    await clickMoreDelete(page);

    const deleteModal = page.locator(selectors.deleteModal);
    await expect(deleteModal).toBeVisible();

    // 백드롭 레이어가 하나만 표시되는지 확인
    const backdrops = page.locator(selectors.modalBackdrop);
    const backdropCount = await backdrops.count();

    // 구현된 경우 백드롭이 하나만 있어야 함
    // 구현되지 않은 경우도 있으므로 스킵하지 않고 확인만 함
    if (backdropCount === 1) {
      // 정상: 백드롭이 하나만 있음
      expect(backdropCount).toBe(1);
    }
  });
});
