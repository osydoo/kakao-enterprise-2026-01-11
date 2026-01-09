// app/lib/octokit.ts
import { Octokit } from 'octokit';

// 서버 사이드에서만 실행되도록 보장
if (!process.env.NEXT_PUBLIC_GITHUB_PAT) {
  throw new Error('GITHUB_TOKEN is not defined in .env');
}

export const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_PAT,
});

export const GITHUB_OWNER = process.env.NEXT_PUBLIC_OWNER || '';
export const GITHUB_REPO = process.env.NEXT_PUBLIC_REPO || '';
