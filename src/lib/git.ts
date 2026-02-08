import simpleGit from 'simple-git'
import path from 'path'
import fs from 'fs/promises'
const PROJECTS_DIR = process.env.PROJECTS_DIR || './projects'

export function getProjectPath(userId: string, projectId: string) { return path.join(PROJECTS_DIR, userId, projectId) }

export async function cloneRepository(repoUrl: string, accessToken: string, userId: string, projectId: string) {
  const projectPath = getProjectPath(userId, projectId); await fs.mkdir(path.dirname(projectPath), { recursive: true })
  const urlWithAuth = repoUrl.replace('https://', 'https://oauth2:' + accessToken + '@')
  await simpleGit().clone(urlWithAuth, projectPath); return projectPath
}

export async function checkoutBranch(projectPath: string, branchName: string) { await simpleGit(projectPath).checkout(branchName) }
export async function pullBranch(projectPath: string) { await simpleGit(projectPath).pull() }
export async function getCurrentBranch(projectPath: string) { return (await simpleGit(projectPath).revparse(['--abbrev-ref', 'HEAD'])).trim() }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function commitAndPush(projectPath: string, message: string, _accessToken: string) { const git = simpleGit(projectPath); await git.add('.'); await git.commit(message); await git.push() }
export async function readProjectFile(projectPath: string, filePath: string) { return fs.readFile(path.join(projectPath, filePath), 'utf-8') }
export async function writeProjectFile(projectPath: string, filePath: string, content: string) { const fullPath = path.join(projectPath, filePath); await fs.mkdir(path.dirname(fullPath), { recursive: true }); await fs.writeFile(fullPath, content, 'utf-8') }

export async function listProjectFiles(projectPath: string, dir = ''): Promise<string[]> {
  const fullPath = path.join(projectPath, dir); const entries = await fs.readdir(fullPath, { withFileTypes: true }); const files: string[] = []
  for (const entry of entries) { if (entry.name.startsWith('.') || entry.name === 'node_modules') continue; const relativePath = path.join(dir, entry.name); if (entry.isDirectory()) files.push(...await listProjectFiles(projectPath, relativePath)); else files.push(relativePath) }
  return files
}
