import { test, expect } from '@playwright/test';
import { routes, ui } from './utils/selectors';
import {
  goToHome,
  goToBoard,
  clickLnbMenu,
  searchBoard,
  clickBoardTitle,
  changeViewType,
  clickPaginationNext,
  goToBoardCreate,
  fillBoardForm,
  submitBoardForm,
  clickMoreButton,
  clickMoreEdit,
  clickMoreDelete,
  confirmDelete,
  cancelDelete,
} from './utils/helpers';

test.describe.skip('사용자 여정 테스트 (선택사항)', () => {
  test('TC-9-1: 신규 사용자의 첫 방문 및 탐색', async ({ page }) => {
    // 홈 페이지 접속
    await goToHome(page);

    // 기본 레이아웃 확인
    const gnb = ui.gnb(page);
    const lnb = ui.lnb(page);
    const contentArea = ui.contentArea(page);

    await expect(gnb).toBeVisible();
    await expect(lnb).toBeVisible();
    await expect(contentArea).toBeVisible();

    // 이미지가 2x2 배열로 표시되는지 확인
    const imageItems = ui.homeImageItem(page);
    const imageCount = await imageItems.count();
    expect(imageCount).toBe(4);

    // 서비스게시판 메뉴 클릭
    await clickLnbMenu(page, 'board');
    await expect(page).toHaveURL(routes.board);

    // 게시글 목록 확인
    const boardTable = ui.boardTable(page);
    await expect(boardTable).toBeVisible();

    // 게시글이 있으면 첫 번째 게시글 클릭
    const boardTitles = ui.boardTitle(page);
    const count = await boardTitles.count();

    if (count > 0) {
      await clickBoardTitle(page, 0);

      // 상세 페이지 확인
      const detailTitle = ui.detailTitle(page);
      await expect(detailTitle).toBeVisible();

      // 목록 버튼 클릭하여 게시판으로 돌아가기
      const listButton = ui.detailListButton(page);
      await listButton.click();
      await expect(page).toHaveURL(routes.board);
    }
  });

  test('TC-9-2: 일반 사용자의 게시글 검색 및 조회', async ({ page }) => {
    // 서비스 게시판 접속
    await goToBoard(page);

    // 검색어 입력하고 엔터 키 누르기
    await searchBoard(page, '테스트', 'enter');

    // 검색 결과 확인
    const boardTitles = ui.boardTitle(page);
    const count = await boardTitles.count();

    if (count > 0) {
      // 검색 결과 중 하나 클릭하여 상세 페이지로 이동
      await clickBoardTitle(page, 0);

      // 게시글 내용 확인
      const detailContent = ui.detailContent(page);
      await expect(detailContent).toBeVisible();

      // 목록 버튼 클릭하여 게시판으로 돌아가기
      const listButton = ui.detailListButton(page);
      await listButton.click();
      await expect(page).toHaveURL(routes.board);

      // 페이징이 있으면 다음 페이지로 이동
      const pagination = ui.pagination(page);
      const paginationVisible = await pagination.isVisible().catch(() => false);

      if (paginationVisible) {
        const nextButton = ui.paginationNext(page);
        const nextButtonVisible = await nextButton.isVisible().catch(() => false);

        if (nextButtonVisible) {
          await clickPaginationNext(page);
        }
      }

      // 카드 보기로 전환
      await changeViewType(page, 'card');

      // 카드 형태로 게시글이 표시되는지 확인
      const boardCards = ui.boardCard(page);
      await expect(boardCards.first()).toBeVisible();
    }
  });

  test('TC-9-3: 콘텐츠 작성자의 게시글 작성 및 관리', async ({ page }) => {
    // 서비스 게시판 접속
    await goToBoard(page);

    // 등록 버튼 클릭하여 게시글 등록 페이지로 이동
    await goToBoardCreate(page);

    // 제목과 내용 입력
    const testTitle = `작성 테스트 ${Date.now()}`;
    const testContent = '게시글 작성 테스트 내용입니다.';

    await fillBoardForm(page, testTitle, testContent);

    // 등록하기 버튼 클릭
    await submitBoardForm(page);

    // 게시판으로 이동하고 등록한 게시글이 목록에 표시되는지 확인
    await expect(page).toHaveURL(routes.board);

    const boardTitles = ui.boardTitle(page);
    const titlesText = await boardTitles.allTextContents();
    expect(titlesText).toContain(testTitle);

    // 등록한 게시글의 더보기 버튼 클릭
    const titleIndex = titlesText.indexOf(testTitle);
    if (titleIndex !== -1) {
      await clickMoreButton(page, titleIndex);

      // 수정 옵션 선택하여 수정 페이지로 이동
      await clickMoreEdit(page);

      // 내용 수정
      const updatedContent = '수정된 내용입니다.';
      await fillBoardForm(page, testTitle, updatedContent);

      // 등록하기 버튼 클릭
      await submitBoardForm(page);

      // 수정된 내용이 반영되었는지 확인
      await expect(page).toHaveURL(routes.board);

      // 다시 더보기 버튼 클릭하여 삭제
      const titlesAfterUpdate = ui.boardTitle(page);
      const titlesAfterUpdateText = await titlesAfterUpdate.allTextContents();
      const updatedTitleIndex = titlesAfterUpdateText.indexOf(testTitle);

      if (updatedTitleIndex !== -1) {
        await clickMoreButton(page, updatedTitleIndex);
        await clickMoreDelete(page);

        // 삭제 모달에서 삭제 버튼 클릭
        await confirmDelete(page);

        // 게시글이 삭제되었는지 확인
        await expect(page).toHaveURL(routes.board);

        const titlesAfterDelete = ui.boardTitle(page);
        const titlesAfterDeleteText = await titlesAfterDelete.allTextContents();
        expect(titlesAfterDeleteText).not.toContain(testTitle);
      }
    }
  });

  test('TC-9-4: 고급 사용자의 복합 기능 사용', async ({ page }) => {
    // 홈 페이지 접속
    await goToHome(page);

    // 카드 보기로 전환
    await changeViewType(page, 'card');

    // 서비스게시판 메뉴 클릭
    await clickLnbMenu(page, 'board');
    await expect(page).toHaveURL(routes.board);

    // 검색어 입력하여 게시글 검색
    await searchBoard(page, '테스트', 'enter');

    // 검색 결과 중 하나 클릭하여 상세 페이지로 이동
    const boardTitles = ui.boardTitle(page);
    const count = await boardTitles.count();

    if (count > 0) {
      await clickBoardTitle(page, 0);

      // 상세 페이지에서 더보기 버튼 클릭
      const moreButton = ui.detailMoreButton(page);
      await moreButton.click();
      await page.waitForTimeout(200);

      // 삭제 옵션 선택하여 삭제 모달 열기
      await clickMoreDelete(page);

      // 취소 버튼 클릭하여 모달 닫기
      await cancelDelete(page);

      // 목록 버튼 클릭하여 게시판으로 돌아가기
      const listButton = ui.detailListButton(page);
      await listButton.click();
      await expect(page).toHaveURL(routes.board);

      // 페이징을 통해 여러 페이지 탐색
      const pagination = ui.pagination(page);
      const paginationVisible = await pagination.isVisible().catch(() => false);

      if (paginationVisible) {
        const nextButton = ui.paginationNext(page);
        const nextButtonVisible = await nextButton.isVisible().catch(() => false);

        if (nextButtonVisible) {
          await clickPaginationNext(page);
        }
      }

      // 게시글의 더보기 버튼 클릭하여 드롭다운 열기
      const moreButtons = ui.boardMoreButton(page);
      const moreButtonCount = await moreButtons.count();

      if (moreButtonCount > 0) {
        await clickMoreButton(page, 0);

        // 삭제 옵션 선택하여 삭제 모달 열기 (중첩 모달)
        await clickMoreDelete(page);

        // 삭제 모달의 취소 버튼 클릭
        await cancelDelete(page);

        // 드롭다운만 남아있는지 확인 (FILO 방식)
        const dropdown = ui.moreDropdown(page);
        await expect(dropdown).toBeVisible();

        // 드롭다운도 닫기
        await page.keyboard.press('Escape');
        await expect(dropdown).not.toBeVisible();
      }
    }
  });
});
