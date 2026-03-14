import { auth } from "@/auth";
import { notFound } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
    notFound();
  }

  return children;
}
