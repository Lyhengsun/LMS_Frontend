"use server";
import { getAllLeaderboardsService } from "../service/leaderboard.service";

export const getAllLeaderboardsAction = async (
  page: number,
  size: number,
  name?: string | undefined
) => {
  try {
    const data = await getAllLeaderboardsService(page, size, name);
    if (data?.success) {
      return { success: true, data: data.payload };
    }
    return { success: false, message: data?.message };
  } catch (error) {
    return { success: false, message: error };
  }
};
