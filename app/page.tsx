// app/page.tsx  (NO "use client")
import HomeClient, { FooterClient } from "./_home-client" // your existing long component moved here
import LatestPosts from "./_latest-posts" // server section that reads files

export default function Page() {
  return (
    <>
      <HomeClient />
      <LatestPosts />
      <FooterClient />
    </>
  )
}
