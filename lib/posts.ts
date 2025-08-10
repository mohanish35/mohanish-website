import fs from "node:fs/promises"
import path from "node:path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"

const BLOG_DIR = path.join(process.cwd(), "content", "blog")

export type PostMeta = {
  slug: string
  title: string
  date: string // ISO string
  tags?: string[]
  cover?: string
  readingMinutes?: number
  excerpt?: string
}

export type FullPost = { meta: PostMeta; contentHtml: string }

export async function getAllPosts(): Promise<PostMeta[]> {
  const files = await fs.readdir(BLOG_DIR)
  const mdFiles = files.filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))

  const metas: PostMeta[] = []
  for (const filename of mdFiles) {
    const filePath = path.join(BLOG_DIR, filename)
    const raw = await fs.readFile(filePath, "utf8")
    const { data, content } = matter(raw)

    const slug = filename.replace(/\.mdx?$/, "")
    const words = content.trim().split(/\s+/).length
    const readingMinutes = Math.max(1, Math.round(words / 200))

    metas.push({
      slug,
      title: data.title ?? slug,
      date: new Date(data.date ?? Date.now()).toISOString(),
      tags: data.tags ?? [],
      cover: data.cover ?? "",
      excerpt: data.excerpt ?? content.slice(0, 160),
      readingMinutes,
    })
  }

  // newest first
  metas.sort((a, b) => +new Date(b.date) - +new Date(a.date))
  return metas
}

export async function getPostBySlug(slug: string): Promise<FullPost | null> {
  if (!slug) return null
  const safe = decodeURIComponent(slug).replace(/\/+|\\+/g, "")
  const filePathMd = path.join(BLOG_DIR, `${safe}.md`)
  const filePathMdx = path.join(BLOG_DIR, `${safe}.mdx`)

  let filePath: string | null = null
  try {
    await fs.access(filePathMd)
    filePath = filePathMd
  } catch {
    try {
      await fs.access(filePathMdx)
      filePath = filePathMdx
    } catch {
      return null
    }
  }

  const raw = await fs.readFile(filePath, "utf8")
  const { data, content } = matter(raw)
  const processed = await remark().use(html).process(content)
  const contentHtml = processed.toString()

  const words = content.trim().split(/\s+/).length
  const readingMinutes = Math.max(1, Math.round(words / 200))

  const meta: PostMeta = {
    slug: safe,
    title: data.title ?? safe,
    date: new Date(data.date ?? Date.now()).toISOString(),
    tags: data.tags ?? [],
    cover: data.cover ?? "",
    excerpt: data.excerpt ?? content.slice(0, 160),
    readingMinutes,
  }

  return { meta, contentHtml }
}
