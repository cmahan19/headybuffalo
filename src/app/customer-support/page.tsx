import { redirect } from "next/navigation";

// Retired: merged into /contact (also redirected in next.config.ts). Safe to delete this file.
export default function CustomerSupport(): never {
  redirect("/contact");
}
