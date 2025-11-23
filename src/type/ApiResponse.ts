type ApiResponse<T> = {
  message: string;
  payload: T;
  status: string;
  code: number;
  success: boolean;
  instant: string;
  detail: string;
};

export default ApiResponse;
