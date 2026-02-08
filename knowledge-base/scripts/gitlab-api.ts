const GITLAB_URL = process.env.GITLAB_URL || 'https://git.ucloudadmin.com';
const GITLAB_TOKEN = process.env.GITLAB_TOKEN;

if (!GITLAB_TOKEN) {
  console.error('Error: GITLAB_TOKEN env var is required');
  process.exit(1);
}

const headers = { 'PRIVATE-TOKEN': GITLAB_TOKEN };

export async function getTree(projectPath: string, dirPath: string, ref = 'main'): Promise<Array<{ name: string; type: string; path: string }>> {
  const encoded = encodeURIComponent(projectPath);
  const url = `${GITLAB_URL}/api/v4/projects/${encoded}/repository/tree?path=${encodeURIComponent(dirPath)}&ref=${ref}&per_page=100`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`GitLab tree error: ${res.status} for ${projectPath}/${dirPath}`);
  return res.json();
}

export async function getFileContent(projectPath: string, filePath: string, ref = 'main'): Promise<string | null> {
  const encoded = encodeURIComponent(projectPath);
  const fileEncoded = encodeURIComponent(filePath);
  const url = `${GITLAB_URL}/api/v4/projects/${encoded}/repository/files/${fileEncoded}?ref=${ref}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`GitLab file error: ${res.status} for ${projectPath}/${filePath}`);
  }
  const data = await res.json();
  return Buffer.from(data.content, 'base64').toString('utf8');
}
