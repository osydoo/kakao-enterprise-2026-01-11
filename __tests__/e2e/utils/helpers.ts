import { Page, expect } from '@playwright/test';
import { routes, ui } from './selectors';

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
  const menuLink = menu === 'home' ? ui.lnbHome(page) : ui.lnbBoard(page);
  await menuLink.click();
}

/**
 * 검색 수행
 */
export async function searchBoard(page: Page, keyword: string, method: 'enter' | 'button' = 'enter') {
  const input = ui.searchInput(page);
  await input.fill(keyword);

  if (method === 'enter') {
    await input.press('Enter');
  } else {
    await ui.searchButton(page).click();
  }

  // 검색 결과 로딩 대기
  await page.waitForTimeout(500);
}

/**
 * 게시글 제목 클릭하여 상세 페이지로 이동
 */
export async function clickBoardTitle(page: Page, index: number = 0) {
  const titles = ui.boardTitle(page);
  await titles.nth(index).click();
  await page.waitForURL(/\/board\/\d+/);
}

/**
 * 게시글 등록 페이지로 이동
 */
export async function goToBoardCreate(page: Page) {
  await ui.registerButton(page).click();
  await page.waitForURL(routes.boardCreate);
}

/**
 * 게시글 작성
 */
export async function fillBoardForm(page: Page, title: string, content: string) {
  await ui.formTitle(page).fill(title);
  await ui.formContent(page).fill(content);
}

/**
 * 게시글 등록/수정 제출
 */
export async function submitBoardForm(page: Page) {
  await ui.formSubmit(page).click();
  await page.waitForURL(routes.board);
}

/**
 * 더보기 버튼 클릭
 */
export async function clickMoreButton(page: Page, index: number = 0) {
  const moreButtons = ui.boardMoreButton(page);
  await moreButtons.nth(index).click();
  await page.waitForTimeout(200); // 드롭다운 애니메이션 대기
}

/**
 * 더보기 메뉴에서 수정 클릭
 */
export async function clickMoreEdit(page: Page) {
  await ui.moreEdit(page).click();
  await page.waitForURL(/\/board\/\d+\/edit/);
}

/**
 * 더보기 메뉴에서 삭제 클릭
 */
export async function clickMoreDelete(page: Page) {
  await ui.moreDelete(page).click();
  await page.waitForTimeout(200); // 모달 애니메이션 대기
}

/**
 * 삭제 모달에서 확인 클릭
 */
export async function confirmDelete(page: Page) {
  await ui.modalConfirm(page).click();
  await page.waitForTimeout(500); // 삭제 요청 대기
}

/**
 * 삭제 모달에서 취소 클릭
 */
export async function cancelDelete(page: Page) {
  await ui.modalCancel(page).click();
}

/**
 * 보기 타입 전환
 */
export async function changeViewType(page: Page, type: 'list' | 'card') {
  await ui.viewTypeToggle(page).click();
  await page.waitForTimeout(200); // 드롭다운 애니메이션 대기

  const option = type === 'list' ? ui.viewTypeList(page) : ui.viewTypeCard(page);
  await option.click();
  await page.waitForTimeout(300); // 레이아웃 변경 대기
}

/**
 * 페이징에서 페이지 클릭
 */
export async function clickPaginationPage(page: Page, pageNumber: number) {
  await ui.paginationPage(page, pageNumber).click();
  await page.waitForTimeout(500); // 데이터 로딩 대기
}

/**
 * 페이징에서 다음 페이지 클릭
 */
export async function clickPaginationNext(page: Page) {
  await ui.paginationNext(page).click();
  await page.waitForTimeout(500);
}

/**
 * 페이징에서 이전 페이지 클릭
 */
export async function clickPaginationPrev(page: Page) {
  await ui.paginationPrev(page).click();
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
  const menuElement = menu === 'home' ? ui.lnbHome(page) : ui.lnbBoard(page);
  await expect(menuElement).toHaveAttribute('aria-current', 'page');
}

/**
 * 게시글 개수 확인
 */
export async function getBoardCount(page: Page, viewType: 'list' | 'card' = 'list'): Promise<number> {
  if (viewType === 'list') {
    return await ui.boardRow(page).count();
  } else {
    return await ui.boardCard(page).count();
  }
}
