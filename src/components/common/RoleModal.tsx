"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RoleModal({ isOpen, onClose }: RoleModalProps) {
  const [role, setRole] = useState("user");
  const [secretCode, setSecretCode] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post("/api/assignRole", {
        role,
        secretCode,
      });
      if (data.success) {
        localStorage.setItem("role", data.role);
        toast.success(`You are successfully logged in as ${data.role}`);
        onClose();
        // 👇 Redirect based on role
        if (data.role === "admin") router.push("/admin/dashboard");
        else if (data.role === "owner") router.push("/theaterOwner/dashboard");
        else router.push("/");
      }
    } catch (err: any) {
      toast.error("Failed: " + err.response?.data?.message || "Error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl text-black">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Select Your Role
        </h2>

        <select
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="user">User</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>

        {(role === "owner" || role === "admin") && (
          <input
            type="text"
            placeholder="Enter secret code"
            value={secretCode}
            onChange={(e) => setSecretCode(e.target.value)}
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        )}

        <div className="flex justify-between gap-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
