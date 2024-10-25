import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import store from "../store/store";
import {Provider} from 'react-redux';
import {useEffect, useState} from "react";
import Loader from "@/components/UI/Loader";
import MobileBottomNavbar from "@/components/UI/MobileBottomNavbar";
import Footer from "@/components/Footer";
import { getSessionId, setBannerMobileImage, setBannerWebImage, setSessionId } from "@/store/LocalStorage";

export default function App({Component, pageProps}) {
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;
    const brand_id = process.env.NEXT_PUBLIC_BRAND_ID;

    const [loading, setLoading] = useState(true);
    const session = getSessionId();

    const fetchSession = async () => {
        setLoading(true);

        try {
            if (!session) {
                const response = await fetch(`${base_url}/store/${brand_id}/init`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setSessionId(data.session);
                    console.log("session data",data.brand.banners[0].name)
                    setBannerWebImage(data.brand.banners[0]);
                    setBannerMobileImage(data.brand.bannersForMobile[0]);
                }
            }
        } catch (error) {
            console.error("Error fetching session:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSession();
    }, []);

    if (loading) return <Loader/>;

    return (
        <Provider store={store}>
            <Navbar/>
            <Component {...pageProps} />
            <Footer/>
            <MobileBottomNavbar/>
        </Provider>
    );
}
