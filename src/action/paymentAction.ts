"use server";

import {
  postPaymentByCourseId,
  checkTransactionPaymentStatusById,
} from "../service/payment.service";

export const postPaymentByCourseIdAction = async (courseId: number) => {
  try {
    const paymentData = await postPaymentByCourseId(courseId);
    return { success: true, data: paymentData };
  } catch (error) {
    return { success: false, message: error };
  }
};

export const checkTransactionPaymentStatusByIdAction = async (
  transactionId: string
) => {
  try {
    const paymentStatusData = await checkTransactionPaymentStatusById(
      transactionId
    );
    return { success: true, data: paymentStatusData };
  } catch (error) {
    return { success: false, message: error };
  }
};
