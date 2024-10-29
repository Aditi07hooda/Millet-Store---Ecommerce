import { useEffect } from "react";
import Header from "@/components/Header";
import Product from "@/components/Product";
import { useDispatch } from "react-redux";
import { fetchCartItemsAsync } from "@/store/slices/cart";

export default function Home() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCartItemsAsync());
  }, []);

  return (
    <>
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <Header />
        <Product />
      </div>
    </>
  );
}
