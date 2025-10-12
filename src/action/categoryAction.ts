"use server";

import { getCategoryService } from "../service/category.service";

export const getCategoryAction = async () => {
  try {
    const categoryResponse = await getCategoryService();
    return { success: true, data: categoryResponse?.payload };
  } catch (error) {
    return { success: false, error: error };
  }
};
