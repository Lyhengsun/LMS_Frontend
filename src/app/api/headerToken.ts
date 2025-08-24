import { auth } from "@/src/auth";

const headerToken = async () => {
  const session = await auth();
  if (!session) {
    return null;
  }
  return {
    accept: "*/*",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer ${(session?.user as any).token}`,
  };
};

export default headerToken;
