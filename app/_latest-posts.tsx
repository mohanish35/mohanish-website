import Link from "next/link"
import { getAllPosts } from "@/lib/posts"
import { LatestCard, PostMeta } from "./_latest-posts.client"

export default async function LatestPosts() {
  // Ensure you slice the actual array. If your lib returns { posts: PostMeta[] },
  // use: const { posts } = await getAllPosts(); const top = posts.slice(0, 3)
  const all = await getAllPosts()
  const posts: PostMeta[] = Array.isArray(all)
    ? all.slice(0, 3)
    : all.posts.slice(0, 3)

  return (
    <section id="blog" className="relative mx-auto max-w-6xl px-4 py-16">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-semibold text-white">
          Latest posts
        </h2>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm
             border border-zinc-700/70 bg-zinc-900/70 backdrop-blur
             text-zinc-200 hover:text-white transition-colors"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" />
          All posts →
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <LatestCard key={p.slug} p={p} />
        ))}
      </div>
    </section>
  )
}
