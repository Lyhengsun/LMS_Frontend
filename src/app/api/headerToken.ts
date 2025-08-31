import { auth } from "@/src/auth";
import AuthHeaders from "@/src/type/AuthHeaders";

const headerToken = async (): Promise<AuthHeaders | null> => {
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
