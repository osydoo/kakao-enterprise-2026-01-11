import { test, expect } from '@playwright/test';
import { routes, ui } from './utils/selectors';
import { goToBoard, clickBoardTitle, clickMoreEdit, clickMoreDelete, confirmDelete } from './utils/helpers';

test.describe.skip('게시글 상세 페이지 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await goToBoard(page);
  });

  test('TC-5-1: 게시글 상세 페이지 기본 표시', async ({ page }) => {
    // 게시글이 있는지 확인
    const boardTitles = ui.boardTitle(page);
    const count = await boardTitles.count();

    if (count === 0) {
      test.skip();
      return;
    }

    // 게시글 제목 클릭하여 상세 페이지로 이동
    await clickBoardTitle(page, 0);

    // 게시글 타이틀이 표시되는지 확인
    const detailTitle = ui.detailTitle(page);
    await expect(detailTitle).toBeVisible();

    // 게시글 내용이 표시되는지 확인
    const detailContent = ui.detailContent(page);
    await expect(detailContent).toBeVisible();

    // 목록 버튼이 표시되는지 확인
    const listButton = ui.detailListButton(page);
    await expect(listButton).toBeVisible();

    // 우측 상단 더보기 버튼이 표시되는지 확인
    const moreButton = ui.detailMoreButton(page);
    await expect(moreButton).toBeVisible();
  });

  test('TC-5-2: 목록 버튼 클릭하여 게시판으로 이동', async ({ page }) => {
    // 게시글이 있는지 확인
    const boardTitles = ui.boardTitle(page);
    const count = await boardTitles.count();

    if (count === 0) {
      test.skip();
      return;
    }

    // 게시글 상세 페이지로 이동
    await clickBoardTitle(page, 0);

    // 목록 버튼 클릭
    const listButton = ui.detailListButton(page);
    await listButton.click();

    // 서비스 게시판 페이지로 이동했는지 확인
    await expect(page).toHaveURL(routes.board);
  });

  test('TC-5-3: 상세 페이지에서 더보기 버튼 동작', async ({ page }) => {
    // 게시글이 있는지 확인
    const boardTitles = ui.boardTitle(page);
    const count = await boardTitles.count();

    if (count === 0) {
      test.skip();
      return;
    }

    // 게시글 상세 페이지로 이동
    await clickBoardTitle(page, 0);

    // 우측 상단 더보기 버튼 클릭
    const moreButton = ui.detailMoreButton(page);
    await moreButton.click();
    await page.waitForTimeout(200);

    // 드롭다운 메뉴가 노출되는지 확인
    const dropdown = ui.moreDropdown(page);
    await expect(dropdown).toBeVisible();

    // 수정, 삭제 옵션이 표시되는지 확인
    const editOption = ui.moreEdit(page);
    const deleteOption = ui.moreDelete(page);

    await expect(editOption).toBeVisible();
    await expect(deleteOption).toBeVisible();
  });

  test('TC-5-4: 상세 페이지에서 수정 페이지 이동', async ({ page }) => {
    // 게시글이 있는지 확인
    const boardTitles = ui.boardTitle(page);
    const count = await boardTitles.count();

    if (count === 0) {
      test.skip();
      return;
    }

    // 게시글 상세 페이지로 이동
    await clickBoardTitle(page, 0);

    // 우측 상단 더보기 버튼 클릭
    const moreButton = ui.detailMoreButton(page);
    await moreButton.click();
    await page.waitForTimeout(200);

    // 수정 옵션 클릭
    await clickMoreEdit(page);

    // 수정 페이지로 이동했는지 확인
    await expect(page).toHaveURL(/\/board\/\d+\/edit/);

    // 기존 게시글 제목과 내용이 입력 필드에 표시되는지 확인
    const formTitle = ui.formTitle(page);
    const formContent = ui.formContent(page);

    await expect(formTitle).toBeVisible();
    await expect(formContent).toBeVisible();

    const titleValue = await formTitle.inputValue();
    const contentValue = await formContent.inputValue();

    expect(titleValue).toBeTruthy();
    expect(contentValue).toBeTruthy();
  });

  test('TC-5-5: 상세 페이지에서 삭제 모달 표시', async ({ page }) => {
    // 게시글이 있는지 확인
    const boardTitles = ui.boardTitle(page);
    const count = await boardTitles.count();

    if (count === 0) {
      test.skip();
      return;
    }

    // 게시글 상세 페이지로 이동
    await clickBoardTitle(page, 0);

    // 우측 상단 더보기 버튼 클릭
    const moreButton = ui.detailMoreButton(page);
    await moreButton.click();
    await page.waitForTimeout(200);

    // 삭제 옵션 클릭
    await clickMoreDelete(page);

    // 삭제 확인 모달이 표시되는지 확인
    const deleteModal = ui.deleteModal(page);
    await expect(deleteModal).toBeVisible();
  });

  test('TC-5-6: 상세 페이지에서 게시글 삭제 성공', async ({ page }) => {
    // 게시글이 있는지 확인
    const boardTitles = ui.boardTitle(page);
    const count = await boardTitles.count();

    if (count === 0) {
      test.skip();
      return;
    }

    // 삭제할 게시글의 제목 기록
    const titleToDelete = await boardTitles.nth(0).textContent();

    // 게시글 상세 페이지로 이동
    await clickBoardTitle(page, 0);

    // 우측 상단 더보기 버튼 클릭하여 삭제 모달 열기
    const moreButton = ui.detailMoreButton(page);
    await moreButton.click();
    await page.waitForTimeout(200);
    await clickMoreDelete(page);

    // 삭제 버튼 클릭
    await confirmDelete(page);

    // 삭제 요청이 성공했는지 확인 (게시판 페이지로 이동했는지 확인)
    await expect(page).toHaveURL(routes.board);

    // 삭제한 게시글이 목록에서 사라졌는지 확인
    const titlesAfterDelete = ui.boardTitle(page);
    const titlesAfterDeleteCount = await titlesAfterDelete.count();

    // 게시글 개수가 줄었는지 확인
    expect(titlesAfterDeleteCount).toBeLessThan(count);

    // 삭제한 제목이 목록에 없는지 확인
    if (titleToDelete) {
      const titlesText = await titlesAfterDelete.allTextContents();
      expect(titlesText).not.toContain(titleToDelete);
    }
  });
});
