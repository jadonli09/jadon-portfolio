"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Sends an old URL to its new home. Static export can't do server redirects, so this runs in the browser. */
export function Redirect({ to }: { to: string }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(to);
  }, [router, to]);
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${BASE}${to}`} />
      <link rel="canonical" href={`${BASE}${to}`} />
    </>
  );
}
