"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Mail, Phone, Shield } from "lucide-react";
import { UserType } from "@/lib/types";
import Image from "next/image";
import Loading from "@/components/common/Loading";

const Page = () => {
  const [userList, setUserList] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserList = async () => {
    try {
      const { data } = await axios.get(`/api/admin/usersList`);
      if (data.success) {
        setUserList(data.usersList);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("❌ Error fetching user list:", error);
      toast.error("Error fetching user list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const roleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-600";
      case "owner":
        return "bg-yellow-500";
      default:
        return "bg-green-600";
    }
  };

  return (
    <div className="p-6 text-white min-h-screen bg-[#0f0f0f]">
      <h2 className="text-3xl font-bold mb-6">👥 All Users</h2>

      {loading ? (
        <Loading />
      ) : userList.length === 0 ? (
        <p className="text-gray-400">No users found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userList.map((user) => (
            <div
              key={user._id}
              className="bg-gray-900 rounded-xl p-5 shadow border border-gray-700 flex flex-col gap-3"
            >
              <div className="flex items-center gap-4">
                {/* <Image
                  src={user.image}
                  alt={user.name}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full border border-gray-600 object-cover"
                /> */}
                <div>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full text-white ${roleColor(
                      user.role
                    )}`}
                  >
                    {user.role.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-300 space-y-1 mt-2">
                <p className="flex items-center gap-2">
                  <Mail size={14} /> {user.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={14} /> {user.phoneNumber}
                </p>
                <p className="flex items-center gap-2">
                  <Shield size={14} /> Joined on{" "}
                  <span className="text-white font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
