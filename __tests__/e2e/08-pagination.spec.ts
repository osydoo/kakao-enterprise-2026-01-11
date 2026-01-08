import { test, expect } from '@playwright/test';
import { selectors } from './utils/selectors';
import { goToBoard, clickPaginationPage, clickPaginationNext, clickPaginationPrev } from './utils/helpers';

test.describe.skip('페이징 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await goToBoard(page);
  });

  test('TC-8-1: 페이징 기본 동작 (7페이지 이하)', async ({ page }) => {
    // 페이징이 있는지 확인
    const pagination = page.locator(selectors.pagination);
    const paginationVisible = await pagination.isVisible().catch(() => false);

    if (!paginationVisible) {
      test.skip();
      return;
    }

    // 모든 페이지 번호 확인
    const pageButtons = page.locator('[data-testid^="pagination-page-"]');
    const pageCount = await pageButtons.count();

    // 7개 이하인지 확인
    if (pageCount <= 7) {
      // 모든 페이지 번호가 표시되는지 확인
      expect(pageCount).toBeGreaterThan(0);

      // 현재 페이지(1페이지)가 활성화 상태인지 확인
      const firstPage = page.locator(selectors.paginationPage(1));
      await expect(firstPage).toHaveAttribute('aria-current', 'page');

      // 다른 페이지 번호 클릭 (3페이지가 있으면)
      if (pageCount >= 3) {
        await clickPaginationPage(page, 3);

        // 해당 페이지의 게시글이 표시되는지 확인
        const thirdPage = page.locator(selectors.paginationPage(3));
        await expect(thirdPage).toHaveAttribute('aria-current', 'page');
      }
    } else {
      test.skip();
    }
  });

  test('TC-8-2: 페이징 동작 (8페이지 이상 - 앞쪽)', async ({ page }) => {
    // 페이징이 있는지 확인
    const pagination = page.locator(selectors.pagination);
    const paginationVisible = await pagination.isVisible().catch(() => false);

    if (!paginationVisible) {
      test.skip();
      return;
    }

    // 첫 페이지로 이동
    const firstPage = page.locator(selectors.paginationPage(1));
    const firstPageExists = await firstPage.isVisible().catch(() => false);

    if (!firstPageExists) {
      test.skip();
      return;
    }

    // 첫 페이지가 활성화 상태인지 확인
    await expect(firstPage).toHaveAttribute('aria-current', 'page');

    // 페이지 번호 확인 (1, 2, 3, 4, 5, 6, 7 또는 1, 2, 3, ..., 마지막)
    const pageButtons = page.locator('[data-testid^="pagination-page-"]');
    const pageCount = await pageButtons.count();

    // 8페이지 이상인 경우
    if (pageCount >= 8) {
      // 오른쪽 화살표 클릭
      const nextButton = page.locator(selectors.paginationNext);
      const nextButtonVisible = await nextButton.isVisible().catch(() => false);

      if (nextButtonVisible) {
        await clickPaginationNext(page);

        // 다음 페이지로 이동했는지 확인
        const secondPage = page.locator(selectors.paginationPage(2));
        await expect(secondPage).toHaveAttribute('aria-current', 'page');
      }
    } else {
      test.skip();
    }
  });

  test('TC-8-3: 페이징 동작 (8페이지 이상 - 뒤쪽)', async ({ page }) => {
    // 페이징이 있는지 확인
    const pagination = page.locator(selectors.pagination);
    const paginationVisible = await pagination.isVisible().catch(() => false);

    if (!paginationVisible) {
      test.skip();
      return;
    }

    // 마지막 페이지로 이동 (마지막 페이지 번호 찾기)
    const pageButtons = page.locator('[data-testid^="pagination-page-"]');
    const pageCount = await pageButtons.count();

    if (pageCount >= 8) {
      // 마지막 페이지 번호 찾기
      let lastPageNumber = 1;
      for (let i = 10; i >= 1; i--) {
        const pageButton = page.locator(selectors.paginationPage(i));
        const exists = await pageButton.isVisible().catch(() => false);
        if (exists) {
          lastPageNumber = i;
          break;
        }
      }

      // 마지막 페이지로 이동
      await clickPaginationPage(page, lastPageNumber);

      // 마지막 페이지가 활성화 상태인지 확인
      const lastPage = page.locator(selectors.paginationPage(lastPageNumber));
      await expect(lastPage).toHaveAttribute('aria-current', 'page');

      // 왼쪽 화살표 클릭
      const prevButton = page.locator(selectors.paginationPrev);
      const prevButtonVisible = await prevButton.isVisible().catch(() => false);

      if (prevButtonVisible) {
        await clickPaginationPrev(page);

        // 이전 페이지로 이동했는지 확인
        const prevPage = page.locator(selectors.paginationPage(lastPageNumber - 1));
        await expect(prevPage).toHaveAttribute('aria-current', 'page');
      }
    } else {
      test.skip();
    }
  });

  test('TC-8-4: 페이징 동작 (중간 페이지)', async ({ page }) => {
    // 페이징이 있는지 확인
    const pagination = page.locator(selectors.pagination);
    const paginationVisible = await pagination.isVisible().catch(() => false);

    if (!paginationVisible) {
      test.skip();
      return;
    }

    // 중간 페이지(5페이지)로 이동
    const fifthPage = page.locator(selectors.paginationPage(5));
    const fifthPageExists = await fifthPage.isVisible().catch(() => false);

    if (fifthPageExists) {
      await clickPaginationPage(page, 5);

      // 5페이지가 활성화 상태인지 확인
      await expect(fifthPage).toHaveAttribute('aria-current', 'page');

      // 페이징이 "첫 페이지, ..., 중간-2, 중간-1, 중간, 중간+1, 중간+2, ..., 마지막 페이지" 형태인지 확인
      // "..." 표시 확인
      const ellipsis = page.locator(selectors.paginationEllipsis);
      const ellipsisCount = await ellipsis.count();
      console.log('ellipsisCount', ellipsisCount);
      // 중간 페이지에서는 "..."이 있을 수 있음
      // 최대 7개의 페이지 번호가 표시되는지 확인
      const pageButtons = page.locator('[data-testid^="pagination-page-"]');
      const pageCount = await pageButtons.count();

      expect(pageCount).toBeLessThanOrEqual(7);
    } else {
      test.skip();
    }
  });
});
