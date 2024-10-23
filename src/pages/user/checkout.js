"use client";
import React, { useState, useEffect } from "react";
import { getSessionId } from "@/store/LocalStorage";
import Button from "@/components/UI/Button";
import { MdAddCall } from "react-icons/md";

export default function checkout() {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const brand_id = process.env.NEXT_PUBLIC_BRAND_ID;
  const [state, setState] = useState({
    addresses: [],
    selectedAddress: null,
    checkoutDetails: "",
  });

  const handleGetAddress = async () => {
    try {
      const res = await fetch(`${base_url}/store/${brand_id}/auth/address`, {
        method: "GET",
        headers: {
          session: getSessionId(),
        },
      });
      if (!res.ok) throw new Error("Failed to fetch addresses");
      const data = await res.json();
      setState((prevState) => ({
        ...prevState,
        addresses: data,
      }));
    } catch (error) {
      console.error("Error fetching address in checkout ", error);
    }
  };

  const handleCheckoutDetails = async() => {
    try {
      const res = await fetch(`${base_url}/store/${brand_id}/auth/checkout`, {
        method: "GET",
        headers: {
          session: getSessionId(),
        },
      });
      if (!res.ok) throw new Error("Failed to checkout");
      const data = await res.json();
      console.log(data);
      setState((prev)=>({
        ...prev,
        checkoutDetails: data,
      }))
    } catch (error) {
      console.error("Error checking out in checkout ", error);
    }
  }

  useEffect(() => {
    handleGetAddress();
    handleCheckoutDetails();
  }, []);

  const handleSelectAddress = (address) => {
    setState((prevState) => ({
      ...prevState,
      selectedAddress: address,
    }));
  };

  return (
    <>
      <h2>Checkout</h2>
      <div className="w-full lg:w-1/2">
        <h2 className="text-xl font-semibold mb-4">Select Address</h2>
        {/* card for each address and button to select address */}
        {state.addresses.map((address) => (
          <div
            key={address.id}
            className={`border p-4 rounded-lg bg-gray-50 shadow-md ${state.selectedAddress ? "focus:border-2 focus:border-green-500" : ""}`}
          >
            <p className="text-gray-700 font-bold capitalize">
              {address.person}
            </p>
            <p className="text-gray-600 flex flex-wrap gap-2 align-middle font-semibold">
              <MdAddCall className="text-xl" /> {address.mobile}
            </p>
            <p className="text-gray-600">
              {address.door}, {address.apartment}, {address.landmark}
            </p>
            <p className="text-gray-600">
              {address.city}, {address.pinCode}
            </p>
            <Button
              text="Select"
              onClick={() => handleSelectAddress(address)}
            />
          </div>
        ))}
      </div>
    </>
  );
}
