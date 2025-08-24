import { auth } from "@/src/auth";
import { redirect } from "next/navigation";

const RedirectPage = async () => {
  const session = await auth();
  if (session?.user) {
    const role = (session.user as any).role as string;
    if (role == "ROLE_STUDENT") {
      redirect("/dashboard");
    } else if (role == "ROLE_INSTRUCTOR") {
      redirect("/instructor/dashboard");
    } else if (role == "ROLE_ADMIN") {
      redirect("/admin/dashboard");
    }
    return;
  }
  redirect("/login");
};

export default RedirectPage;
