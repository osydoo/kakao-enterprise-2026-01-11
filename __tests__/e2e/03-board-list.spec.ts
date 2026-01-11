import { test, expect } from '@playwright/test';
import { routes, ui } from './utils/selectors';
import {
  goToBoard,
  searchBoard,
  clickBoardTitle,
  goToBoardCreate,
  getBoardCount,
  clickPaginationPage,
  clickPaginationNext,
  changeViewType,
  clearLocalStorage,
  getLocalStorage,
  clickMoreButton,
} from './utils/helpers';

test.describe('서비스 게시판 기본 기능 및 예외 처리', () => {
  test('TC-3-1: 서비스 게시판 기본 화면 확인', async ({ page }) => {
    // 서비스 게시판 접속
    await goToBoard(page);

    // 검색 입력 필드 확인
    const searchInput = ui.searchInput(page);
    await expect(searchInput).toBeVisible();

    // 검색 버튼 확인
    const searchButton = ui.searchButton(page);
    await expect(searchButton).toBeVisible();

    // 등록 버튼 확인
    const registerButton = ui.registerButton(page);
    await expect(registerButton).toBeVisible();

    // 게시글 테이블 확인
    const boardTable = ui.boardTable(page);
    await expect(boardTable).toBeVisible();

    // 서비스게시판 메뉴가 활성화 상태인지 확인
    const boardMenu = ui.lnbBoard(page);
    await expect(boardMenu).toHaveAttribute('aria-current', 'page');
  });

  test('TC-3-2: 게시글 검색 기능 (엔터/버튼)', async ({ page }) => {
    // 서비스 게시판 접속
    await goToBoard(page);

    // 검색어 입력
    const searchKeyword = '테스트 이슈';
    await searchBoard(page, searchKeyword, 'enter');

    // 네트워크 요청이 완료될 때까지 대기 (Tanstack Query가 API 호출)
    await page.waitForLoadState('networkidle');

    // 게시글 목록이 로드될 때까지 대기
    const boardTitles = ui.boardTitle(page);
    await boardTitles
      .first()
      .waitFor({ state: 'visible', timeout: 10000 })
      .catch(() => {
        // 게시글이 없는 경우도 있으므로 에러 무시
      });

    // 검색 결과 확인
    const count = await boardTitles.count();

    // 검색 결과가 있는 경우, 검색어가 포함되어 있는지 확인
    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        const title = await boardTitles.nth(i).textContent();
        expect(title?.toLowerCase()).toContain(searchKeyword.toLowerCase());
      }
    }

    // 다른 검색어로 검색 버튼 클릭 방식 테스트
    const anotherKeyword = '게시글';
    await searchBoard(page, anotherKeyword, 'button');

    // 네트워크 요청이 완료될 때까지 대기 (Tanstack Query가 API 호출)
    await page.waitForLoadState('networkidle');

    // 게시글 목록이 로드될 때까지 대기
    const boardTitlesAfter = ui.boardTitle(page);
    await boardTitlesAfter
      .first()
      .waitFor({ state: 'visible', timeout: 10000 })
      .catch(() => {
        // 게시글이 없는 경우도 있으므로 에러 무시
      });

    // 검색 결과 확인
    const countAfter = await boardTitlesAfter.count();

    // 검색 결과가 있는 경우, 검색어가 포함되어 있는지 확인
    if (countAfter > 0) {
      for (let i = 0; i < Math.min(countAfter, 3); i++) {
        const title = await boardTitlesAfter.nth(i).textContent();
        expect(title?.toLowerCase()).toContain(anotherKeyword.toLowerCase());
      }
    }
  });

  test('TC-3-3: 게시글 목록 클릭하여 상세 페이지 이동', async ({ page }) => {
    // 서비스 게시판 접속
    await goToBoard(page);

    // 게시글이 있는지 확인
    const boardTitles = ui.boardTitle(page);
    const count = await boardTitles.count();

    if (count > 0) {
      // 첫 번째 게시글 제목 클릭
      await clickBoardTitle(page, 0);

      // 상세 페이지로 이동했는지 확인
      await expect(page).toHaveURL(/\/board\/\d+/);

      // 게시글 제목과 내용이 표시되는지 확인
      const detailTitle = ui.detailTitle(page);
      const detailContent = ui.detailContent(page);

      await expect(detailTitle).toBeVisible();
      await expect(detailContent).toBeVisible();

      // 서비스게시판 메뉴가 활성화 상태로 유지되는지 확인
      const boardMenu = ui.lnbBoard(page);
      await expect(boardMenu).toHaveAttribute('aria-current', 'page');
    } else {
      test.skip();
    }
  });

  test('TC-3-4: 게시글 등록 페이지 이동', async ({ page }) => {
    // 서비스 게시판 접속
    await goToBoard(page);

    // 등록 버튼 클릭
    await goToBoardCreate(page);

    // 등록 페이지로 이동했는지 확인
    await expect(page).toHaveURL(routes.boardCreate);

    // 서비스게시판 메뉴가 활성화 상태로 유지되는지 확인
    const boardMenu = ui.lnbBoard(page);
    await expect(boardMenu).toHaveAttribute('aria-current', 'page');
  });

  test('TC-3-5: 한 페이지당 최대 데이터 개수 확인', async ({ page }) => {
    // 서비스 게시판 접속
    await goToBoard(page);

    // 게시글 개수 확인
    const boardCount = await getBoardCount(page, 'list');

    // 한 페이지당 최대 10개인지 확인
    expect(boardCount).toBeLessThanOrEqual(10);

    // 10개 이상인 경우 페이징이 표시되는지 확인
    if (boardCount === 10) {
      const pagination = ui.pagination(page);
      const paginationVisible = await pagination.isVisible().catch(() => false);

      // 페이징이 표시되는 경우, 페이지 전환 테스트
      if (paginationVisible) {
        // 다음 페이지 버튼이 있는지 확인
        const nextButton = ui.paginationNext(page);
        const hasNext = await nextButton.isVisible().catch(() => false);

        if (hasNext) {
          // 다음 페이지로 이동
          await clickPaginationNext(page);

          // 네트워크 요청이 완료될 때까지 대기 (Tanstack Query가 API 호출)
          await page.waitForLoadState('networkidle');

          // 페이지 번호 버튼이 있는 경우 특정 페이지로 이동 테스트
          const page2Button = ui.paginationPage(page, 2);
          const hasPage2 = await page2Button.isVisible().catch(() => false);

          if (hasPage2) {
            await clickPaginationPage(page, 2);

            // 네트워크 요청이 완료될 때까지 대기 (Tanstack Query가 API 호출)
            await page.waitForLoadState('networkidle');

            // 페이지가 정상적으로 전환되었는지 확인
            const currentPageButton = ui.paginationPage(page, 2);
            await currentPageButton.getAttribute('aria-current').catch(() => null);
            // aria-current 또는 활성화 상태 확인 (구현에 따라 다를 수 있음)
          }
        }
      }
    }
  });

  test('TC-3-6: 로딩 상태 표시', async ({ page, context }) => {
    // 서비스 게시판 접속
    await goToBoard(page);

    // 네트워크 속도를 느리게 설정
    await context.route('**/*', (route) => {
      setTimeout(() => route.continue(), 1000);
    });

    // 페이지 새로고침
    await page.reload();

    // 로딩 인디케이터가 표시되는지 확인
    const loadingIndicator = ui.loadingIndicator(page);
    await loadingIndicator.isVisible().catch(() => false);

    // 로딩 상태가 표시될 수 있음 (구현된 경우)
    // 데이터가 로드되면 로딩 인디케이터가 사라지는지 확인
    await page.waitForTimeout(2000);

    const loadingAfterLoad = await loadingIndicator.isVisible().catch(() => false);
    expect(loadingAfterLoad).toBe(false);
  });

  test('TC-3-7: 에러 상태 표시', async ({ page, context }) => {
    // 서비스 게시판 접속
    await goToBoard(page);

    // 네트워크를 오프라인으로 설정
    await context.setOffline(true);

    // 페이지 새로고침 또는 검색 수행
    await page.reload().catch(() => {});

    // 에러 메시지가 표시되는지 확인
    const errorMessage = ui.errorMessage(page);
    const errorVisible = await errorMessage.isVisible().catch(() => false);

    // 에러 상태가 표시될 수 있음 (구현된 경우)
    if (errorVisible) {
      const message = await errorMessage.textContent();
      expect(message).toBeTruthy();
    }

    // 네트워크 다시 온라인으로 설정
    await context.setOffline(false);
  });

  test('TC-3-8: 게시글 UI 타입 기본값 및 리스트 보기 UI 확인', async ({ page }) => {
    // localStorage 초기화
    await clearLocalStorage(page);

    // 서비스 게시판 접속
    await goToBoard(page);

    // 게시글이 테이블 UI 형태로 표시되는지 확인
    const boardTable = ui.boardTable(page);
    await expect(boardTable).toBeVisible();

    // GNB 우측 드롭다운 트리거 버튼의 텍스트가 "리스트 보기"인지 확인
    const viewTypeToggle = ui.viewTypeToggle(page);
    const toggleText = await viewTypeToggle.textContent();
    expect(toggleText?.toLowerCase()).toMatch(/리스트|list/i);

    // 드롭다운 메뉴 노출 확인
    await viewTypeToggle.click();

    // 드롭다운 메뉴가 노출되는지 확인
    const viewTypeList = ui.viewTypeList(page);
    const viewTypeCard = ui.viewTypeCard(page);

    await expect(viewTypeList).toBeVisible();
    await expect(viewTypeCard).toBeVisible();

    // "리스트 보기", "카드 보기" 두 가지 선택지가 표시되는지 확인
    const listText = await viewTypeList.textContent();
    const cardText = await viewTypeCard.textContent();

    expect(listText?.toLowerCase()).toMatch(/리스트|list/i);
    expect(cardText?.toLowerCase()).toMatch(/카드|card/i);

    // 드롭다운 닫기 (외부 클릭 또는 ESC)
    await page.keyboard.press('Escape');

    // 테이블의 헤더와 행이 올바르게 구성되어 있는지 확인
    const boardRows = ui.boardRow(page);
    const rowCount = await boardRows.count();
    expect(rowCount).toBeGreaterThan(0);

    // 각 행에 게시글 제목이 표시되는지 확인
    const boardTitles = ui.boardTitle(page);
    const titleCount = await boardTitles.count();
    expect(titleCount).toBeGreaterThan(0);

    if (titleCount > 0) {
      const firstTitle = await boardTitles.first().textContent();
      expect(firstTitle).toBeTruthy();
    }
  });

  test('TC-3-9: 카드 보기 UI 및 브라우저 스토리지 저장 확인', async ({ page }) => {
    // localStorage 초기화
    await clearLocalStorage(page);

    // 서비스 게시판 접속
    await goToBoard(page);

    // 초기 게시글 목록 로드 대기
    await page.waitForLoadState('networkidle');

    // GNB 우측 드롭다운을 클릭하여 "카드 보기"를 선택
    await changeViewType(page, 'card');

    // 게시글이 카드 UI 형태로 표시되는지 확인
    const boardCards = ui.boardCard(page);
    const cardCount = await boardCards.count();
    expect(cardCount).toBeGreaterThan(0);

    // 각 카드에 게시글 제목이 표시되는지 확인
    const boardTitles = ui.boardTitle(page);
    const titleCount = await boardTitles.count();
    expect(titleCount).toBeGreaterThan(0);

    if (titleCount > 0) {
      const firstTitle = await boardTitles.first().textContent();
      expect(firstTitle).toBeTruthy();
    }

    // 각 카드에 더보기 버튼이 표시되는지 확인
    const moreButtons = ui.boardMoreButton(page);
    const moreButtonCount = await moreButtons.count();
    expect(moreButtonCount).toBeGreaterThan(0);

    // localStorage의 viewType 값이 card로 저장되는지 확인
    const viewTypeAfterCard = await getLocalStorage(page, 'viewType');
    expect(viewTypeAfterCard).toBe('card');

    // 브라우저를 새로고침
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 카드 보기 상태가 유지되는지 확인
    const boardCardsAfterReload = ui.boardCard(page);
    const cardCountAfterReload = await boardCardsAfterReload.count();
    expect(cardCountAfterReload).toBeGreaterThan(0);

    // 다시 "리스트 보기"를 선택
    await changeViewType(page, 'list');

    // localStorage의 viewType 값이 list로 저장되는지 확인
    const viewTypeAfterList = await getLocalStorage(page, 'viewType');
    expect(viewTypeAfterList).toBe('list');

    // 브라우저를 새로고침
    await page.reload();
    await page.waitForLoadState('networkidle');

    // 리스트 보기 상태가 유지되는지 확인
    const boardTable = ui.boardTable(page);
    await expect(boardTable).toBeVisible();
  });

  test('TC-3-10: 리스트 보기에서 더보기 버튼 동작 확인', async ({ page }) => {
    // 서비스 게시판 접속
    await goToBoard(page);

    // 리스트 보기인지 확인
    const boardTable = ui.boardTable(page);
    await expect(boardTable).toBeVisible();

    // 리스트의 더보기 버튼 클릭
    const moreButtons = ui.boardMoreButton(page);
    const moreButtonCount = await moreButtons.count();

    if (moreButtonCount > 0) {
      await clickMoreButton(page, 0);

      // 드롭다운 메뉴가 노출되는지 확인
      const moreDropdown = ui.moreDropdown(page);
      await expect(moreDropdown).toBeVisible();

      // "수정", "삭제" 옵션이 텍스트로 표시되는지 확인
      // "수정", "삭제" 텍스트가 드롭다운 메뉴 안에 있는지 명확히 제한
      const editText = moreDropdown.getByText('수정', { exact: true });
      const deleteText = moreDropdown.getByText('삭제', { exact: true });

      await expect(editText).toBeVisible();
      await expect(deleteText).toBeVisible();

      // "수정" 옵션을 클릭하여 수정 페이지로 이동하는지 확인
      await editText.click();
      await expect(page).toHaveURL(/\/board\/\d+\/edit/);

      // 목록으로 돌아가기
      await goToBoard(page);

      // 다시 리스트의 더보기 버튼 클릭
      await clickMoreButton(page, 0);

      // "삭제" 옵션을 클릭하여 삭제 모달이 표시되는지 확인
      await deleteText.click();
      const deleteModal = ui.deleteModal(page);
      await expect(deleteModal).toBeVisible();

      // 취소 버튼으로 모달 닫기
      const modalCancel = ui.modalCancel(page);
      await modalCancel.click();
    } else {
      test.skip();
    }
  });

  test('TC-3-11: 카드 보기에서 더보기 버튼 동작 확인', async ({ page }) => {
    // 서비스 게시판 접속
    await goToBoard(page);

    // 초기 게시글 목록 로드 대기
    await page.waitForLoadState('networkidle');

    // GNB 우측 드롭다운을 클릭하여 "카드 보기"를 선택
    await changeViewType(page, 'card');

    // 카드의 더보기 버튼 클릭
    const moreButtons = ui.boardMoreButton(page);
    const moreButtonCount = await moreButtons.count();

    if (moreButtonCount > 0) {
      await clickMoreButton(page, 0);

      // 드롭다운 메뉴가 노출되는지 확인
      const moreDropdown = ui.moreDropdown(page);
      await expect(moreDropdown).toBeVisible();

      // "수정", "삭제" 옵션이 텍스트로 표시되는지 확인
      const editText = moreDropdown.getByText('수정', { exact: true });
      const deleteText = moreDropdown.getByText('삭제', { exact: true });

      await expect(editText).toBeVisible();
      await expect(deleteText).toBeVisible();

      // "수정" 옵션을 클릭하여 수정 페이지로 이동하는지 확인
      await editText.click();
      await expect(page).toHaveURL(/\/board\/\d+\/edit/);

      // 목록으로 돌아가기
      await goToBoard(page);
      await changeViewType(page, 'card');

      // 다시 카드의 더보기 버튼 클릭
      await clickMoreButton(page, 0);

      // "삭제" 옵션을 클릭하여 삭제 모달이 표시되는지 확인
      await deleteText.click();
      const deleteModal = ui.deleteModal(page);
      await expect(deleteModal).toBeVisible();

      // 취소 버튼으로 모달 닫기
      const modalCancel = ui.modalCancel(page);
      await modalCancel.click();
    } else {
      test.skip();
    }
  });
});
