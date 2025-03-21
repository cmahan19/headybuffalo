// Path: app/checkout/cancel/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";

const CancelPage = () => {
  const router = useRouter();

  useEffect(() => {
    alert("Payment canceled. Please try again.");
    router.push("/checkout"); // Redirect back to the checkout page
  }, [router]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Payment Canceled</h1>
      <p className="mt-4">Your payment was canceled. Please try again later or contact support if you have any issues.</p>
    </div>
  );
};

export default CancelPage;
