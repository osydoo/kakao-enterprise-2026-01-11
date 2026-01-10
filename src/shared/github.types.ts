/**
 * GitHub Issue 관련 타입 정의
 * 클라이언트와 서버 모두에서 사용 가능
 */
export interface Issue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  created_at: string;
  updated_at: string;
  user: {
    login: string;
  };
}

export interface GetIssuesParams {
  page?: number;
  per_page?: number;
  search?: string;
}
