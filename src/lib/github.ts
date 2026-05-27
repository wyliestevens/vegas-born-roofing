/**
 * GitHub API wrapper for git-backed storage.
 * All content is stored as files in the repository.
 */

const OWNER = process.env.GITHUB_OWNER || "wyliestevens";
const REPO = process.env.GITHUB_REPO || "vegas-born-roofing";
const BRANCH = process.env.GITHUB_BRANCH || "main";

function getToken(): string {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN environment variable is not set");
  return token;
}

function headers(): HeadersInit {
  return {
    Authorization: `Bearer ${getToken()}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

const API = "https://api.github.com";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CommitInfo = {
  sha: string;
  message: string;
  date: string;
  author: string;
};

export type UploadedImage = {
  path: string;
  name: string;
  sha: string;
  size: number;
  url: string;
};

// ---------------------------------------------------------------------------
// readFile
// ---------------------------------------------------------------------------

export async function readFile(
  path: string
): Promise<{ content: string; sha: string }> {
  const url = `${API}/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`;
  const res = await fetch(url, { headers: headers(), cache: "no-store" });

  if (res.status === 404) {
    throw new Error(`File not found: ${path}`);
  }
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub API error ${res.status} reading ${path}: ${body}`);
  }

  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { content, sha: data.sha };
}

// ---------------------------------------------------------------------------
// writeFile
// ---------------------------------------------------------------------------

export async function writeFile({
  path,
  contentBase64,
  message,
  sha,
}: {
  path: string;
  contentBase64: string;
  message: string;
  sha?: string;
}): Promise<{ sha: string; commitSha: string }> {
  const url = `${API}/repos/${OWNER}/${REPO}/contents/${path}`;
  const body: Record<string, string> = {
    message,
    content: contentBase64,
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error ${res.status} writing ${path}: ${text}`);
  }

  const data = await res.json();
  return {
    sha: data.content.sha,
    commitSha: data.commit.sha,
  };
}

// ---------------------------------------------------------------------------
// deleteFile
// ---------------------------------------------------------------------------

export async function deleteFile(
  path: string,
  sha: string,
  message: string
): Promise<void> {
  const url = `${API}/repos/${OWNER}/${REPO}/contents/${path}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: headers(),
    body: JSON.stringify({
      message,
      sha,
      branch: BRANCH,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `GitHub API error ${res.status} deleting ${path}: ${text}`
    );
  }
}

// ---------------------------------------------------------------------------
// listCommits
// ---------------------------------------------------------------------------

export async function listCommits(
  path?: string,
  limit: number = 20
): Promise<CommitInfo[]> {
  const params = new URLSearchParams({
    sha: BRANCH,
    per_page: String(limit),
  });
  if (path) params.set("path", path);

  const url = `${API}/repos/${OWNER}/${REPO}/commits?${params}`;
  const res = await fetch(url, { headers: headers(), cache: "no-store" });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error ${res.status} listing commits: ${text}`);
  }

  const data = await res.json();
  return data.map(
    (c: {
      sha: string;
      commit: {
        message: string;
        author: { date: string; name: string };
      };
    }) => ({
      sha: c.sha,
      message: c.commit.message,
      date: c.commit.author.date,
      author: c.commit.author.name,
    })
  );
}

// ---------------------------------------------------------------------------
// readFileAtCommit
// ---------------------------------------------------------------------------

export async function readFileAtCommit(
  path: string,
  commitSha: string
): Promise<{ content: string }> {
  const url = `${API}/repos/${OWNER}/${REPO}/contents/${path}?ref=${commitSha}`;
  const res = await fetch(url, { headers: headers(), cache: "no-store" });

  if (res.status === 404) {
    throw new Error(
      `File not found: ${path} at commit ${commitSha.slice(0, 7)}`
    );
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `GitHub API error ${res.status} reading ${path} at ${commitSha.slice(0, 7)}: ${text}`
    );
  }

  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { content };
}

// ---------------------------------------------------------------------------
// uploadImage
// ---------------------------------------------------------------------------

export async function uploadImage({
  folder,
  filename,
  base64,
}: {
  folder: string;
  filename: string;
  base64: string;
}): Promise<{ url: string; sha: string }> {
  const path = `public/uploads/${folder}/${filename}`;
  const message = `Upload image: ${folder}/${filename}`;

  let existingSha: string | undefined;
  try {
    const existing = await readFile(path);
    existingSha = existing.sha;
  } catch {
    // File doesn't exist yet
  }

  const result = await writeFile({
    path,
    contentBase64: base64,
    message,
    sha: existingSha,
  });

  const url = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${path}`;

  return { url, sha: result.sha };
}

// ---------------------------------------------------------------------------
// listUploads
// ---------------------------------------------------------------------------

export async function listUploads(): Promise<UploadedImage[]> {
  const refUrl = `${API}/repos/${OWNER}/${REPO}/git/ref/heads/${BRANCH}`;
  const refRes = await fetch(refUrl, { headers: headers(), cache: "no-store" });

  if (!refRes.ok) {
    const text = await refRes.text();
    throw new Error(`GitHub API error ${refRes.status} getting ref: ${text}`);
  }

  const refData = await refRes.json();
  const commitSha = refData.object.sha;

  const treeUrl = `${API}/repos/${OWNER}/${REPO}/git/trees/${commitSha}?recursive=1`;
  const treeRes = await fetch(treeUrl, {
    headers: headers(),
    cache: "no-store",
  });

  if (!treeRes.ok) {
    const text = await treeRes.text();
    throw new Error(`GitHub API error ${treeRes.status} getting tree: ${text}`);
  }

  const treeData = await treeRes.json();
  const prefix = "public/uploads/";

  const images: UploadedImage[] = (
    treeData.tree as Array<{
      path: string;
      type: string;
      sha: string;
      size?: number;
    }>
  )
    .filter(
      (item) =>
        item.type === "blob" &&
        item.path.startsWith(prefix) &&
        /\.(jpe?g|png|gif|webp|svg|avif|ico)$/i.test(item.path)
    )
    .map((item) => {
      const name = item.path.split("/").pop() || item.path;
      return {
        path: item.path,
        name,
        sha: item.sha,
        size: item.size || 0,
        url: `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${item.path}`,
      };
    });

  return images;
}
