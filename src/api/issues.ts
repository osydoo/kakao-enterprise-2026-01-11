/**
 * 클라이언트에서 사용하는 Issue API 함수들
 * API 라우트를 통해 서버에서 GitHub API를 호출합니다.
 */

import type { Issue } from '@/shared/github.types';
import { Pagination } from '@/components/pagination/pagination.types';

export interface DeleteIssueResponse {
  success: boolean;
}

export interface DeleteIssueError {
  error: string;
}

/**
 * 특정 게시글 조회 API 호출
 * @param issueNumber - 조회할 Issue 번호
 * @returns 게시글 정보
 * @throws Error - 게시글 조회 실패 시
 */
export async function getIssueApi(issueNumber: number): Promise<Issue> {
  const response = await fetch(`/api/issues/${issueNumber}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch issue');
  }

  return response.json();
}

/**
 * 게시글 목록 조회 API 호출
 * @param page - 페이지 번호
 * @param size - 페이지당 게시글 수
 * @param search - 검색어
 * @returns 게시글 목록
 * @throws Error - 게시글 목록 조회 실패 시
 */
export async function getIssuesApi({
  page,
  size = 10,
  search,
}: {
  page: number;
  size: number;
  search: string;
}): Promise<{ issues: Issue[]; pagination: Pagination }> {
  const response = await fetch(`/api/issues?page=${page}&size=${size}&search=${search}`);

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error || 'Failed to fetch issues');
  }

  return response.json();
}

/**
 * Issue 삭제 API 호출
 * @param issueNumber - 삭제할 Issue 번호
 * @returns 삭제 성공 여부
 * @throws Error - 삭제 실패 시
 */
export async function deleteIssueApi({ issueNumber }: { issueNumber: number }): Promise<DeleteIssueResponse> {
  const response = await fetch(`/api/issues/${issueNumber}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error: DeleteIssueError = await response.json();
    throw new Error(error.error || 'Failed to delete issue');
  }

  return response.json();
}

/**
 * Issue 생성 API 호출
 * @param title - 게시글 제목
 * @param content - 게시글 내용
 * @returns 생성된 Issue
 * @throws Error - 생성 실패 시
 */
export async function createIssueApi({ title, content }: { title: string; content: string }): Promise<Issue> {
  const response = await fetch('/api/issues', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, content }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create issue');
  }

  return response.json();
}

/**
 * Issue 수정 API 호출
 * @param issueNumber - 수정할 Issue 번호
 * @param title - 게시글 제목
 * @param content - 게시글 내용
 * @returns 수정된 Issue
 * @throws Error - 수정 실패 시
 */
export async function updateIssueApi({
  issueNumber,
  title,
  content,
}: {
  issueNumber: number;
  title: string;
  content: string;
}): Promise<Issue> {
  const response = await fetch(`/api/issues/${issueNumber}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, content }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update issue');
  }

  return response.json();
}
