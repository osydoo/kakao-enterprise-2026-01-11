export interface Pagination {
  currentPage: number;
  // pageSize를 변경할 수 있을 시 필요
  pageSize: number;
  totalCount: number;
  totalPage: number;
}
