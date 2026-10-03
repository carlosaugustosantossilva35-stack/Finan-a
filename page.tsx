import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Dashboard } from "@/components/dashboard";

export default async function Page() {
  if (!(await getServerSession(authOptions))) redirect("/");
  return <Dashboard />;
}
