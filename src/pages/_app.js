import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import store from "../store/store";
import { Provider } from 'react-redux';
import { useEffect, useState } from "react";
import MobileBottomNavbar from "@/components/UI/MobileBottomNavbar";

export default function App({ Component, pageProps }) {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const brand_id = process.env.NEXT_PUBLIC_BRAND_ID;

  const [sessionId, setSessionId] = useState("");

  const fetchSession = async () => {
    try {
      const response = await fetch(`${base_url}/store/${brand_id}/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch session: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      // console.log("Session Data:", data);

      setSessionId(data.session);
      localStorage.setItem("sessionId", data.session);
    } catch (error) {
      console.error("Error fetching session:", error);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  return (
    <>
      {sessionId ? (
        <Provider store={store}>
          <Navbar />
          <Component {...pageProps} />
          <MobileBottomNavbar />
        </Provider>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
