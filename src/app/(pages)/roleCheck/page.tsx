"use client";
import { useEffect, useState } from "react";
import RoleModal from "@/components/RoleModal"; // tu yeh modal bana raha hai
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RoleCheckPage() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    // Check if role is already set in DB
    const checkRole = async () => {
      try {
        const res = await axios.get(`/api/checkRole?id=${user.id}`);
        if (!res.data.role) {
          setOpen(true); // Modal khol
        } else {
          router.push("/"); // Role already set => redirect to home
        }
      } catch (err) {
        console.error("Error checking role:", err);
      }
    };

    checkRole();
  }, [user]);

  const handleSuccess = () => {
    setOpen(false);
    router.push("/"); // Modal band ho and redirect
  };

  return (
    <div>
      <RoleModal isOpen={open} onClose={handleSuccess} />
    </div>
  );
}
