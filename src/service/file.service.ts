import ApiResponse from "../type/ApiResponse";
import ImageResponse from "../type/ImageResponse";

export const uploadImageService = async (image: File) => {
  const url = `${process.env.BASE_API_URL}/files/upload-file`;
  try {
    const formData = new FormData();
    formData.append("file", image);
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });
    const data: ApiResponse<ImageResponse> = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const uploadVideoService = async (video: File) => {
  const url = `${process.env.BASE_API_URL}/files/video/upload-file`;
  try {
    const formData = new FormData();
    formData.append("file", video);
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });
    const data: ApiResponse<string> = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
