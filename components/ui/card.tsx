import * as React from "react"
export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={"rounded-2xl border " + className}>{children}</div>
}
export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="px-4 pt-4">{children}</div>
}
export function CardTitle({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return <h3 className={"text-lg font-semibold " + className}>{children}</h3>
}
export function CardContent({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={"px-4 pb-4 " + className}>{children}</div>
}
