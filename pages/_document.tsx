import { Html, Head, Main, NextScript } from "next/document";
export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head><meta name="viewport" content="width=device-width, initial-scale=1" /></Head>
      <body className="bg-zinc-900"><Main /><NextScript /></body>
    </Html>
  );
}
