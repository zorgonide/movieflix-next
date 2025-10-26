import { LucideIcon } from "lucide-react";
import React from "react";
import CustomLink from "../CustomLink";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  Icon?: LucideIcon;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  secondary?: boolean;
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 font-bold  transition-transform duration-200 active:scale-95 hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

export const Button = ({
  href,
  children,
  Icon,
  onClick,
  type = "button",
  disabled,
  className = "",
  fullWidth = true,
  secondary = false,
}: ButtonProps) => {
  const classes = `${baseClasses} ${className} ${fullWidth ? "w-full" : ""} ${
    secondary ? "bg-mxpink text-white" : "bg-white text-mxpink"
  }`;

  if (href) {
    return (
      <CustomLink
        href={href}
        onClick={onClick}
        aria-disabled={disabled || undefined}
        className={classes}
      >
        {Icon && <Icon size={20} />}
        {children}
      </CustomLink>
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
