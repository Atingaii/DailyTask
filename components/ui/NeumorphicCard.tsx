"use client";

import clsx from "clsx";
import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  inset?: boolean;
};

export function NeumorphicCard({ inset, className, ...rest }: Props) {
  return (
    <div
      className={clsx(
        "rounded-2xl transition-all duration-300",
        "bg-white/65 backdrop-blur-xl",
        "border border-white/50",
        "shadow-[0_8px_32px_rgba(31,38,135,0.1)]",
        inset
          ? "shadow-inner"
          : "hover:shadow-[0_12px_40px_rgba(31,38,135,0.15)] hover:bg-white/75",
        className
      )}
      {...rest}
    />
  );
}
