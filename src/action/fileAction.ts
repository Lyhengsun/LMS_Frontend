"use server";

import { uploadImageService, uploadVideoService } from "../service/file.service";

export const uploadImageAction = async (image: File) => {
  try {
    const imageData = await uploadImageService(image);
    if (imageData!.success) {
      return { success: true, data: imageData!.payload };
    }
    return {
      success: false,
      message: imageData?.message,
    };
  } catch (error) {
    // console.log("uploadImageAction error : ", error);
    return { success: false, message: error };
  }
};

export const uploadVideoAction = async (video: File) => {
  try {
    const videoData = await uploadVideoService(video);
    if (videoData!.success) {
      return { success: true, data: videoData!.payload };
    }
    return {
      success: false,
      message: videoData?.message,
    };
  } catch (error) {
    // console.log("uploadImageAction error : ", error);
    return { success: false, message: error };
  }
}
