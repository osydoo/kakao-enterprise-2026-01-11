import { test, expect } from '@playwright/test';
import { routes, ui } from './utils/selectors';
import {
  goToBoard,
  goToBoardCreate,
  fillBoardForm,
  submitBoardForm,
  clickMoreButton,
  clickMoreEdit,
} from './utils/helpers';

test.describe.skip('게시글 등록 및 수정 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await goToBoard(page);
  });

  test('TC-6-1: 게시글 등록 페이지 기본 표시', async ({ page }) => {
    // 등록 버튼 클릭하여 등록 페이지로 이동
    await goToBoardCreate(page);

    // 제목 입력 필드 확인
    const formTitle = ui.formTitle(page);
    await expect(formTitle).toBeVisible();

    // 내용 입력 필드 확인
    const formContent = ui.formContent(page);
    await expect(formContent).toBeVisible();

    // 등록하기 버튼 확인
    const formSubmit = ui.formSubmit(page);
    await expect(formSubmit).toBeVisible();
  });

  test('TC-6-2: 게시글 등록 - 유효성 검사 (제목 빈 값)', async ({ page }) => {
    // 등록 페이지로 이동
    await goToBoardCreate(page);

    // 제목은 비워두고 내용만 입력
    await fillBoardForm(page, '', '테스트 내용입니다.');

    // 등록하기 버튼 클릭
    await submitBoardForm(page);

    // 유효성 검사 에러 메시지가 표시되는지 확인
    const formError = ui.formError(page);
    const errorVisible = await formError.isVisible().catch(() => false);

    // 에러 메시지가 표시되어야 함
    expect(errorVisible).toBe(true);

    if (errorVisible) {
      const errorText = await formError.textContent();
      expect(errorText).toBeTruthy();
    }

    // 페이지가 이동하지 않았는지 확인
    await expect(page).toHaveURL(routes.boardCreate);
  });

  test('TC-6-3: 게시글 등록 - 유효성 검사 (내용 빈 값)', async ({ page }) => {
    // 등록 페이지로 이동
    await goToBoardCreate(page);

    // 제목만 입력하고 내용은 비워둠
    await fillBoardForm(page, '테스트 제목', '');

    // 등록하기 버튼 클릭
    await submitBoardForm(page);

    // 유효성 검사 에러 메시지가 표시되는지 확인
    const formError = ui.formError(page);
    const errorVisible = await formError.isVisible().catch(() => false);

    // 에러 메시지가 표시되어야 함
    expect(errorVisible).toBe(true);

    if (errorVisible) {
      const errorText = await formError.textContent();
      expect(errorText).toBeTruthy();
    }

    // 페이지가 이동하지 않았는지 확인
    await expect(page).toHaveURL(routes.boardCreate);
  });

  test('TC-6-4: 게시글 등록 - 유효성 검사 (모두 빈 값)', async ({ page }) => {
    // 등록 페이지로 이동
    await goToBoardCreate(page);

    // 제목과 내용을 모두 비워둠
    await fillBoardForm(page, '', '');

    // 등록하기 버튼 클릭
    await submitBoardForm(page);

    // 유효성 검사 에러 메시지가 표시되는지 확인
    const formError = ui.formError(page);
    const errorVisible = await formError.isVisible().catch(() => false);

    // 에러 메시지가 표시되어야 함
    expect(errorVisible).toBe(true);

    if (errorVisible) {
      const errorText = await formError.textContent();
      expect(errorText).toBeTruthy();
    }

    // 페이지가 이동하지 않았는지 확인
    await expect(page).toHaveURL(routes.boardCreate);
  });

  test('TC-6-5: 게시글 등록 성공', async ({ page }) => {
    // 등록 페이지로 이동
    await goToBoardCreate(page);

    // 제목과 내용 입력
    const testTitle = `테스트 게시글 ${Date.now()}`;
    const testContent = '테스트 내용입니다.';

    await fillBoardForm(page, testTitle, testContent);

    // 등록하기 버튼 클릭
    await submitBoardForm(page);

    // 서비스 게시판 페이지로 이동했는지 확인
    await expect(page).toHaveURL(routes.board);

    // 등록한 게시글이 목록에 표시되는지 확인
    const boardTitles = ui.boardTitle(page);
    const titlesText = await boardTitles.allTextContents();

    expect(titlesText).toContain(testTitle);

    // 등록한 게시글의 제목과 내용이 올바른지 확인 (상세 페이지에서)
    const titleIndex = titlesText.indexOf(testTitle);
    if (titleIndex !== -1) {
      await boardTitles.nth(titleIndex).click();

      const detailTitle = ui.detailTitle(page);
      const detailContent = ui.detailContent(page);

      await expect(detailTitle).toContainText(testTitle);
      await expect(detailContent).toContainText(testContent);
    }
  });

  test('TC-6-6: 게시글 수정 페이지 기본 표시', async ({ page }) => {
    // 게시글이 있는지 확인
    const moreButtons = ui.boardMoreButton(page);
    const count = await moreButtons.count();

    if (count === 0) {
      test.skip();
      return;
    }

    // 더보기 버튼 클릭하여 수정 페이지로 이동
    await clickMoreButton(page, 0);
    await clickMoreEdit(page);

    // 페이지 타이틀에 "게시글 수정"이 표시되는지 확인 (role/name 기반)
    await expect(page.getByRole('heading', { name: /게시글\s*수정/ })).toBeVisible();

    // 기존 게시글 제목이 입력 필드에 표시되는지 확인
    const formTitle = ui.formTitle(page);
    await expect(formTitle).toBeVisible();

    const titleValue = await formTitle.inputValue();
    expect(titleValue).toBeTruthy();

    // 기존 게시글 내용이 입력 필드에 표시되는지 확인
    const formContent = ui.formContent(page);
    await expect(formContent).toBeVisible();

    const contentValue = await formContent.inputValue();
    expect(contentValue).toBeTruthy();

    // 등록하기 버튼이 표시되는지 확인
    const formSubmit = ui.formSubmit(page);
    await expect(formSubmit).toBeVisible();
  });

  test('TC-6-7: 게시글 수정 성공', async ({ page }) => {
    // 게시글이 있는지 확인
    const moreButtons = ui.boardMoreButton(page);
    const count = await moreButtons.count();

    if (count === 0) {
      test.skip();
      return;
    }

    // 수정할 게시글의 원래 제목 기록
    const boardTitles = ui.boardTitle(page);
    const originalTitle = await boardTitles.nth(0).textContent();

    // 더보기 버튼 클릭하여 수정 페이지로 이동
    await clickMoreButton(page, 0);
    await clickMoreEdit(page);

    // 제목 또는 내용 수정
    const updatedTitle = `수정된 제목 ${Date.now()}`;
    const updatedContent = '수정된 내용입니다.';

    await fillBoardForm(page, updatedTitle, updatedContent);

    // 등록하기 버튼 클릭
    await submitBoardForm(page);

    // 서비스 게시판 페이지로 이동했는지 확인
    await expect(page).toHaveURL(routes.board);

    // 수정한 내용이 반영되어 있는지 확인
    const boardTitlesAfter = ui.boardTitle(page);
    const titlesText = await boardTitlesAfter.allTextContents();

    expect(titlesText).toContain(updatedTitle);
    expect(titlesText).not.toContain(originalTitle);

    // 게시글 상세 페이지에서도 수정된 내용이 표시되는지 확인
    const titleIndex = titlesText.indexOf(updatedTitle);
    if (titleIndex !== -1) {
      await boardTitlesAfter.nth(titleIndex).click();

      const detailTitle = ui.detailTitle(page);
      const detailContent = ui.detailContent(page);

      await expect(detailTitle).toContainText(updatedTitle);
      await expect(detailContent).toContainText(updatedContent);
    }
  });

  test('TC-6-8: 게시글 수정 - 유효성 검사', async ({ page }) => {
    // 게시글이 있는지 확인
    const moreButtons = ui.boardMoreButton(page);
    const count = await moreButtons.count();

    if (count === 0) {
      test.skip();
      return;
    }

    // 더보기 버튼 클릭하여 수정 페이지로 이동
    await clickMoreButton(page, 0);
    await clickMoreEdit(page);

    // 제목을 모두 지움
    await fillBoardForm(page, '', '내용은 유지');

    // 등록하기 버튼 클릭
    await submitBoardForm(page);

    // 유효성 검사 에러 메시지가 표시되는지 확인
    const formError = ui.formError(page);
    const errorVisible = await formError.isVisible().catch(() => false);

    expect(errorVisible).toBe(true);

    // 내용을 모두 지움
    await fillBoardForm(page, '제목은 유지', '');

    // 등록하기 버튼 클릭
    await submitBoardForm(page);

    // 유효성 검사 에러 메시지가 표시되는지 확인
    const errorVisibleAfter = await formError.isVisible().catch(() => false);
    expect(errorVisibleAfter).toBe(true);
  });
});
