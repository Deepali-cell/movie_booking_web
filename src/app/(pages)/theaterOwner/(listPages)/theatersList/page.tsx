"use client";
import {
  useDeleteTheaterMutation,
  useGetTheatersQuery,
} from "@/app/serveces/theaterApi";
import TheaterCard from "@/components/ownerComponents/cardComponents/TheaterCard";
import { TheaterType } from "@/lib/types";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const TheaterList = () => {
  const { data, isLoading } = useGetTheatersQuery();
  const [deleteTheater] = useDeleteTheaterMutation();
  const router = useRouter();

  const handleDelete = async (theaterId: string) => {
    try {
      await deleteTheater(theaterId).unwrap();
      toast.success("Deleted theater successfully");
    } catch (err) {
      console.error(err);
      toast.error("❌ Delete failed");
    }
  };

  const theaterList = data?.theaters || [];

  return (
    <div className="space-y-8 px-4 py-6">
      {isLoading ? (
        <div>Loading theaters...</div>
      ) : (
        theaterList.map((theater: TheaterType) => (
          <TheaterCard
            key={theater._id}
            theater={theater}
            onEdit={() =>
              router.push(`/theaterOwner/editTheater/${theater._id}`)
            }
            onDelete={() => handleDelete(theater._id)}
          />
        ))
      )}
    </div>
  );
};

export default TheaterList;
