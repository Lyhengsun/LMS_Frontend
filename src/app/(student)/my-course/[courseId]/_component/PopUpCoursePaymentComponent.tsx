"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Course from "@/src/type/Course";
import {
  postPaymentByCourseIdAction,
  checkTransactionPaymentStatusByIdAction,
} from "@/src/action/paymentAction";
import { Clock, DollarSign, Loader2, Smartphone } from "lucide-react";
import { PaymentResponse } from "@/src/type/Payment";
import QRCode from "react-qr-code";
import { toast } from "sonner";

interface PopUpCoursePaymentComponentProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
}

const PopUpCoursePaymentComponent = ({
  isOpen,
  onClose,
  course,
}: PopUpCoursePaymentComponentProps) => {
  const [paymentResponse, setPaymentResponse] =
    useState<PaymentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleProceedPayment = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await postPaymentByCourseIdAction(course.id);
      if (result.success) {
        // Payment successful, redirect or handle accordingly
        console.log("Payment initiated:", result.data);
        if (result.data != undefined) {
          setPaymentResponse(result.data as any);
        }
        // onClose();
        // You can add additional logic here like redirecting to payment gateway
      } else {
        setError("Payment failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Poll transaction status when popup is open and payment response exists
  useEffect(() => {
    if (!isOpen || !paymentResponse) {
      // Clean up interval when popup closes or no payment response
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      setIsPolling(false);
      return;
    }

    setIsPolling(true);

    // Function to check payment status
    const checkPaymentStatus = async () => {
      try {
        const result = await checkTransactionPaymentStatusByIdAction(
          paymentResponse.transactionId
        );

        if (result.success && result.data) {
          const status = result.data.status;
          setPaymentStatus(status);

          console.log("Payment status:", status);

          // Stop polling if payment is completed or failed
          if (status === "COMPLETED" || status === "FAILED") {
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }
            setIsPolling(false);

            if (status === "COMPLETED") {
              console.log("Payment completed successfully!");
              onClose();
              window.location.reload()
            } else {
              toast.error("Failed to check payment")
            }
          }
        }
      } catch (err) {
        console.error("Error checking payment status:", err);
        // Continue polling even if there's an error
      }
    };

    // Initial check
    checkPaymentStatus();

    // Set up polling interval (5 seconds)
    pollingIntervalRef.current = setInterval(checkPaymentStatus, 1000);

    // Cleanup function
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [isOpen, paymentResponse]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
          <DialogDescription>
            Unlock full access to this course
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {paymentResponse != null && (
            <div className="rounded-3xl flex justify-center items-center">
              <div className="flex-1 flex flex-col justify-center items-center border-[1px] border-gray rounded-md">
                <div className="bg-red-500 w-full py-2 text-center text-white font-medium mb-4 rounded-t-md">
                  KHQR
                </div>
                <div className="py-4">
                  <div className="w-40 h-40 bg-white rounded-lg pr-2">
                    {paymentResponse ? (
                      <QRCode value={paymentResponse.khqrString} size={160} />
                    ) : (
                      <p className="text-sm text-gray-500">
                        Loading QR Code...
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-3 text-3xl font-bold justify-center items-center ml-6">
                <div className="flex gap-5 justify-center items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-green-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Scan to Pay
                  </h2>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  ${Number(course.price || 0).toFixed(2)}
                </div>
              </div>
            </div>
          )}
              {/* Course Details */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {course.description}
                </p>

                {/* Price Section */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-gray-700 font-medium">
                    Course Price:
                  </span>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">
                      {course.price || "0.00"}
                    </span>
                  </div>
                </div>
              </div>
          {paymentResponse == null && (
            <div>

              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                <p className="font-medium text-gray-700 mb-1">
                  Payment Details:
                </p>
                <ul className="space-y-1">
                  <li>✓ Secure payment processing</li>
                  <li>✓ Full course access after payment</li>
                  <li>✓ Lifetime access</li>
                </ul>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {paymentResponse == null && (
            <div>
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleProceedPayment} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Proceed to Payment"
                )}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PopUpCoursePaymentComponent;
