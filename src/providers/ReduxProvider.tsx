// src/providers/ReduxProvider.tsx
"use client"; // VERY IMPORTANT bhai!

import { Provider } from "react-redux";
import { ReactNode } from "react";
import { store } from "@/redux/store";

export default function ReduxProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
