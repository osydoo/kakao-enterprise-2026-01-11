type PaginationItem = number | 'ellipsis';

export function getPageNumberList(currentPage: number, totalPages: number, visibleSize: number): PaginationItem[] {
  if (totalPages <= 0) return [];

  // totalPages가 visibleSize보다 작거나 같은 경우
  if (totalPages <= visibleSize) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // visibleSize의 홀수/짝수 구분이 큰 의미가 없으므로, 케이스를 통합하여 처리
  const sideCount = Math.floor((visibleSize - 1) / 2);

  // 앞쪽에 붙는 경우 (처음 몇 개)
  if (currentPage <= sideCount + 1) {
    const pages = Array.from({ length: visibleSize - 2 }, (_, i) => i + 1);
    return [...pages, 'ellipsis', totalPages];
  }

  // 뒤쪽에 붙는 경우 (마지막 몇 개)
  if (currentPage >= totalPages - sideCount) {
    const startPage = totalPages - (visibleSize - 2) + 1;
    const pages = Array.from({ length: visibleSize - 2 }, (_, i) => startPage + i);
    return [1, 'ellipsis', ...pages];
  }

  // 가운데/중간에 있는 경우
  const middleCount = visibleSize - 4;
  const startPage = Math.max(2, currentPage - Math.floor((middleCount - 1) / 2));
  const endPage = Math.min(totalPages - 1, startPage + middleCount - 1);

  // 만약 endPage가 마지막페이지-1이 아니라면 startPage를 조정해서 middleCount 개수 유지
  const adjustedStartPage = Math.max(2, endPage - middleCount + 1);
  const pages = [];
  for (let i = adjustedStartPage; i <= endPage; i++) {
    pages.push(i);
  }
  return [1, 'ellipsis', ...pages, 'ellipsis', totalPages];
}
