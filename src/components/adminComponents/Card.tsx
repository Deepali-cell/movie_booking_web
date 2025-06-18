import React from "react";

const Card = ({
  data,
  icon,
}: {
  data: { title: string; range: string | number };
  icon: React.ReactNode;
}) => {
  return (
    <div className=" text-white p-6 rounded-xl shadow-lg border border-white w-full min-w-[220px]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 capitalize">{data.title}</p>
          <h2 className="text-3xl font-extrabold mt-1 text-yellow-400">
            {data.range}
          </h2>
        </div>
        {icon && <div className="text-yellow-500 w-10 h-10">{icon}</div>}
      </div>
    </div>
  );
};

export default Card;
