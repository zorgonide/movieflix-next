"use client";

import Link, { LinkProps } from "next/link";
import NProgress from "nprogress";
import React from "react";

const CustomLink = React.forwardRef<
  HTMLAnchorElement,
  LinkProps & { children: React.ReactNode; className?: string }
>(({ onClick, ...rest }, ref) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If the user is holding Ctrl or Cmd, let the browser handle the new tab
    if (e.metaKey || e.ctrlKey) {
      return;
    }
    NProgress.start();
    if (onClick) {
      onClick(e);
    }
  };

  return <Link {...rest} ref={ref} onClick={handleClick} />;
});

CustomLink.displayName = "CustomLink";

export default CustomLink;
