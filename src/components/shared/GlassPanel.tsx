import { forwardRef } from "react";
import clsx from "clsx";

export const GlassPanel = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { accent?: "green" | "cyan" | "amber" | "red" | "none" }
>(function GlassPanel({ className, accent = "none", children, ...rest }, ref) {
  return (
    <div
      ref={ref}
      className={clsx(
        "glass-panel rounded-2xl",
        accent === "green" && "border-green/30",
        accent === "cyan" && "border-cyan/30",
        accent === "amber" && "border-amber/30",
        accent === "red" && "border-red/30",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
