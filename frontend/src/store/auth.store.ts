import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { IUser } from "./types";

interface AuthState {
  authUser: IUser | null;
  requestLoading: boolean;
  loginWithToken: (token: string) => void;
  getUser: () => any;
  logout: (navigate?: (path: string) => void) => void; // <-- update type
  setRequestLoading: (isLoading: boolean) => void;
}

// Remove useNavigate() from here

export const authStore = create<AuthState>((set) => ({
  authUser: null,
  requestLoading: false,
  loginWithToken: (token: string) => {
    try {
      const decoded = jwtDecode(token) as any;
      const user = {
        id: decoded.id,
        first_name: decoded.first_name,
        last_name: decoded.last_name,
        email: decoded.email,
        photo: decoded.photo,
        provider: decoded.provider,
        verified: decoded.verified,
      };
      localStorage.setItem("auth_token", token);
      set({ authUser: user });
    } catch {
      localStorage.removeItem("auth_token");
      set({ authUser: null });
    }
  },
  getUser: () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      return null;
    }
    const decoded = jwtDecode(token) as any;
    const user = {
      id: decoded.id,
      first_name: decoded.first_name,
      last_name: decoded.last_name,
      email: decoded.email,
      photo: decoded.photo,
      provider: decoded.provider,
      verified: decoded.verified,
    };
    set({ authUser: user });
    return token;
  },
  logout: (navigate) => {
    localStorage.removeItem("auth_token");
    set({ authUser: null });
    if (navigate) {
      navigate('/signin');
    }
  },
  setRequestLoading: (isLoading: boolean) => {
    set({ requestLoading: isLoading });
  },
}));