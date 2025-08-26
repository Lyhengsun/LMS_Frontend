"use server";
import { AuthError } from "next-auth";
import { signIn } from "../auth";
import InvalidLoginError from "../error/invalidLoginError";
import { LoginData, RegisterData } from "../type/AuthData";
import {
  registerService,
  resendOTPService,
  verifyOTPService,
} from "../service/auth.service";

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

export const registerAction = async (data: RegisterData) => {
  try {
    const res = await registerService(data);

    // console.log("registerAction response : ", registerData);
    if (res.success) {
      return { success: true, data: res };
    }
    return {
      success: false,
      message: res.message ?? res.detail,
    };
  } catch (error) {
    // console.error("registerAction error : ", error);
    return { success: false, message: error || "Registration failed" };
  }
};

export const verifyOTPAction = async (email: string, otpCode: string) => {
  try {
    const res = await verifyOTPService(email, otpCode);
    // console.log("registerAction response : ", registerData);
    if (res.success) {
      return { success: true, data: res };
    }
    return {
      success: false,
      message: res.message ?? res.detail,
    };
  } catch (error) {
    // console.error("registerAction error : ", error);
    return { success: false, message: error || "OTP Verification failed" };
  }
};

export const resendOTPAction = async (email: string) => {
  try {
    const res = await resendOTPService(email);
    return {
      success: true,
      message: res.message ?? res.detail,
    };
  } catch (error) {
    // console.error("registerAction error : ", error);
    return { success: false, message: error || "OTP Verification failed" };
  }
};
