import React from "react";
import CustomPopUp from "./CustomPopUp";
import { Button } from "@/components/ui/button";

const CustomYesNoPopUp = ({
  title,
  description = null,
  viewDialogOpenState,
  setViewDialogOpenState,
  onClickYes = () => {},
  onClickNo = () => {},
}: {
  title: string;
  description?: string | null;
  viewDialogOpenState: any;
  setViewDialogOpenState: any;
  onClickYes?: Function;
  onClickNo?: Function;
}) => {
  return (
    <CustomPopUp
      title={title}
      description={description}
      viewDialogOpenState={viewDialogOpenState}
      setViewDialogOpenState={setViewDialogOpenState}
    >
      <div className="grid grid-cols-2 gap-4 pt-4 border-t dark:border-gray-700">
        <Button
          className="bg-green-400 text-white"
          onClick={() => {
            onClickYes();
            setViewDialogOpenState(false);
          }}
        >
          Yes
        </Button>
        <Button
          className="bg-red-400 text-white"
          onClick={() => {
            onClickNo();
            setViewDialogOpenState(false);
          }}
        >
          No
        </Button>
      </div>
    </CustomPopUp>
  );
};

export default CustomYesNoPopUp;
