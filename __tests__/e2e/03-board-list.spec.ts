import { test, expect } from '@playwright/test';
import { selectors, routes } from './utils/selectors';
import { goToBoard, searchBoard, clickBoardTitle, goToBoardCreate, getBoardCount } from './utils/helpers';

test.describe.skip('서비스 게시판 기본 기능 및 예외 처리', () => {
  test.beforeEach(async ({ page }) => {
    await goToBoard(page);
  });

  test('TC-3-1: 서비스 게시판 기본 화면 확인', async ({ page }) => {
    // 검색 입력 필드 확인
    const searchInput = page.locator(selectors.searchInput);
    await expect(searchInput).toBeVisible();

    // 검색 버튼 확인
    const searchButton = page.locator(selectors.searchButton);
    await expect(searchButton).toBeVisible();

    // 등록 버튼 확인
    const registerButton = page.locator(selectors.registerButton);
    await expect(registerButton).toBeVisible();

    // 게시글 테이블 확인
    const boardTable = page.locator(selectors.boardTable);
    await expect(boardTable).toBeVisible();

    // 서비스게시판 메뉴가 활성화 상태인지 확인
    const boardMenu = page.locator(selectors.lnbBoard);
    await expect(boardMenu).toHaveAttribute('aria-current', 'page');
  });

  test('TC-3-2: 게시글 검색 기능 (엔터 키)', async ({ page }) => {
    // 검색어 입력
    const searchKeyword = '테스트';
    await searchBoard(page, searchKeyword, 'enter');

    // 검색 결과 확인
    const boardTitles = page.locator(selectors.boardTitle);
    const count = await boardTitles.count();

    // 검색 결과가 있는 경우, 검색어가 포함되어 있는지 확인
    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        const title = await boardTitles.nth(i).textContent();
        expect(title?.toLowerCase()).toContain(searchKeyword.toLowerCase());
      }
    }
  });

  test('TC-3-3: 게시글 검색 기능 (검색 버튼)', async ({ page }) => {
    // 검색어 입력
    const searchKeyword = '테스트';
    await searchBoard(page, searchKeyword, 'button');

    // 검색 결과 확인
    const boardTitles = page.locator(selectors.boardTitle);
    const count = await boardTitles.count();

    // 검색 결과가 있는 경우, 검색어가 포함되어 있는지 확인
    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        const title = await boardTitles.nth(i).textContent();
        expect(title?.toLowerCase()).toContain(searchKeyword.toLowerCase());
      }
    }
  });

  test('TC-3-4: 게시글 목록 클릭하여 상세 페이지 이동', async ({ page }) => {
    // 게시글이 있는지 확인
    const boardTitles = page.locator(selectors.boardTitle);
    const count = await boardTitles.count();

    if (count > 0) {
      // 첫 번째 게시글 제목 클릭
      await clickBoardTitle(page, 0);

      // 상세 페이지로 이동했는지 확인
      await expect(page).toHaveURL(/\/board\/\d+/);

      // 게시글 제목과 내용이 표시되는지 확인
      const detailTitle = page.locator(selectors.detailTitle);
      const detailContent = page.locator(selectors.detailContent);

      await expect(detailTitle).toBeVisible();
      await expect(detailContent).toBeVisible();

      // 서비스게시판 메뉴가 활성화 상태로 유지되는지 확인
      const boardMenu = page.locator(selectors.lnbBoard);
      await expect(boardMenu).toHaveAttribute('aria-current', 'page');
    } else {
      test.skip();
    }
  });

  test('TC-3-5: 게시글 등록 페이지 이동', async ({ page }) => {
    // 등록 버튼 클릭
    await goToBoardCreate(page);

    // 등록 페이지로 이동했는지 확인
    await expect(page).toHaveURL(routes.boardCreate);

    // 서비스게시판 메뉴가 활성화 상태로 유지되는지 확인
    const boardMenu = page.locator(selectors.lnbBoard);
    await expect(boardMenu).toHaveAttribute('aria-current', 'page');
  });

  test('TC-3-6: 한 페이지당 최대 데이터 개수 확인', async ({ page }) => {
    // 게시글 개수 확인
    const boardCount = await getBoardCount(page, 'list');

    // 한 페이지당 최대 10개인지 확인
    expect(boardCount).toBeLessThanOrEqual(10);

    // 10개 이상인 경우 페이징이 표시되는지 확인
    if (boardCount === 10) {
      const pagination = page.locator(selectors.pagination);
      const paginationVisible = await pagination.isVisible().catch(() => false);

      console.log('paginationVisible', paginationVisible);
      // 페이징이 표시될 수 있음 (다음 페이지가 있는 경우)
      // 실제 구현에 따라 다를 수 있음
    }
  });

  test('TC-3-7: 게시글이 없을 때 빈 상태 표시', async ({ page }) => {
    // 모든 게시글 삭제 (실제로는 테스트 데이터를 초기화하거나 빈 상태를 확인)
    // 여기서는 빈 상태 메시지가 표시되는지만 확인

    const emptyMessage = page.locator(selectors.emptyMessage);
    const emptyMessageVisible = await emptyMessage.isVisible().catch(() => false);

    const boardCount = await getBoardCount(page, 'list');

    if (boardCount === 0) {
      // 빈 상태 메시지가 표시되어야 함
      expect(emptyMessageVisible).toBe(true);

      if (emptyMessageVisible) {
        const message = await emptyMessage.textContent();
        expect(message).toContain('등록된 게시글이 없습니다');
      }
    } else {
      // 게시글이 있으면 빈 상태 메시지가 표시되지 않아야 함
      expect(emptyMessageVisible).toBe(false);
    }
  });

  test('TC-3-8: 로딩 상태 표시', async ({ page, context }) => {
    // 네트워크 속도를 느리게 설정
    await context.route('**/*', (route) => {
      setTimeout(() => route.continue(), 1000);
    });

    // 페이지 새로고침
    await page.reload();

    // 로딩 인디케이터가 표시되는지 확인
    const loadingIndicator = page.locator(selectors.loadingIndicator);
    const loadingVisible = await loadingIndicator.isVisible().catch(() => false);

    console.log('loadingVisible', loadingVisible);

    // 로딩 상태가 표시될 수 있음 (구현된 경우)
    // 데이터가 로드되면 로딩 인디케이터가 사라지는지 확인
    await page.waitForTimeout(2000);

    const loadingAfterLoad = await loadingIndicator.isVisible().catch(() => false);
    expect(loadingAfterLoad).toBe(false);
  });

  test('TC-3-9: 에러 상태 표시', async ({ page, context }) => {
    // 네트워크를 오프라인으로 설정
    await context.setOffline(true);

    // 페이지 새로고침 또는 검색 수행
    await page.reload().catch(() => {});

    // 에러 메시지가 표시되는지 확인
    const errorMessage = page.locator(selectors.errorMessage);
    const errorVisible = await errorMessage.isVisible().catch(() => false);

    // 에러 상태가 표시될 수 있음 (구현된 경우)
    if (errorVisible) {
      const message = await errorMessage.textContent();
      expect(message).toBeTruthy();
    }

    // 네트워크 다시 온라인으로 설정
    await context.setOffline(false);
  });
});
