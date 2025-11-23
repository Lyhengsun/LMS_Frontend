import headerToken from "../app/api/headerToken";
import { PaymentStatusResponse } from "../type/Payment";

export const postPaymentByCourseId = async (courseId : number) => {
  const url = `${process.env.BASE_API_URL}/payments/courses/${courseId}`;
  const header = await headerToken();
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        ...(header as HeadersInit),
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    console.log("postPaymentByCourseId : ", data);

    return data.payload as PaymentResponse;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const checkTransactionPaymentStatusById = async (transactionId: string) => {
  const url = `${process.env.BASE_API_URL}/payments/${transactionId}`;
  const header = await headerToken();
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        ...(header as HeadersInit),
      },
    });

    const data = await res.json();

    console.log("checkTransactionPaymentStatusById : ", data);

    return data.payload as PaymentStatusResponse;
  } catch (error) {
    console.log(error);
    throw error;
  }
}