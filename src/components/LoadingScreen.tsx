import React from "react";

const LoadingScreen = () => {
  return (
    <div className="h-screen w-full  flex flex-col items-center justify-center text-white">
      {/* Spinner */}
      <div className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent w-16 h-16 mb-6"></div>

      {/* Text */}
      <h1 className="text-2xl font-semibold tracking-wide">Loading...</h1>
      <p className="text-gray-400 text-sm mt-2">
        Please wait while we fetch your experience.
      </p>
    </div>
  );
};

export default LoadingScreen;
