import HeroSection from "@/components/common/HeroSection";
import AllTheaters from "@/components/common/AllTheaters";
import { StateHydrator } from "@/components/StateHydrator";
import axios from "axios";

async function getAllTheaters() {
  const BASE_URL = "http://localhost:3000";
  try {
    const { data } = await axios.get(`${BASE_URL}/api/allTheaters`);
    return data.list || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Page() {
  const theaters = await getAllTheaters();

  return (
    <StateHydrator theaters={theaters}>
      <HeroSection />
      <AllTheaters alltheaterList={theaters} />
    </StateHydrator>
  );
}
