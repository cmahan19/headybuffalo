// Path: app/checkout/success/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";

const SuccessPage = () => {
  const router = useRouter();

  useEffect(() => {
    // You can handle any post-payment logic here like clearing the cart, etc.
    alert("Payment successful!");
    router.push("/"); // Redirect the user to the homepage or a thank you page.
  }, [router]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Payment Successful!</h1>
      <p className="mt-4">Thank you for your order! We'll send you a confirmation email shortly.</p>
    </div>
  );
};

export default SuccessPage;
