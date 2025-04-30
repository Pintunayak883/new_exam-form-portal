"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthFromStorage } from "@/redux/authSlice";

export default function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAuthFromStorage()); // Bhool gaya tha login? Yaad dila diya!
  }, []);

  return null; // Koi UI nahi chahiye, bas background me kaam karega
}
