"use client";

import { useEffect, useState } from "react";
import RoleModal from "@/components/common/RoleModal";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import Loading from "@/components/common/Loading";

export default function RoleCheckPage() {
  const { user, isLoaded } = useUser();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      setLoading(false);
      return;
    }

    const checkRole = async () => {
      try {
        const res = await axios.get(`/api/checkRole?id=${user.id}`);
        if (!res.data.role) {
          setOpen(true);
          setLoading(false);
        } else {
          localStorage.setItem("role", res.data.role);

          // ✅ Redirect based on role
          if (res.data.role === "admin") router.push("/admin/dashboard");
          else if (res.data.role === "owner")
            router.push("/theaterOwner/dashboard");
          else router.push("/");
        }
      } catch (err) {
        console.error("Error checking role:", err);
        setLoading(false);
      }
    };

    checkRole();
  }, [user, isLoaded, router]);

  const handleSuccess = () => {
    setOpen(false);
    router.push("/");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="pt-20">
      <RoleModal isOpen={open} onClose={handleSuccess} />
    </div>
  );
}
