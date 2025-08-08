import * as React from "react";
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={"w-full px-3 py-2 rounded-xl bg-zinc-950/60 border border-zinc-700 text-white " + (props.className || "")} />;
}
