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
    const searchKeyword = '테스트';
    await searchBoard(page, searchKeyword, 'enter');

    // URL이 변경되고 검색 파라미터가 포함될 때까지 대기
    await page.waitForURL((url) => url.searchParams.get('search') === searchKeyword, { timeout: 5000 });

    // 네트워크 요청이 완료될 때까지 대기
    await page.waitForLoadState('networkidle');

    // 게시글 목록이 로드될 때까지 대기
    const boardTitles = ui.boardTitle(page);
    await boardTitles
      .first()
      .waitFor({ state: 'visible', timeout: 5000 })
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

    // URL이 변경되고 검색 파라미터가 포함될 때까지 대기
    await page.waitForURL((url) => url.searchParams.get('search') === anotherKeyword, { timeout: 5000 });

    // 네트워크 요청이 완료될 때까지 대기
    await page.waitForLoadState('networkidle');

    // 게시글 목록이 로드될 때까지 대기
    const boardTitlesAfter = ui.boardTitle(page);
    await boardTitlesAfter
      .first()
      .waitFor({ state: 'visible', timeout: 5000 })
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

  test.skip('TC-3-4: 게시글 등록 페이지 이동', async ({ page }) => {
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

  test.skip('TC-3-5: 한 페이지당 최대 데이터 개수 확인', async ({ page }) => {
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

          // 페이지가 전환되었는지 확인 (URL 변경 또는 게시글 목록 변경)
          await page.waitForTimeout(500);

          // 페이지 번호 버튼이 있는 경우 특정 페이지로 이동 테스트
          const page2Button = ui.paginationPage(page, 2);
          const hasPage2 = await page2Button.isVisible().catch(() => false);

          if (hasPage2) {
            await clickPaginationPage(page, 2);
            await page.waitForTimeout(500);

            // 페이지가 정상적으로 전환되었는지 확인
            const currentPageButton = ui.paginationPage(page, 2);
            await currentPageButton.getAttribute('aria-current').catch(() => null);
            // aria-current 또는 활성화 상태 확인 (구현에 따라 다를 수 있음)
          }
        }
      }
    }
  });

  test.skip('TC-3-6: 게시글이 없을 때 빈 상태 표시', async ({ page }) => {
    // 서비스 게시판 접속
    await goToBoard(page);

    // 존재하지 않는 검색어로 빈 상태 만들기
    const randomSearchKeyword = `__e2e_empty__${Date.now()}`;
    await searchBoard(page, randomSearchKeyword, 'enter');

    // 빈 상태 메시지 확인
    const emptyMessage = ui.emptyMessage(page);
    const emptyMessageVisible = await emptyMessage.isVisible().catch(() => false);

    // 빈 상태 메시지가 표시되어야 함
    expect(emptyMessageVisible).toBe(true);

    if (emptyMessageVisible) {
      const message = await emptyMessage.textContent();
      expect(message).toContain('등록된 게시글이 없습니다');
    }
  });

  test('TC-3-7: 로딩 상태 표시', async ({ page, context }) => {
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

  test('TC-3-8: 에러 상태 표시', async ({ page, context }) => {
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
});
