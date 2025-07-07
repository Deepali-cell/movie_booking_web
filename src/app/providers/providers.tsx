// src/components/Providers.tsx
"use client";
import { ClerkProvider } from "@clerk/nextjs";
import { Provider as ReduxProvider } from "react-redux";
import { StateContextProvider } from "@/context/StateContextProvider";
import { store } from "@/lib/store";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ReduxProvider store={store}>
        <StateContextProvider>
          {children}
          <Toaster />
        </StateContextProvider>
      </ReduxProvider>
    </ClerkProvider>
  );
}
