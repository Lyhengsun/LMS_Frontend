"use server";
import { AuthError } from "next-auth";
import { signIn } from "../auth";
import InvalidLoginError from "../error/invalidLoginError";

export type LoginData = {
  email: string;
  password: string;
};

export const loginAction = async (data: LoginData) => {
  try {
    await signIn("credentials", {
      redirect: false,
      ...data,
    });

    return { success: "Login successful" };
  } catch (error) {
    // console.log("loginAction error : ", error);

    if (error instanceof InvalidLoginError) {
      return { error: error.errorMessage ?? "Login error" };
    }

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials Error" };
        default: {
          return { error: error.message };
        }
      }
    }
  }
};
