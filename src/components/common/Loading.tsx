import React from "react";

const Loading = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500 border-solid"></div>
    </div>
  );
};

export default Loading;
