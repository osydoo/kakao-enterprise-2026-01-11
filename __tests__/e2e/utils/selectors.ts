/**
 * E2E 테스트용 UI 로케이터 모음
 *
 * 우선순위(권장):
 * - 접근성 기반: getByRole({ name }) ⭐⭐⭐⭐⭐
 * - 텍스트 기반: getByText ⭐⭐⭐⭐
 * - label / placeholder: getByLabel / getByPlaceholder ⭐⭐⭐⭐
 *
 * 주의:
 * - data-testid, CSS/DOM 구조 기반 셀렉터는 지양(최후의 수단).
 */

import type { Locator, Page } from '@playwright/test';

function firstMatch(...locators: Locator[]) {
  return locators.reduce((acc, cur) => acc.or(cur));
}

export const ui = {
  // 레이아웃
  gnb: (page: Page) => page.getByRole('banner'),
  lnb: (page: Page) => page.getByRole('complementary').getByRole('navigation'),
  contentArea: (page: Page) => page.getByRole('main'),

  // LNB 메뉴
  lnbHome: (page: Page) => ui.lnb(page).getByRole('link', { name: '홈' }),
  lnbBoard: (page: Page) => ui.lnb(page).getByRole('link', { name: '서비스게시판' }),
  lnbBoardSubmenuToggle: (page: Page) => ui.lnb(page).getByRole('button', { name: '서비스게시판 하위 메뉴 토글' }),
  lnbBoardSubmenuList: (page: Page) => ui.lnb(page).getByRole('link', { name: '목록' }),
  lnbBoardSubmenuCreate: (page: Page) => ui.lnb(page).getByRole('link', { name: '글 등록' }),

  // 홈 페이지
  homeImageGrid: (page: Page) => page.getByRole('list', { name: '홈' }),
  homeImageItem: (page: Page) => ui.homeImageGrid(page).getByRole('listitem'),

  // 보기 타입 전환 (아이콘 버튼 등은 반드시 접근 가능한 name 필요)
  viewTypeToggle: (page: Page) =>
    firstMatch(page.getByRole('button', { name: /보기\s*타입|view\s*type/i }), page.getByText(/보기\s*타입/i)),
  viewTypeList: (page: Page) => page.getByRole('menuitem', { name: /리스트|list/i }),
  viewTypeCard: (page: Page) => page.getByRole('menuitem', { name: /카드|card/i }),

  // 서비스 게시판 (구현에 따라 label/placeholder 기반으로도 찾을 수 있게 유연하게)
  searchInput: (page: Page) =>
    firstMatch(page.getByRole('textbox', { name: /검색/i }), page.getByPlaceholder(/검색/i), page.getByLabel(/검색/i)),
  searchButton: (page: Page) => firstMatch(page.getByRole('button', { name: /검색/i }), page.getByText('검색')),
  registerButton: (page: Page) =>
    firstMatch(page.getByRole('button', { name: /등록|작성/i }), page.getByRole('link', { name: /등록|작성/i })),

  // 게시글 목록/카드/제목/더보기 (구현되면 role 기반으로 매칭되도록 의도)
  boardTable: (page: Page) => page.getByRole('table'),
  boardRow: (page: Page) => page.getByRole('row'),
  boardCard: (page: Page) => page.getByRole('article'),
  boardTitle: (page: Page) => page.getByRole('link'),
  boardMoreButton: (page: Page) => page.getByRole('button', { name: /더보기|more/i }),

  // 더보기 드롭다운/메뉴
  moreDropdown: (page: Page) => page.getByRole('menu'),
  moreEdit: (page: Page) => page.getByRole('menuitem', { name: /수정|edit/i }),
  moreDelete: (page: Page) => page.getByRole('menuitem', { name: /삭제|delete/i }),

  // 모달(삭제 확인 등)
  deleteModal: (page: Page) => page.getByRole('dialog'),
  modalCancel: (page: Page) => page.getByRole('button', { name: /취소|cancel/i }),
  modalConfirm: (page: Page) => page.getByRole('button', { name: /삭제|확인|confirm/i }),

  // 페이징
  pagination: (page: Page) => ui.contentArea(page).getByRole('navigation'),
  paginationPrev: (page: Page) => page.getByRole('button', { name: /이전|prev/i }),
  paginationNext: (page: Page) => page.getByRole('button', { name: /다음|next/i }),
  paginationPage: (page: Page, pageNumber: number) => page.getByRole('button', { name: new RegExp(`^${pageNumber}$`) }),
  paginationEllipsis: (page: Page) => page.getByText('...'),

  // 게시글 상세
  detailTitle: (page: Page) => page.getByRole('heading', { level: 1 }),
  detailContent: (page: Page) => page.getByText(/./),
  detailListButton: (page: Page) => page.getByRole('button', { name: /목록|리스트|back/i }),
  detailMoreButton: (page: Page) => page.getByRole('button', { name: /더보기|more/i }),

  // 게시글 등록/수정 폼
  formTitle: (page: Page) =>
    firstMatch(page.getByLabel(/제목/i), page.getByPlaceholder(/제목/i), page.getByRole('textbox', { name: /제목/i })),
  formContent: (page: Page) =>
    firstMatch(page.getByLabel(/내용/i), page.getByPlaceholder(/내용/i), page.getByRole('textbox', { name: /내용/i })),
  formSubmit: (page: Page) =>
    firstMatch(page.getByRole('button', { name: /등록|저장|수정|submit/i }), page.getByText(/등록|저장|수정/)),
  formError: (page: Page) => page.getByRole('alert'),

  // 상태 표시
  loadingIndicator: (page: Page) => page.getByRole('status'),
  errorMessage: (page: Page) => page.getByRole('alert'),
  emptyMessage: (page: Page) => page.getByText(/없습니다|empty/i),
};

/**
 * 페이지 URL
 */
export const routes = {
  home: '/',
  board: '/board',
  boardDetail: (id: string | number) => `/board/${id}`,
  boardCreate: '/board/create',
  boardEdit: (id: string | number) => `/board/${id}/edit`,
};
