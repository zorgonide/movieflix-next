"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.configure({ showSpinner: false });

    // On route change, complete the progress bar
    NProgress.done();
  }, [pathname, searchParams]);

  return null; // This component doesn't render anything
}
