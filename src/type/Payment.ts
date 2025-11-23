export type PaymentResponse = {
  transactionId: string;
  khqrString: string;
  md5Hash: string;
  amount: 0;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  merchantName: string;
  billNumber: string;
  createdAt: string;
};

export type PaymentStatusResponse = {
  status: string;
  hash: string;
  fromAccountId: string;
  toAccountId: string;
  currency: string;
  amount: number;
  description: string;
};
