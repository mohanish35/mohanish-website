import Link from "next/link"
import { getAllPosts } from "@/lib/posts"

export default async function BlogIndex() {
  const posts = await getAllPosts()

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6">Blog</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group relative rounded-2xl border border-zinc-700/70 bg-zinc-900/70 backdrop-blur-md p-4 transition
                       shadow-[0_8px_40px_-20px_rgb(0,0,0,0.6)] hover:-translate-y-1"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-px rounded-[18px] bg-[radial-gradient(80%_60%_at_30%_0%,rgba(251,191,36,.15),transparent_70%),radial-gradient(80%_60%_at_100%_80%,rgba(244,63,94,.12),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />

            {post.cover && (
              <img
                src={post.cover}
                alt=""
                className="mb-3 h-44 w-full rounded-lg object-cover"
              />
            )}

            <h2 className="text-lg md:text-xl font-semibold text-zinc-100">
              {post.title}
            </h2>

            <p className="mt-1 text-sm text-zinc-400">
              {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
                new Date(post.date)
              )}
              {post.readingMinutes ? ` • ${post.readingMinutes} min read` : ""}
            </p>

            {post.excerpt && (
              <p className="mt-2 text-sm text-zinc-300 line-clamp-3">
                {post.excerpt}
              </p>
            )}

            <div className="mt-3">
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-1 underline decoration-amber-400/70 text-amber-400 hover:text-amber-300 hover:decoration-amber-300"
              >
                Read →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
