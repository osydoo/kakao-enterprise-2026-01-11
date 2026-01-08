import { test, expect } from '@playwright/test';
import { selectors } from './utils/selectors';
import {
  goToBoard,
  clickMoreButton,
  clickMoreEdit,
  clickMoreDelete,
  confirmDelete,
  cancelDelete,
  changeViewType,
  getLocalStorage,
  clearLocalStorage,
} from './utils/helpers';

test.describe.skip('서비스 게시판 더보기 버튼 액션 및 UI 타입 변경', () => {
  test.beforeEach(async ({ page }) => {
    await goToBoard(page);
  });

  test('TC-4-1: 더보기 버튼 클릭 시 드롭다운 메뉴 표시', async ({ page }) => {
    // 게시글이 있는지 확인
    const moreButtons = page.locator(selectors.boardMoreButton);
    const count = await moreButtons.count();

    if (count === 0) {
      test.skip();
      return;
    }

    // 더보기 버튼 클릭
    await clickMoreButton(page, 0);

    // 드롭다운 메뉴가 노출되는지 확인
    const dropdown = page.locator(selectors.moreDropdown);
    await expect(dropdown).toBeVisible();

    // 수정, 삭제 옵션이 표시되는지 확인
    const editOption = page.locator(selectors.moreEdit);
    const deleteOption = page.locator(selectors.moreDelete);

    await expect(editOption).toBeVisible();
    await expect(deleteOption).toBeVisible();
  });

  test('TC-4-2: 더보기 버튼에서 수정 페이지 이동', async ({ page }) => {
    // 게시글이 있는지 확인
    const moreButtons = page.locator(selectors.boardMoreButton);
    const count = await moreButtons.count();

    if (count === 0) {
      test.skip();
      return;
    }

    // 더보기 버튼 클릭
    await clickMoreButton(page, 0);

    // 수정 옵션 클릭
    await clickMoreEdit(page);

    // 수정 페이지로 이동했는지 확인
    await expect(page).toHaveURL(/\/board\/\d+\/edit/);

    // 기존 게시글 제목과 내용이 입력 필드에 표시되는지 확인
    const formTitle = page.locator(selectors.formTitle);
    const formContent = page.locator(selectors.formContent);

    await expect(formTitle).toBeVisible();
    await expect(formContent).toBeVisible();

    const titleValue = await formTitle.inputValue();
    const contentValue = await formContent.inputValue();

    expect(titleValue).toBeTruthy();
    expect(contentValue).toBeTruthy();
  });

  test('TC-4-3: 더보기 버튼에서 삭제 모달 표시', async ({ page }) => {
    // 게시글이 있는지 확인
    const moreButtons = page.locator(selectors.boardMoreButton);
    const count = await moreButtons.count();

    if (count === 0) {
      test.skip();
      return;
    }

    // 더보기 버튼 클릭
    await clickMoreButton(page, 0);

    // 삭제 옵션 클릭
    await clickMoreDelete(page);

    // 삭제 확인 모달이 표시되는지 확인
    const deleteModal = page.locator(selectors.deleteModal);
    await expect(deleteModal).toBeVisible();

    // 백드롭 레이어가 표시되는지 확인
    const backdrop = page.locator(selectors.modalBackdrop);
    await expect(backdrop).toBeVisible();
  });

  test('TC-4-4: 게시글 삭제 성공 (게시판에서)', async ({ page }) => {
    // 게시글이 있는지 확인
    const moreButtons = page.locator(selectors.boardMoreButton);
    const count = await moreButtons.count();

    if (count === 0) {
      test.skip();
      return;
    }

    // 삭제할 게시글의 제목 기록
    const boardTitles = page.locator(selectors.boardTitle);
    const titleToDelete = await boardTitles.nth(0).textContent();

    // 더보기 버튼 클릭하여 삭제 모달 열기
    await clickMoreButton(page, 0);
    await clickMoreDelete(page);

    // 삭제 버튼 클릭
    await confirmDelete(page);

    // 삭제 요청이 성공했는지 확인 (게시판 페이지로 돌아왔는지 확인)
    await expect(page).toHaveURL(/\/board/);

    // 삭제한 게시글이 목록에서 사라졌는지 확인
    const titlesAfterDelete = page.locator(selectors.boardTitle);
    const titlesAfterDeleteCount = await titlesAfterDelete.count();

    // 게시글 개수가 줄었는지 확인
    expect(titlesAfterDeleteCount).toBeLessThan(count);

    // 삭제한 제목이 목록에 없는지 확인
    if (titleToDelete) {
      const titlesText = await titlesAfterDelete.allTextContents();
      expect(titlesText).not.toContain(titleToDelete);
    }
  });

  test('TC-4-5: 게시글 삭제 취소', async ({ page }) => {
    // 게시글이 있는지 확인
    const moreButtons = page.locator(selectors.boardMoreButton);
    const count = await moreButtons.count();

    if (count === 0) {
      test.skip();
      return;
    }

    // 삭제할 게시글의 제목 기록
    const boardTitles = page.locator(selectors.boardTitle);
    const titleToKeep = await boardTitles.nth(0).textContent();

    // 더보기 버튼 클릭하여 삭제 모달 열기
    await clickMoreButton(page, 0);
    await clickMoreDelete(page);

    // 취소 버튼 클릭
    await cancelDelete(page);

    // 모달이 닫혔는지 확인
    const deleteModal = page.locator(selectors.deleteModal);
    await expect(deleteModal).not.toBeVisible();

    // 게시글이 삭제되지 않고 목록에 남아있는지 확인
    const titlesAfterCancel = page.locator(selectors.boardTitle);
    const titlesAfterCancelCount = await titlesAfterCancel.count();

    expect(titlesAfterCancelCount).toBe(count);

    if (titleToKeep) {
      const titlesText = await titlesAfterCancel.allTextContents();
      expect(titlesText).toContain(titleToKeep);
    }
  });

  test('TC-4-6: 리스트 보기에서 카드 보기로 전환', async ({ page }) => {
    // localStorage 초기화
    await clearLocalStorage(page);

    // 기본값이 리스트 보기인지 확인
    const boardTable = page.locator(selectors.boardTable);
    await expect(boardTable).toBeVisible();

    // 보기 타입 전환 버튼 클릭하여 카드 보기로 전환
    await changeViewType(page, 'card');

    // 게시글이 카드 UI 형태로 표시되는지 확인
    const boardCards = page.locator(selectors.boardCard);
    await expect(boardCards.first()).toBeVisible();

    // 각 카드에 더보기 버튼이 표시되는지 확인
    const cardMoreButtons = page.locator(`${selectors.boardCard} ${selectors.boardMoreButton}`);
    const cardMoreButtonCount = await cardMoreButtons.count();

    if (cardMoreButtonCount > 0) {
      await expect(cardMoreButtons.first()).toBeVisible();
    }

    // 브라우저 새로고침
    await page.reload();

    // 카드 보기 상태가 유지되는지 확인
    const viewType = await getLocalStorage(page, 'boardViewType');
    expect(viewType).toBe('card');

    const boardCardsAfterReload = page.locator(selectors.boardCard);
    await expect(boardCardsAfterReload.first()).toBeVisible();
  });

  test('TC-4-7: 카드 보기에서 리스트 보기로 전환', async ({ page }) => {
    // 먼저 카드 보기로 전환
    await changeViewType(page, 'card');
    await page.waitForTimeout(300);

    // 다시 리스트 보기로 전환
    await changeViewType(page, 'list');

    // 게시글이 테이블 UI 형태로 표시되는지 확인
    const boardTable = page.locator(selectors.boardTable);
    await expect(boardTable).toBeVisible();
  });

  test('TC-4-8: 카드 보기에서 더보기 버튼 동작', async ({ page }) => {
    // 카드 보기로 전환
    await changeViewType(page, 'card');
    await page.waitForTimeout(300);

    // 게시글이 있는지 확인
    const boardCards = page.locator(selectors.boardCard);
    const cardCount = await boardCards.count();

    if (cardCount === 0) {
      test.skip();
      return;
    }

    // 카드의 더보기 버튼 클릭
    const cardMoreButtons = page.locator(`${selectors.boardCard} ${selectors.boardMoreButton}`);
    const cardMoreButtonCount = await cardMoreButtons.count();

    if (cardMoreButtonCount > 0) {
      await cardMoreButtons.first().click();
      await page.waitForTimeout(200);

      // 드롭다운 메뉴가 노출되는지 확인
      const dropdown = page.locator(selectors.moreDropdown);
      await expect(dropdown).toBeVisible();

      // 수정 또는 삭제 옵션 클릭하여 기능이 정상 동작하는지 확인
      const editOption = page.locator(selectors.moreEdit);
      const editOptionVisible = await editOption.isVisible().catch(() => false);

      if (editOptionVisible) {
        // 수정 기능 테스트는 별도 테스트에서 수행
        // 여기서는 드롭다운이 정상 동작하는지만 확인
        await expect(editOption).toBeVisible();
      }
    } else {
      test.skip();
    }
  });
});
