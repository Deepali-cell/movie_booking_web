import React from "react";

const MoviesList = ({ list, loading }) => {
  if (loading) return <p>Loading...</p>;
  if (!list.length) return <p>No movies available</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-200 text-black">
          <tr>
            <th className="text-left px-4 py-2">Movie Name</th>
            <th className="text-left px-4 py-2">Movie Time</th>
            <th className="text-left px-4 py-2">Total Bookings</th>
            <th className="text-left px-4 py-2">Total Earning (₹)</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item, index) => {
            const totalBookings = Object.keys(item.occupiedSeats).length;
            const totalEarning = totalBookings * item.moviePrice;
            return (
              <tr key={index} className="border-t border-gray-300">
                <td className="px-4 py-2">{item.movie?.title || "N/A"}</td>
                <td className="px-4 py-2">{item.movieDateTime}</td>
                <td className="px-4 py-2">{totalBookings}</td>
                <td className="px-4 py-2">₹{totalEarning}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MoviesList;
