import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import store from "../store/store";
import { Provider } from 'react-redux';
import { useEffect, useState } from "react";
import Loader from "@/components/UI/Loader";
import MobileBottomNavbar from "@/components/UI/MobileBottomNavbar";
import Footer from "@/components/Footer";

export default function App({ Component, pageProps }) {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const brand_id = process.env.NEXT_PUBLIC_BRAND_ID;

  const [sessionId, setSessionId] = "";
  const [loading, setLoading] = useState(true);

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
      setSessionId(data.session);
      localStorage.setItem("sessionId", data.session);
    } catch (error) {
      console.error("Error fetching session:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      fetchSession();
    } else {
      setLoading(false); 
    }
  }, []);

  if (loading) return <Loader />;

  return (
    <Provider store={store}>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
      <MobileBottomNavbar />
    </Provider>
  );
}
