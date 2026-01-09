// app/lib/github.ts
import { octokit, GITHUB_OWNER, GITHUB_REPO } from './octokit';

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

export async function getIssues(params?: GetIssuesParams) {
  try {
    const { page = 1, per_page = 10, search } = params || {};

    let issues: Issue[] = [];

    if (search) {
      // 검색어가 있는 경우 GitHub Search API 사용
      const response = await octokit.rest.search.issuesAndPullRequests({
        q: `repo:${GITHUB_OWNER}/${GITHUB_REPO} is:issue is:open ${search} in:title,body`,
        sort: 'created',
        order: 'desc',
        per_page: 100, // 검색 API는 최대 100개까지 반환
      });

      issues = response.data.items as Issue[];
    } else {
      // 검색어가 없는 경우 일반 목록 API 사용
      const response = await octokit.rest.issues.listForRepo({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        state: 'open',
        sort: 'created',
        direction: 'desc',
        page,
        per_page,
      });

      issues = response.data as Issue[];
    }

    // 검색 결과에 대해 페이징 적용
    if (search && issues.length > 0) {
      const startIndex = (page - 1) * per_page;
      const endIndex = startIndex + per_page;
      issues = issues.slice(startIndex, endIndex);
    }

    return issues;
  } catch (error) {
    console.error('GitHub API 호출 오류:', error);
    throw error;
  }
}

export async function getIssue(issueNumber: number) {
  try {
    const response = await octokit.rest.issues.get({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      issue_number: issueNumber,
    });

    return response.data as Issue;
  } catch (error) {
    console.error('GitHub API 호출 오류:', error);
    throw error;
  }
}

export async function getIssuesCount(search?: string) {
  try {
    if (search) {
      const response = await octokit.rest.search.issuesAndPullRequests({
        q: `repo:${GITHUB_OWNER}/${GITHUB_REPO} is:issue is:open ${search} in:title,body`,
      });
      return response.data.total_count;
    } else {
      // 전체 개수를 정확히 얻기 어려우므로 큰 수로 요청하여 개수 확인
      const response = await octokit.rest.issues.listForRepo({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        state: 'open',
        per_page: 100,
      });
      return response.data.length;
    }
  } catch (error) {
    console.error('GitHub API 호출 오류:', error);
    return 0;
  }
}

export async function deleteIssue(issueNumber: number) {
  try {
    await octokit.rest.issues.update({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      issue_number: issueNumber,
      state: 'closed',
    });
  } catch (error) {
    console.error('GitHub API 호출 오류:', error);
    throw error;
  }
}
