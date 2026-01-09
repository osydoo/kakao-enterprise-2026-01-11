/**
 * 클라이언트에서 사용하는 Issue API 함수들
 * API 라우트를 통해 서버에서 GitHub API를 호출합니다.
 */

export interface DeleteIssueResponse {
  success: boolean;
}

export interface DeleteIssueError {
  error: string;
}

/**
 * Issue 삭제 API 호출
 * @param issueNumber - 삭제할 Issue 번호
 * @returns 삭제 성공 여부
 * @throws Error - 삭제 실패 시
 */
export async function deleteIssueApi(issueNumber: number): Promise<DeleteIssueResponse> {
  const response = await fetch(`/api/issues/${issueNumber}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error: DeleteIssueError = await response.json();
    throw new Error(error.error || 'Failed to delete issue');
  }

  return response.json();
}
