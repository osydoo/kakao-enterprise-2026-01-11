import { test, expect } from '@playwright/test';
import { routes, ui } from './utils/selectors';
import {
  goToHome,
  goToBoard,
  clickLnbMenu,
  expectActiveMenu,
  clickBoardTitle,
  changeViewType,
  getLocalStorage,
  clearLocalStorage,
} from './utils/helpers';

test.describe('기본 페이지 및 레이아웃 구성', () => {
  test('TC-1-1: 기본 레이아웃 요소 표시 확인', async ({ page }) => {
    // 홈 페이지 접속
    await goToHome(page);

    // GNB 확인
    const gnb = ui.gnb(page);
    await expect(gnb).toBeVisible();

    // LNB 확인
    const lnb = ui.lnb(page);
    await expect(lnb).toBeVisible();

    // 콘텐츠 영역 확인
    const contentArea = ui.contentArea(page);
    await expect(contentArea).toBeVisible();
  });

  test('TC-1-2: LNB 메뉴 아이템 표시 및 활성화 상태', async ({ page }) => {
    // 홈 페이지 접속
    await goToHome(page);

    // LNB 메뉴 아이템 확인
    const homeMenu = ui.lnbHome(page);
    const boardMenu = ui.lnbBoard(page);

    await expect(homeMenu).toBeVisible();
    await expect(boardMenu).toBeVisible();

    // 홈 메뉴가 활성화 상태인지 확인
    await expectActiveMenu(page, 'home');

    // 서비스게시판 메뉴 클릭
    await clickLnbMenu(page, 'board');
    await expect(page).toHaveURL(routes.board);

    // 서비스게시판 메뉴가 활성화 상태인지 확인
    await expectActiveMenu(page, 'board');

    // 다시 홈 메뉴 클릭
    await clickLnbMenu(page, 'home');
    await expect(page).toHaveURL(routes.home);

    // 홈 메뉴가 활성화 상태인지 확인
    await expectActiveMenu(page, 'home');
  });

  test('TC-1-3: 게시글 상세 페이지에서 LNB 메뉴 활성화 상태', async ({ page }) => {
    // 서비스 게시판 접속
    await goToBoard(page);

    // 게시글이 있는지 확인
    const boardTitles = ui.boardTitle(page);
    const count = await boardTitles.count();

    if (count > 0) {
      // 첫 번째 게시글 제목 클릭하여 상세 페이지로 이동
      await clickBoardTitle(page, 0);

      // 서비스게시판 메뉴가 활성화 상태로 유지되는지 확인
      await expectActiveMenu(page, 'board');
    } else {
      test.skip();
    }
  });

  test('TC-1-4: 게시글 등록/수정 페이지에서 LNB 메뉴 활성화 상태', async ({ page }) => {
    // URL 이동으로 등록 페이지 진입 (UI 플로우 의존도 제거)
    await page.goto(routes.boardCreate);

    // 서비스게시판 메뉴가 활성화 상태로 유지되는지 확인
    await expectActiveMenu(page, 'board');

    // URL 이동으로 수정 페이지 진입 (데이터/더보기 메뉴 의존도 제거)
    await page.goto(routes.boardEdit(1));
    await expectActiveMenu(page, 'board');
  });

  test('TC-1-5: 콘텐츠 영역 스크롤 동작', async ({ page }) => {
    // 서비스 게시판 접속
    await goToBoard(page);

    // 콘텐츠 영역 확인
    const contentArea = ui.contentArea(page);
    await expect(contentArea).toBeVisible();

    // GNB와 LNB가 고정되어 있는지 확인 (position: fixed 또는 sticky)
    const gnb = ui.gnb(page);
    const lnb = ui.lnb(page);

    const gnbPosition = await gnb.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.position;
    });

    const lnbPosition = await lnb.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.position;
    });

    // GNB와 LNB가 fixed 또는 sticky인지 확인
    expect(['fixed', 'sticky']).toContain(gnbPosition);
    expect(['fixed', 'sticky']).toContain(lnbPosition);

    // 콘텐츠 영역이 스크롤 가능한지 확인
    const contentScrollable = await contentArea.evaluate((el) => {
      return el.scrollHeight > el.clientHeight;
    });

    // 게시글이 많으면 스크롤 가능해야 함
    if (contentScrollable) {
      // 스크롤 테스트
      await contentArea.evaluate((el) => {
        el.scrollTop = 100;
      });

      const scrollTop = await contentArea.evaluate((el) => el.scrollTop);
      expect(scrollTop).toBeGreaterThan(0);
    }
  });

  test('TC-1-6: GNB 우측 보기 타입 드롭다운 표시 및 저장', async ({ page }) => {
    await clearLocalStorage(page);
    await goToHome(page);

    // 드롭다운 토글이 보이는지 확인
    await expect(ui.viewTypeToggle(page)).toBeVisible();

    // 카드 보기로 변경
    await changeViewType(page, 'card');

    // localStorage에 저장되는지 확인
    const viewType = await getLocalStorage(page, 'homeViewType');
    expect(viewType).toBe('card');
  });
});
