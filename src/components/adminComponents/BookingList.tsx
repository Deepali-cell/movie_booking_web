import dayjs from "dayjs";
import React from "react";

const BookingList = ({ list, loading }) => {
  if (loading) return <p>Loading...</p>;
  if (!list.length) return <p>No Bookings are available</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-200 text-black">
          <tr>
            <th className="text-left px-4 py-2">User Name</th>
            <th className="text-left px-4 py-2">Movie Name</th>
            <th className="text-left px-4 py-2">Movie Time</th>
            <th className="text-left px-4 py-2">Seats</th>
            <th className="text-left px-4 py-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item, index) => {
            return (
              <tr key={index} className="border-t border-gray-300">
                <td className="px-4 py-2">{item.user.name || "N/A"}</td>
                <td className="px-4 py-2">{item.show.movie.title}</td>
                <td className="px-4 py-2">
                  {dayjs(item.show.showDateTime).format("DD MMM YYYY, hh:mm A")}
                </td>
                <td className="px-4 py-2">{item.bookedSeats.join(", ")}</td>
                <td className="px-4 py-2">₹{item.amount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BookingList;
