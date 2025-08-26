import headerToken from "../app/api/headerToken";
import { RegisterData } from "../type/AuthData";

export const registerService = async (
    registerData : RegisterData
) => {

  console.log("registerUserData : ", registerData);
  try {
    const res = await fetch(`${process.env.BASE_API_URL}/auth/register`, {
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(registerData),
    });

    const data = await res.json();

    console.log("register service data : ", data);
    if (!data) {
      throw new Error("register service fail");
    }

    return data;
  } catch (error) {
    console.log("registerService error : ", error);
  }
};

export const loginService = async (email : string, password : string) => {
  const userLoginData = {
    email: email,
    password: password,
  };
  try {
    const res = await fetch(`${process.env.BASE_API_URL}/auth/login`, {
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(userLoginData),
    });
    const data = await res.json();

    return data;
  } catch (error) {
    console.log("loginService Error : ", error);
  }
};

export const verifyOTPService = async (email : string, otpCode : string) => {
  try {
    const res = await fetch(
      `${process.env.BASE_API_URL}/auth/verify?email=${email}&otpCode=${otpCode}`,
      {
        method: "POST",
        headers: {
          accept: "*/*",
        },
      }
    );
    const data = await res.json();

    console.log("verify otp service data : ", data);
    if (!data) {
      throw new Error("verify otp service fail");
    }

    return data;
  } catch (error) {
    console.log("verifyRegisterService Error : ", error);
  }
};

export const resendOTPService = async (email : string) => {
  try {
    const res = await fetch(
      `${process.env.BASE_API_URL}/auth/resend?email=${email}`,
      {
        method: "POST",
        headers: {
          accept: "*/*",
        },
      }
    );
    const data = await res.json();

    console.log("resend OTP service data : ", data);
    if (!data) {
      throw new Error("resend OTP service fail");
    }

    return data;
  } catch (error) {
    console.log("resendOTPService Error : ", error);
  }
};
export const forgetPasswordService = async (email : string, otp : string, newPassword : string) => {
  try {
    const res = await fetch(
      `${process.env.BASE_API_URL}/auths/reset-password?email=${email}&otp=${otp}&newPassword=${newPassword}}`,
      {
        method: "PUT",
        headers: {
          accept: "*/*",
        },
      }
    );
    const data = await res.json();

    return data;
  } catch (error) {
    console.log("Error reset password ", error);
  }
};

// Get current user
export const getCurrentUser = async () => {
  const header = await headerToken();
  try {
    // since headerToken is an async function that why we need to use await
    const res = await fetch(`${process.env.BASE_API_URL}/app_users`,
      {
        headers: header as any
      }
    );

    const data = await res.json();
    console.log('getCurrentUser data: ', data);
    return data;
  } catch (e) {
    console.log(e);
  }
};