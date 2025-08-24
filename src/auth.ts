import NextAuth from "next-auth";

import Credentials from "next-auth/providers/credentials";

import { loginService } from "./service/auth.service";
import InvalidLoginError from "./error/invalidLoginError";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const { email, password } = credentials;
        const userRes = await loginService(email as string, password as string);
        const { status } = userRes;
        if (status !== "OK") {
          console.log("userRes : ", userRes);
          throw new InvalidLoginError(userRes.detail ?? userRes.title);
        }
        const { payload } = userRes;

        const header = {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${payload.token}`,
        };
        try {
          const res = await fetch(`${process.env.BASE_API_URL}/app_users`, {
            headers: header,
          });

          const data = await res.json();

          console.log("res : ", res);
          console.log("data : ", data);
          

          if (!data) {
            throw new InvalidLoginError("get current user fail");
          }

          if (!data || !data.success) {
            if (res.status == 401) {
              throw new InvalidLoginError("Unauthorized access");
            }
            throw new InvalidLoginError("get current user fail");
          }
          const userId = data.payload.id;
          const userFullName = data.payload.fullName;
          const userAvatarUrl = data.payload.avatarUrl;
          const role = data.payload.role;
          return {
            ...payload,
            userId,
            userFullName,
            userAvatarUrl,
            role,
          };
        } catch (e) {
          console.error("authorizatoin error : ", e);
        }

        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 5 * 60 * 60,
  },

  callbacks: {
    jwt: async ({ token, user }) => {

      // check if the token expire, return an error message in the object
      if (token && (token.exp as number) < Date.now() / 1000) {
        console.log("Token expired");
        return { ...token, ...user, error: "expired token" };
      }

      return { ...token, ...user };
    },
    session: async ({ session, token, user }) => {
      (session as any).user = token;
      return session;
    },
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },

  pages: {
    signIn: "/login",
    signOut: "/login",
  },
});
