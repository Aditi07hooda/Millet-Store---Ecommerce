import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import store from "../store/store";
import { Provider } from 'react-redux';
import MobileBottomNavbar from "@/components/UI/MobileBottomNavbar";

export default function App({ Component, pageProps }) {
  return(
    <>
    <Provider store={store}>
      <Navbar />
      <Component {...pageProps} />
      <MobileBottomNavbar />
    </Provider>
    </>
  );
}
