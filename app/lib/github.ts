// app/lib/github.ts
import { octokit, GITHUB_OWNER, GITHUB_REPO } from './octokit';

export async function getIssues() {
  try {
    const response = await octokit.rest.issues.listForRepo({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      state: 'open',
      sort: 'created',
      direction: 'desc',
    });

    return response.data;
  } catch (error) {
    console.error('GitHub API 호출 오류:', error);
    return [];
  }
}
