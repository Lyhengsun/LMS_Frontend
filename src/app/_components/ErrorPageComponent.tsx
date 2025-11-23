import React from "react";

const ErrorPageComponent = ({ message }: { message: string }) => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      {message}
    </div>
  );
};

export default ErrorPageComponent;
