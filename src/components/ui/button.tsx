import Link from "next/link";
import { LucideIcon } from "lucide-react";
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  Icon?: LucideIcon;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 font-bold text-mxpink transition-transform duration-200 active:scale-95 hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

export const Button = ({
  href,
  children,
  Icon,
  onClick,
  type = "button",
  disabled,
  className = "",
}: ButtonProps) => {
  const classes = `${baseClasses} ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        aria-disabled={disabled || undefined}
        className={classes}
      >
        {Icon && <Icon size={20} />}
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {Icon && <Icon size={20} />}
      {children}
    </button>
  );
};
