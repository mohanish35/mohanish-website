// app/blog/page.tsx
import { getAllPosts } from "@/lib/posts"
import SiteChrome from "@/components/SiteChrome"
import { LatestCard, PostMeta } from "@/app/_latest-posts.client"
import { CtaChip } from "@/components/CtaChip"

export const metadata = {
  title: "Blog — Mohanish Mankar",
}

export default async function BlogPage() {
  const all = await getAllPosts()
  const posts: PostMeta[] = Array.isArray(all) ? all : all.posts

  return (
    <SiteChrome>
      <main className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold">All posts</h1>
          <CtaChip href="/#blog">← Back to home</CtaChip>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <LatestCard key={p.slug} p={p} />
          ))}
        </div>
      </main>
    </SiteChrome>
  )
}
