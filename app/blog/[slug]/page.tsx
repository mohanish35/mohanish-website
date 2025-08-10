import { notFound } from "next/navigation"
import Link from "next/link"
import { getPostBySlug } from "@/lib/posts"

const ACCENT = "from-amber-400 via-orange-500 to-rose-500"

export default async function BlogPost({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPostBySlug(params.slug)
  if (!post) return notFound()

  const { meta, contentHTML } = post

  return (
    <section className="relative mx-auto max-w-3xl px-4 py-14">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/blog"
          className="underline decoration-amber-400/70 hover:decoration-amber-300"
        >
          ← All posts
        </Link>
        <span className="text-xs text-zinc-400">
          {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
            new Date(meta.date)
          )}
          {meta.readingMinutes ? ` • ${meta.readingMinutes} min read` : ""}
        </span>
      </div>

      <h1 className="text-2xl md:text-3xl font-semibold">{meta.title}</h1>

      {meta.cover && (
        <div className="relative my-6 rounded-2xl border border-zinc-700/70 bg-zinc-900/70 p-2">
          <span
            aria-hidden
            className={`pointer-events-none absolute -inset-px rounded-2xl opacity-20 blur
                        bg-gradient-to-r ${ACCENT}`}
          />
          <img
            src={meta.cover}
            alt=""
            className="relative z-10 w-full rounded-xl object-cover"
          />
        </div>
      )}

      {/* Markdown/HTML rendered body in the house style */}
      <article
        className="mdx-body"
        dangerouslySetInnerHTML={{ __html: contentHTML }}
      />
    </section>
  )
}
