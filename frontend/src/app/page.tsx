"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Default redirect ke landing page
    router.push("/landing");
  }, [router]);

  // Show nothing while redirecting
  return null;
}
