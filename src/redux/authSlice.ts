import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface AuthState {
  isAuthenticated: boolean;
  email: string | null;
  name: string | null;
  role: string;
  user: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  email: null,
  name: null,
  role: "candidate",
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.email = null;
      state.name = null;
      state.role = "candidate";
      state.user = null;
      Cookies.remove("token");
      Cookies.remove("token");
      Cookies.remove("authData");
    },
    setAuthFromStorage: (state) => {
      const token = Cookies.get("token");
      const authData = Cookies.get("authData");
      console.log("token form authslice", token);
      if (token && authData) {
        try {
          const parsed = JSON.parse(authData);
          state.isAuthenticated = true;
          state.email = parsed.email || null;
          state.name = parsed.name || null;
          state.role = parsed.role || "candidate";
          state.user = parsed.user;
        } catch (err) {
          console.error("Auth parse error:", err);
          state.isAuthenticated = false;
          state.email = null;
          state.name = null;
          state.role = "candidate";
          state.user = null;
        }
      } else {
        state.isAuthenticated = false;
        state.email = null;
        state.name = null;
        state.role = "candidate";
        state.user = null;
      }
    },
  },
});

export const { loginSuccess, logout, setAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;
