export interface GitLabProject { id: number; name: string; name_with_namespace: string; description: string | null; path_with_namespace: string; http_url_to_repo: string; web_url: string; default_branch: string; last_activity_at: string }
export interface GitLabBranch { name: string; protected: boolean; default: boolean }

export async function searchGitLabProjects(gitlabUrl: string, accessToken: string, query: string): Promise<GitLabProject[]> {
  const url = new URL(gitlabUrl + '/api/v4/projects'); url.searchParams.set('search', query); url.searchParams.set('per_page', '20'); url.searchParams.set('membership', 'true')
  const r = await fetch(url.toString(), { headers: { 'PRIVATE-TOKEN': accessToken } }); if (!r.ok) throw new Error('GitLab API error'); return r.json()
}

export async function getGitLabBranches(gitlabUrl: string, accessToken: string, projectId: number): Promise<GitLabBranch[]> {
  const r = await fetch(gitlabUrl + '/api/v4/projects/' + projectId + '/repository/branches', { headers: { 'PRIVATE-TOKEN': accessToken } }); if (!r.ok) throw new Error('GitLab API error'); return r.json()
}

export async function createGitLabBranch(gitlabUrl: string, accessToken: string, projectId: number, branchName: string, ref: string): Promise<GitLabBranch> {
  const r = await fetch(gitlabUrl + '/api/v4/projects/' + projectId + '/repository/branches', { method: 'POST', headers: { 'PRIVATE-TOKEN': accessToken, 'Content-Type': 'application/json' }, body: JSON.stringify({ branch: branchName, ref }) }); if (!r.ok) throw new Error('GitLab API error'); return r.json()
}

export async function getGitLabProject(gitlabUrl: string, accessToken: string, projectId: number): Promise<GitLabProject> {
  const r = await fetch(gitlabUrl + '/api/v4/projects/' + projectId, { headers: { 'PRIVATE-TOKEN': accessToken } }); if (!r.ok) throw new Error('GitLab API error'); return r.json()
}

export async function createGitLabProject(
  gitlabUrl: string,
  accessToken: string,
  name: string,
  description?: string,
  visibility: 'private' | 'internal' | 'public' = 'private',
  initializeWithReadme = true
): Promise<GitLabProject> {
  const r = await fetch(gitlabUrl + '/api/v4/projects', {
    method: 'POST',
    headers: { 'PRIVATE-TOKEN': accessToken, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description, visibility, initialize_with_readme: initializeWithReadme })
  })
  if (!r.ok) {
    const body = await r.text()
    throw new Error(`GitLab create project error: ${r.status} ${body}`)
  }
  return r.json()
}

export async function pushFileToGitLab(
  gitlabUrl: string,
  accessToken: string,
  projectId: number,
  filePath: string,
  content: string,
  commitMessage: string,
  branch = 'main'
): Promise<void> {
  const encodedPath = encodeURIComponent(filePath)
  const r = await fetch(`${gitlabUrl}/api/v4/projects/${projectId}/repository/files/${encodedPath}`, {
    method: 'POST',
    headers: { 'PRIVATE-TOKEN': accessToken, 'Content-Type': 'application/json' },
    body: JSON.stringify({ branch, content: Buffer.from(content).toString('base64'), encoding: 'base64', commit_message: commitMessage })
  })
  if (!r.ok) {
    const body = await r.text()
    throw new Error(`GitLab push file error: ${r.status} ${body}`)
  }
}
