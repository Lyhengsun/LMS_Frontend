import headerToken from "../app/api/headerToken";
import ApiResponse from "../type/ApiResponse";
import { Leaderboard } from "../type/Leaderboard";
import { Pagination } from "../type/Pagination";

export const getAllLeaderboardsService = async (
  page: number,
  size: number,
  name: string | undefined
) => {
  const url = `${process.env.BASE_API_URL}/leaderboards?page=${page}&size=${size}`;
  let concatenatedUrl = url;
  const header = await headerToken();

  if (name != undefined && name.trim().length > 0) {
    concatenatedUrl += `&name=${name}`;
  }

  try {
    const res = await fetch(concatenatedUrl, {
      headers: header as HeadersInit,
    });

    const data: ApiResponse<{
      items: Leaderboard[];
      pagination: Pagination;
    }> = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getCurrentStudentLeaderboardService = async () => {
  const url = `${process.env.BASE_API_URL}/leaderboards/current-student`;
	const header = await headerToken();
  try {
		const res = await fetch(url, {
			headers: header as HeadersInit
		})
		const data : ApiResponse<Leaderboard> = await res.json();
		return data;
  } catch (error) {
    console.log(error);
  }
};

export const getCurrentStudentRankLeaderboardService = async () => {
  const url = `${process.env.BASE_API_URL}/leaderboards/current-student-rank`;
	const header = await headerToken();
  try {
		const res = await fetch(url, {
			headers: header as HeadersInit
		})
		const data : ApiResponse<number> = await res.json();
		return data;
  } catch (error) {
    console.log(error);
  }
};