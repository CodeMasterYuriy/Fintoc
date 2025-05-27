import { useAppStore } from "../../../store";
import axios from "axios";

const endpoint = import.meta.env.VITE_SERVER_ENDPOINT;

const {
    getUser,
} = useAppStore.authStore.getState();

export const handlePaypalSubscription = async (
  setLoading: (b: boolean) => void,
  setError: (e: string) => void
) => {
  try {
    setLoading(true);
    setError("");
    const token = getUser();
    const price = 30;
    console.log("Token:", token);
    window.location.href = `${endpoint}/api/paypal/subscription/authorize?token=${token}&price=${price}`;
  } catch (err: any) {
    console.error(err);
    setError("Error authorizing PayPal subscription.");
  } finally {
    setLoading(false);
  }
};