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
  // `01-layout` 테스트에서 position을 검사하므로 fixed 요소(aside)를 반환
  lnb: (page: Page) => page.getByRole('complementary'),
  contentArea: (page: Page) => page.getByRole('main'),

  // LNB 메뉴
  lnbHome: (page: Page) => ui.lnb(page).getByRole('navigation').getByRole('link', { name: '홈' }),
  lnbBoard: (page: Page) => ui.lnb(page).getByRole('navigation').getByRole('link', { name: '서비스게시판' }),
  lnbBoardSubmenuToggle: (page: Page) =>
    ui.lnb(page).getByRole('navigation').getByRole('button', { name: '서비스게시판 하위 메뉴 토글' }),
  lnbBoardSubmenuList: (page: Page) => ui.lnb(page).getByRole('navigation').getByRole('link', { name: '목록' }),
  lnbBoardSubmenuCreate: (page: Page) => ui.lnb(page).getByRole('navigation').getByRole('link', { name: '글 등록' }),

  // 홈 페이지
  homeImageGrid: (page: Page) => page.getByRole('list', { name: '홈' }),
  homeImageItem: (page: Page) => ui.homeImageGrid(page).getByRole('listitem'),

  // 보기 타입 전환 (아이콘 버튼 등은 반드시 접근 가능한 name 필요)
  viewTypeToggle: (page: Page) =>
    // Dropdown 트리거 버튼은 선택 상태에 따라 텍스트가 바뀔 수 있음(예: '리스트 보기', '카드 보기')
    firstMatch(
      page.getByRole('button', { name: /보기\s*타입|view\s*type|리스트\s*보기|카드\s*보기/i }),
      page.getByText(/보기\s*타입/i),
    ),
  viewTypeList: (page: Page) =>
    firstMatch(
      page.getByRole('menuitemradio', { name: /리스트|list/i }),
      page.getByRole('menuitem', { name: /리스트|list/i }),
    ),
  viewTypeCard: (page: Page) =>
    firstMatch(
      page.getByRole('menuitemradio', { name: /카드|card/i }),
      page.getByRole('menuitem', { name: /카드|card/i }),
    ),

  // 서비스 게시판 (구현에 따라 label/placeholder 기반으로도 찾을 수 있게 유연하게)
  searchInput: (page: Page) =>
    firstMatch(page.getByRole('textbox', { name: /검색/i }), page.getByPlaceholder(/검색/i), page.getByLabel(/^검색$/)),
  searchButton: (page: Page) =>
    firstMatch(
      page.getByRole('button', { name: /검색\s*실행|검색/i }),
      page.getByText('검색'),
      page.getByLabel(/검색\s*실행/i),
    ),
  registerButton: (page: Page) =>
    firstMatch(page.getByRole('button', { name: /등록|작성/i }), page.getByRole('link', { name: /등록|작성/i })),

  // 게시글 목록/카드/제목/더보기 (구현되면 role 기반으로 매칭되도록 의도)
  boardTable: (page: Page) => page.getByRole('table'),
  boardRow: (page: Page) => page.getByRole('row'),
  boardCard: (page: Page) => page.getByRole('article'),
  // LNB 링크가 섞이지 않도록 게시판 목록 섹션으로 범위를 제한
  boardTitle: (page: Page) => ui.contentArea(page).getByRole('region', { name: '게시글 목록' }).getByRole('link'),
  boardMoreButton: (page: Page) => page.getByRole('button', { name: /더보기|more/i }),

  // 더보기 드롭다운/메뉴
  moreDropdown: (page: Page) => page.getByRole('menu'),
  moreEdit: (page: Page) => page.getByRole('menuitemradio', { name: /수정|edit/i }),
  moreDelete: (page: Page) => page.getByRole('menuitemradio', { name: /삭제|delete/i }),

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
  detailContent: (page: Page) =>
    firstMatch(
      // headline과 별도로 본문/내용 section이 별도의 landmark/role로 구분되어 있다면 우선 활용
      page.getByRole('region', { name: /내용|content/i }),
      // 내용 영역에 aria-label, aria-labelledby 등 액세스블 네임이 부여된 region 우선 활용
      page.getByRole('region', { name: /본문|body/i }),
      // aria-label 등으로 "내용"이 부여된 아무 element도 허용 (예, div[aria-label="내용"])
      page.locator('[aria-label="내용"], [aria-label="content"], [aria-label="본문"], [aria-label="body"]'),
    ),
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
