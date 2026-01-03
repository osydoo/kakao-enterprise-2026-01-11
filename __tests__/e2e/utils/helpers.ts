import { Page, expect } from '@playwright/test';
import { selectors, routes } from './selectors';

/**
 * 공통 헬퍼 함수
 */

/**
 * 홈 페이지로 이동
 */
export async function goToHome(page: Page) {
  await page.goto(routes.home);
}

/**
 * 서비스 게시판으로 이동
 */
export async function goToBoard(page: Page) {
  await page.goto(routes.board);
}

/**
 * LNB 메뉴 클릭
 */
export async function clickLnbMenu(page: Page, menu: 'home' | 'board') {
  const menuSelector = menu === 'home' ? selectors.lnbHome : selectors.lnbBoard;
  await page.click(menuSelector);
}

/**
 * 검색 수행
 */
export async function searchBoard(page: Page, keyword: string, method: 'enter' | 'button' = 'enter') {
  await page.fill(selectors.searchInput, keyword);

  if (method === 'enter') {
    await page.press(selectors.searchInput, 'Enter');
  } else {
    await page.click(selectors.searchButton);
  }

  // 검색 결과 로딩 대기
  await page.waitForTimeout(500);
}

/**
 * 게시글 제목 클릭하여 상세 페이지로 이동
 */
export async function clickBoardTitle(page: Page, index: number = 0) {
  const titles = page.locator(selectors.boardTitle);
  await titles.nth(index).click();
  await page.waitForURL(/\/board\/\d+/);
}

/**
 * 게시글 등록 페이지로 이동
 */
export async function goToBoardCreate(page: Page) {
  await page.click(selectors.registerButton);
  await page.waitForURL(routes.boardCreate);
}

/**
 * 게시글 작성
 */
export async function fillBoardForm(page: Page, title: string, content: string) {
  await page.fill(selectors.formTitle, title);
  await page.fill(selectors.formContent, content);
}

/**
 * 게시글 등록/수정 제출
 */
export async function submitBoardForm(page: Page) {
  await page.click(selectors.formSubmit);
  await page.waitForURL(routes.board);
}

/**
 * 더보기 버튼 클릭
 */
export async function clickMoreButton(page: Page, index: number = 0) {
  const moreButtons = page.locator(selectors.boardMoreButton);
  await moreButtons.nth(index).click();
  await page.waitForTimeout(200); // 드롭다운 애니메이션 대기
}

/**
 * 더보기 메뉴에서 수정 클릭
 */
export async function clickMoreEdit(page: Page) {
  await page.click(selectors.moreEdit);
  await page.waitForURL(/\/board\/\d+\/edit/);
}

/**
 * 더보기 메뉴에서 삭제 클릭
 */
export async function clickMoreDelete(page: Page) {
  await page.click(selectors.moreDelete);
  await page.waitForTimeout(200); // 모달 애니메이션 대기
}

/**
 * 삭제 모달에서 확인 클릭
 */
export async function confirmDelete(page: Page) {
  await page.click(selectors.modalConfirm);
  await page.waitForTimeout(500); // 삭제 요청 대기
}

/**
 * 삭제 모달에서 취소 클릭
 */
export async function cancelDelete(page: Page) {
  await page.click(selectors.modalCancel);
}

/**
 * 보기 타입 전환
 */
export async function changeViewType(page: Page, type: 'list' | 'card') {
  await page.click(selectors.viewTypeToggle);
  await page.waitForTimeout(200); // 드롭다운 애니메이션 대기

  const optionSelector = type === 'list' ? selectors.viewTypeList : selectors.viewTypeCard;
  await page.click(optionSelector);
  await page.waitForTimeout(300); // 레이아웃 변경 대기
}

/**
 * 페이징에서 페이지 클릭
 */
export async function clickPaginationPage(page: Page, pageNumber: number) {
  await page.click(selectors.paginationPage(pageNumber));
  await page.waitForTimeout(500); // 데이터 로딩 대기
}

/**
 * 페이징에서 다음 페이지 클릭
 */
export async function clickPaginationNext(page: Page) {
  await page.click(selectors.paginationNext);
  await page.waitForTimeout(500);
}

/**
 * 페이징에서 이전 페이지 클릭
 */
export async function clickPaginationPrev(page: Page) {
  await page.click(selectors.paginationPrev);
  await page.waitForTimeout(500);
}

/**
 * localStorage 확인
 */
export async function getLocalStorage(page: Page, key: string): Promise<string | null> {
  return await page.evaluate((k) => localStorage.getItem(k), key);
}

/**
 * localStorage 설정
 */
export async function setLocalStorage(page: Page, key: string, value: string) {
  await page.evaluate(({ k, v }) => localStorage.setItem(k, v), { k: key, v: value });
}

/**
 * localStorage 초기화
 */
export async function clearLocalStorage(page: Page) {
  await page.evaluate(() => localStorage.clear());
}

/**
 * 활성화된 메뉴 확인
 */
export async function expectActiveMenu(page: Page, menu: 'home' | 'board') {
  const menuSelector = menu === 'home' ? selectors.lnbHome : selectors.lnbBoard;
  const menuElement = page.locator(menuSelector);
  await expect(menuElement).toHaveAttribute('aria-current', 'page');
}

/**
 * 게시글 개수 확인
 */
export async function getBoardCount(page: Page, viewType: 'list' | 'card' = 'list'): Promise<number> {
  if (viewType === 'list') {
    return await page.locator(selectors.boardRow).count();
  } else {
    return await page.locator(selectors.boardCard).count();
  }
}
