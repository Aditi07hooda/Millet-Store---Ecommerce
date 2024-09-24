import Header from "@/components/Header";
import Product from "@/components/Product";
import { useEffect, useState } from "react";
import useLocalStorage from "@/store/LocalStorage";

export default function Home() {

  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const brand_id = process.env.NEXT_PUBLIC_BRAND_ID;

  const [state, setState] = useState({
    sessionId: ""
  });

  const fetchSession = async () => {
    try {
      const response = await fetch(`${base_url}/store/${brand_id}/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setState((prev) => ({
        ...prev,
        sessionId: data.session
      }))
      localStorage.setItem("sessionId", state.sessionId);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchSession();
  }, [])

  return (
    <>
      {state.sessionId ? (
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <Header />
          <Product />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
