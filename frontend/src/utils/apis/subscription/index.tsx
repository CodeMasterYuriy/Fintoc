import { useAppStore } from "../../../store";
import axios from "axios";
const endpoint = import.meta.env.VITE_SERVER_ENDPOINT;

const {
    getUser,
} = useAppStore.authStore.getState();

export const handlePaypalSubscription = async (
) => {
  try {
    const token = getUser();
    const price = 30;
    const name = "Pro Plan";

    const { data } = await axios.post(
      `${endpoint}/api/paypal/subscription`,
      { name, price },
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    return data;
  } catch (err: any) {
    console.error("Error authorizing PayPal subscription:", err);
    throw err;
  } finally {
  }
};


export const getSubscriptionInformation = async () => {
  try {
    const token = getUser();

    const { data } = await axios.get(`${endpoint}/api/paypal/subscription`, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    return data;
  } catch (err: any) {
    console.error("Error fetching subscription information:", err);
    throw err;
  }
};
