import { readFile, writeFile } from "./github";
import fs from "fs";
import path from "path";

export type ContentFile =
  | "testimonials" | "projects" | "team"
  | "services" | "site-settings" | "blog-posts";

const FILE_PATHS: Record<ContentFile, string> = {
  testimonials: "data/content/testimonials.json",
  projects: "data/content/projects.json",
  team: "data/content/team.json",
  services: "data/content/services.json",
  "site-settings": "data/content/site-settings.json",
  "blog-posts": "data/content/blog-posts.json",
};

// For build-time reads (fast, from filesystem)
export function loadContentLocal<T>(file: ContentFile): T {
  const filePath = path.join(process.cwd(), FILE_PATHS[file]);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

// For admin API reads (from GitHub, includes SHA for optimistic concurrency)
export async function loadContentRemote<T>(file: ContentFile): Promise<{ data: T; sha: string }> {
  const { content, sha } = await readFile(FILE_PATHS[file]);
  return { data: JSON.parse(content) as T, sha };
}

// For admin API writes (via GitHub, triggers rebuild)
export async function saveContent<T>(file: ContentFile, data: T, sha: string, message: string): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  const contentBase64 = Buffer.from(json).toString("base64");
  await writeFile({ path: FILE_PATHS[file], contentBase64, message, sha });
}
