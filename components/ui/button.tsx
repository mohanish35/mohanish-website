import * as React from "react";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string };
export const Button = React.forwardRef<HTMLButtonElement, Props>(function Btn({ className = "", ...props }, ref) {
  return <button ref={ref} className={"px-4 py-2 rounded-xl " + className} {...props} />;
});
export default Button;
