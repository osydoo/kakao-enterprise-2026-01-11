/**
 * 공통 셀렉터 정의
 * 실제 구현에 맞게 수정 필요
 */

export const selectors = {
  // 레이아웃
  gnb: '[data-testid="gnb"]',
  lnb: '[data-testid="lnb"]',
  contentArea: '[data-testid="content-area"]',
  
  // LNB 메뉴
  lnbHome: '[data-testid="lnb-home"]',
  lnbBoard: '[data-testid="lnb-board"]',
  
  // 홈 페이지
  homeImageGrid: '[data-testid="home-image-grid"]',
  homeImageItem: '[data-testid="home-image-item"]',
  
  // 보기 타입 전환
  viewTypeToggle: '[data-testid="view-type-toggle"]',
  viewTypeDropdown: '[data-testid="view-type-dropdown"]',
  viewTypeList: '[data-testid="view-type-list"]',
  viewTypeCard: '[data-testid="view-type-card"]',
  
  // 서비스 게시판
  searchInput: '[data-testid="search-input"]',
  searchButton: '[data-testid="search-button"]',
  registerButton: '[data-testid="register-button"]',
  boardTable: '[data-testid="board-table"]',
  boardCard: '[data-testid="board-card"]',
  boardRow: '[data-testid="board-row"]',
  boardTitle: '[data-testid="board-title"]',
  boardMoreButton: '[data-testid="board-more-button"]',
  
  // 더보기 드롭다운
  moreDropdown: '[data-testid="more-dropdown"]',
  moreEdit: '[data-testid="more-edit"]',
  moreDelete: '[data-testid="more-delete"]',
  
  // 모달
  modal: '[data-testid="modal"]',
  modalBackdrop: '[data-testid="modal-backdrop"]',
  modalCancel: '[data-testid="modal-cancel"]',
  modalConfirm: '[data-testid="modal-confirm"]',
  deleteModal: '[data-testid="delete-modal"]',
  
  // 페이징
  pagination: '[data-testid="pagination"]',
  paginationPrev: '[data-testid="pagination-prev"]',
  paginationNext: '[data-testid="pagination-next"]',
  paginationPage: (page: number) => `[data-testid="pagination-page-${page}"]`,
  paginationEllipsis: '[data-testid="pagination-ellipsis"]',
  
  // 게시글 상세
  detailTitle: '[data-testid="detail-title"]',
  detailContent: '[data-testid="detail-content"]',
  detailListButton: '[data-testid="detail-list-button"]',
  detailMoreButton: '[data-testid="detail-more-button"]',
  
  // 게시글 등록/수정 폼
  formTitle: '[data-testid="form-title"]',
  formContent: '[data-testid="form-content"]',
  formSubmit: '[data-testid="form-submit"]',
  formError: '[data-testid="form-error"]',
  
  // 상태 표시
  loadingIndicator: '[data-testid="loading-indicator"]',
  errorMessage: '[data-testid="error-message"]',
  emptyMessage: '[data-testid="empty-message"]',
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

