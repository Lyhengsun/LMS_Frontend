import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import React, { Children } from "react";
import StatusBadgeComponent from "../admin/user-management/_components/StatusBadgeComponent";

const CustomPopUp = ({
  children,
  viewDialogOpenState,
  setViewDialogOpenState,
  title,
  description = null,
}: {
  children: React.ReactNode;
  viewDialogOpenState: any;
  setViewDialogOpenState: any;
  title: string;
  description?: string | null;
}) => {
  return (
    <Dialog open={viewDialogOpenState} onOpenChange={setViewDialogOpenState}>
      <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-white">{title}</DialogTitle>

          {description && (
            <DialogDescription className="dark:text-gray-400">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CustomPopUp;
