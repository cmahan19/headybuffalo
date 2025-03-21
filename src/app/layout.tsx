"use client"; // This tells Next.js this is a client-side component

// import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/Header"; // Adjust path if necessary
import Footer from "./components/Footer"; // Import the Footer component
import { CartProvider } from "./context/CartContext"; // Import CartProvider
import { loadStripe } from "@stripe/stripe-js"; // Import loadStripe
import { Elements } from "@stripe/react-stripe-js"; // Import Elements

// Load Stripe with your public key (you can set this key in .env)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// export const metadata: Metadata = {
//   title: "Heady Buffalo",
//   description: "Eco-friendly, charity-giving, and cool products.",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Viewport for mobile optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Add Material Icons link */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Wrap everything with CartProvider */}
        <CartProvider>
          {/* Wrap the app with the Stripe Elements provider */}
          <Elements stripe={stripePromise}>
            {/* Persistent Header */}
            <Header />

            {/* Main content with mobile-friendly padding */}
            <main className="container mx-auto p-4 flex-grow">{children}</main>

            {/* Persistent Footer */}
            <Footer />
          </Elements>
        </CartProvider>
      </body>
    </html>
  );
}
