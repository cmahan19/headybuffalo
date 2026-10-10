import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next = "/admin", error } = await searchParams;
  return (
    <div className="container-page flex justify-center py-16">
      <div className="surface-card w-full max-w-sm p-6">
        <h1 className="text-2xl font-bold">Admin sign in</h1>
        <p className="mt-1 text-sm text-hb-ink/70">Private area for the Heady Buffalo team.</p>
        <LoginForm next={next} error={error} />
      </div>
    </div>
  );
}
