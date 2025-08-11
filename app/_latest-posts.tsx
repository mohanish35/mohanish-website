import Link from "next/link"
import { getAllPosts } from "@/lib/posts"
import { LatestCard, PostMeta } from "./_latest-posts.client"
import { AllPostsCTA } from "@/components/AllPostsCTA"
import { CtaChip } from "@/components/CtaChip"

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
        <CtaChip href="/blog">All posts →</CtaChip>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <LatestCard key={p.slug} p={p} />
        ))}
      </div>
    </section>
  )
}
