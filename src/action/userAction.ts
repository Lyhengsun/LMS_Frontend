"use server";

import { revalidateTag } from "next/cache";
import {
  approveUserByIdService,
  deleteUserByIdService,
  disableUserByIdService,
  getAllUserForAdminService,
  getCurrentUserService,
} from "../service/user.service";
import User from "../type/User";

export const getAllUserForAdminAction = async (
  page: number,
  size: number,
  isApproved: boolean | null
) => {
  const res = await getAllUserForAdminService(page, size, isApproved);

  if (res.code && res.code === 200 && res.payload) {
    const payload = res.payload;
    return {
      success: true,
      users: payload.items as User[],
      pagination: payload.pagination,
    };
  } else if (res.code && res.code === 200 && !res.payload) {
    return { success: true, message: res.message };
  } else {
    console.log("getAllUserForAdminAction error", res);
    return { success: false, message: res.detail };
  }
};

export const approveUserByIdAction = async (userId: number) => {
  const res = await approveUserByIdService(userId);
  revalidateTag("users");
  if (res.code && res.code === 200) {
    return { success: true, message: res.message };
  } else {
    console.log("approveUserByIdAction error", res);
    return { success: false, message: res.detail };
  }
};

export const deleteUserByIdAction = async (userId: number) => {
  const res = await deleteUserByIdService(userId);
  revalidateTag("users");
  if (res.code && res.code === 200) {
    return { success: true, message: res.message };
  } else {
    console.log("deleteUserByIdAction error", res);
    return { success: false, message: res.detail };
  }
};

export const disableUserByIdAction = async (
  userId: number,
  isDisable: boolean
) => {
  const res = await disableUserByIdService(userId, isDisable);
  revalidateTag("users");
  if (res.code && res.code === 200) {
    return { success: true, message: res.message };
  } else {
    console.log("deleteUserByIdAction error", res);
    return { success: false, message: res.detail };
  }
};

export const getCurrentUserAction = async () => {
  try {
    const data = await getCurrentUserService();
    return { success: true, data: data};
  } catch (error) {
    return { success: false, message: error};
  }
};