import React from "react";

const AdminFeaturedSection = ({ headerTitle }: { headerTitle: string }) => {
  return (
    <div className="flex items-center justify-between mb-8 px-10 pt-10">
      <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 drop-shadow-md border-b border-yellow-500 pb-1">
        {headerTitle}
      </h3>
    </div>
  );
};

export default AdminFeaturedSection;
