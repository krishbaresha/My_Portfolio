import { NextResponse } from 'next/server';
import { fetchGitHubRepos } from '@/lib/github';

export async function GET() {
  try {
    const repos = await fetchGitHubRepos();
    return NextResponse.json(repos);
  } catch (error) {
    console.error('Error in github API route:', error);
    return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
