import type { AppProps } from "next/app"
import "@/styles/globals.css"
import { Analytics } from "@vercel/analytics/next"

export default function App({ Component, pageProps }: AppProps) {
  console.log("hehe")
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
