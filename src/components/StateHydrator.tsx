"use client";

import { useEffect } from "react";

import { TheaterType } from "@/lib/types";
import { useStateContext } from "@/context/StateContextProvider";

export const StateHydrator = ({
  theaters,
  children,
}: {
  theaters: TheaterType[];
  children: React.ReactNode;
}) => {
  const { hydrateAllTheaters } = useStateContext();

  useEffect(() => {
    if (theaters?.length) {
      hydrateAllTheaters(theaters);
    }
  }, [theaters]);

  return <>{children}</>;
};
