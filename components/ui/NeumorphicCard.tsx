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
        "rounded-xl bg-white border border-slate-200 transition-shadow duration-200",
        inset
          ? "shadow-inner"
          : "shadow-sm hover:shadow-md",
        className
      )}
      {...rest}
    />
  );
}
