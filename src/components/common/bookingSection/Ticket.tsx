"use client";
import React, { useRef } from "react";
import domToImage from "dom-to-image";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import { BookingType } from "@/lib/types";

interface Props {
  activeTicket: BookingType;
  setActiveTicket: (ticket: BookingType | null) => void;
}

const Ticket: React.FC<Props> = ({ activeTicket, setActiveTicket }) => {
  const ticketRef = useRef<HTMLDivElement>(null);

  const handleDownloadPNG = async () => {
    if (!ticketRef.current) return;
    try {
      const blob = await domToImage.toBlob(ticketRef.current, {
        bgcolor: "#ffffff",
      });
      saveAs(blob, "Movie_Ticket.png");
    } catch (err) {
      console.error("Failed to export ticket:", err);
    }
  };

  // 🔥 New helper to get payment status based on group plans
  const getTicketStatus = () => {
    if (activeTicket.groupPlan) {
      if (activeTicket.groupPlan.paymentStatus === "singlePaid") {
        return { valid: true, message: "✅ Paid by group creator" };
      }

      if (activeTicket.groupPlan.paymentStatus === "split") {
        const currentUserId =
          typeof activeTicket.user === "string"
            ? activeTicket.user
            : activeTicket.user?._id?.toString();

        const userSplit = activeTicket.groupPlan.splitDetails?.find(
          (s) => s.user?.toString() === currentUserId
        );

        if (userSplit?.paid) {
          return { valid: true, message: "✅ You paid your split" };
        } else {
          return {
            valid: false,
            message: "⚠️ You still need to pay your split",
          };
        }
      }
    }

    // fallback to normal
    return {
      valid: activeTicket.paymentStatus === "paid",
      message:
        activeTicket.paymentStatus === "paid"
          ? "✅ Confirmed"
          : activeTicket.paymentStatus === "pending"
          ? "🕒 Pending"
          : "❌ Cancelled",
    };
  };

  const ticketStatus = getTicketStatus();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center px-4">
      <div className="bg-white text-black p-6 rounded-xl w-full max-w-md shadow-2xl">
        <h3 className="text-2xl font-bold mb-4 text-center">
          {ticketStatus.valid
            ? "🎫 Your Valid Ticket"
            : "🕐 Temporary Ticket (Pending)"}
        </h3>

        <div
          ref={ticketRef}
          style={{
            backgroundColor: "#ffffff",
            color: "#000000",
            padding: "20px",
            borderRadius: "10px",
            border: "2px dashed #333333",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <h4 style={{ fontSize: "18px", fontWeight: "bold" }}>
            🎬 {activeTicket.movie?.movie?.title}
          </h4>
          <p>
            <strong>Booking ID:</strong> {activeTicket._id}
          </p>
          <p>
            <strong>Seats:</strong> {activeTicket.seats.join(", ")}
          </p>
          <p>
            <strong>Total Price:</strong> ₹{activeTicket.totalPrice}
          </p>
          <p>
            <strong>Booked On:</strong>{" "}
            {dayjs(activeTicket.createdAt).format("MMM D, YYYY h:mm A")}
          </p>
          <p>
            <strong>Status:</strong> {ticketStatus.message}
          </p>

          {ticketStatus.valid ? (
            <p style={{ color: "#2e7d32", marginTop: "10px" }}>
              ✅ Valid Ticket – Issued.
            </p>
          ) : (
            <p style={{ color: "#d32f2f", marginTop: "10px" }}>
              ⚠️ Not valid until paid.
            </p>
          )}

          {activeTicket.groupPlan && (
            <div
              style={{
                marginTop: "10px",
                padding: "10px",
                border: "1px solid #666",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <p style={{ fontWeight: "bold" }}>👥 Group Booking Details:</p>
              <p>
                <strong>Invite Link:</strong>{" "}
                {activeTicket.groupPlan.inviteLink}
              </p>
              <p>
                <strong>Payment Type:</strong>{" "}
                {activeTicket.groupPlan.paymentStatus}
              </p>

              {activeTicket.groupPlan.paymentStatus === "singlePaid" && (
                <p>💰 Paid by group creator.</p>
              )}

              {activeTicket.groupPlan.paymentStatus === "split" &&
                (() => {
                  const currentUserId =
                    typeof activeTicket.user === "string"
                      ? activeTicket.user
                      : activeTicket.user?._id?.toString();

                  const userSplit = activeTicket.groupPlan.splitDetails?.find(
                    (s) =>
                      typeof s.user === "string"
                        ? s.user === currentUserId
                        : s.user._id === currentUserId
                  );

                  return (
                    <p>
                      💸 Split: ₹{userSplit?.amount} -{" "}
                      {userSplit?.paid ? "✅ Paid" : "⚠️ Not paid"}
                    </p>
                  );
                })()}
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-between mt-6 gap-2">
          <button
            onClick={() => setActiveTicket(null)}
            className="px-4 py-2 border rounded hover:bg-gray-200"
          >
            Close
          </button>

          {ticketStatus.valid && (
            <button
              onClick={handleDownloadPNG}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              ⬇️ Download Ticket
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ticket;
