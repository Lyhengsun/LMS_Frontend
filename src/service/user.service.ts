import headerToken from "../app/api/headerToken";
import User from "../type/User";

export const getAllUserForAdminService = async (
  page: number = 1,
  size: number = 10,
  isApproved: boolean | null = null
) => {
  const header = await headerToken();
  const url = `${process.env.BASE_API_URL}/admins/user-management?page=${page}&size=${size}&isApproved=${isApproved}`;
  // console.log("getAllUserForAdminService url: ", url);

  try {
    const res = await fetch(url, {
      headers: header as any,
      next: {
        tags: ["users"],
      },
    });

    const data = await res.json();
    // console.log("getAllUserForAdminService data: ", data);

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const approveUserByIdService = async (userId: number) => {
  const header = await headerToken();
  const url = `${process.env.BASE_API_URL}/admins/user-management/update-user/${userId}/approve`;
  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: header as any,
    });

    const data = res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteUserByIdService = async (userId: number) => {
  const header = await headerToken();
  const url = `${process.env.BASE_API_URL}/admins/user-management/${userId}`;
  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: header as any,
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const disableUserByIdService = async (
  userId: number,
  isDisable: boolean
) => {
  const header = await headerToken();
  const url = `${process.env.BASE_API_URL}/admins/user-management/update-user/${userId}/disable?isDisable=${isDisable}`;
  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: header as any,
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getCurrentUserService = async () => {
  const header = await headerToken();
  try {
    const res = await fetch(`${process.env.BASE_API_URL}/app_users`, {
      headers: header as any,
      next: { tags: ["currentUser"] },
    });

    const data = await res.json();

    // console.log("current user : ", data);
    
    if (!data) {
      throw new Error("get current user service fail");
    }
    return data.payload as User;
  } catch (error) {
    console.log("getCurrentUserService error : ", error);
  }
};
