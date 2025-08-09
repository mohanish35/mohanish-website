import * as React from "react"
export function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={"inline-block rounded-full px-3 py-1 text-sm " + className}
    >
      {children}
    </span>
  )
}
