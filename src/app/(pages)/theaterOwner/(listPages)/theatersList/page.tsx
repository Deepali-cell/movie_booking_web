"use client";
import TheaterCard from "@/components/ownerComponents/cardComponents/TheaterCard";
import { useStateContext } from "@/context/StateContextProvider";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const TheaterList = () => {
  const { theaterList, settheaterList } = useStateContext();
  const router = useRouter();
  
  const handleDelete = async (theaterId: string) => {
    try {
      const res = await axios.delete(
        `/api/owner/deleteTheater?theaterId=${theaterId}`
      );
      if (res.data.success) {
        toast.success(res.data.message);
        // Update frontend state by removing the deleted theater
        settheaterList((prev) => prev.filter((t) => t._id !== theaterId));
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Error deleting theater:", err);
      toast.error("❌ Something went wrong while deleting the theater.");
    }
  };

  return (
    <div className="space-y-8 px-4 py-6">
      {theaterList.map((theater, index) => (
        <TheaterCard
          key={index}
          theater={theater}
          onEdit={() => router.push(`/theaterOwner/editTheater/${theater._id}`)}
          onDelete={() => handleDelete(theater._id)}
        />
      ))}
    </div>
  );
};

export default TheaterList;
