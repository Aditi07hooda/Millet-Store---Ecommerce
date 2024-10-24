"use client";
import React, { useState, useEffect } from "react";
import { getSessionId } from "@/store/LocalStorage";
import Button from "@/components/UI/Button";
import { MdAddCall } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { fetchCartItemsAsync } from "../../store/slices/cart";
import Image from "next/image";
import useRazorpay from "react-razorpay-integration";

export default function Checkout() {
  const dispatch = useDispatch();
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const brand_id = process.env.NEXT_PUBLIC_BRAND_ID;
  const { Razorpay } = useRazorpay();

  const cartItems = useSelector((state) => state.cart.items);

  const [state, setState] = useState({
    addresses: [],
    selectedAddress: null,
    checkoutDetails: null, // Initialize as null to check for data availability
    loading: false,
    error: null,
    order_id: "",
    isPaymentFailure: false,
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
      console.error("Error fetching address in checkout: ", error);
    }
  };

  const handleCheckoutDetails = async () => {
    try {
      const res = await fetch(`${base_url}/store/${brand_id}/auth/checkout`, {
        method: "GET",
        headers: {
          session: getSessionId(),
        },
      });
      if (!res.ok) throw new Error("Failed to fetch checkout details");
      const data = await res.json();
      setState((prev) => ({
        ...prev,
        checkoutDetails: data,
      }));
    } catch (error) {
      console.error("Error fetching checkout details: ", error);
    }
  };

  console.log("selected address : ", state.selectedAddress)

  const handleStartPayment = async () => {
    try {
        const res = await fetch(`${base_url}/store/${brand_id}/auth/checkout/payment?address_id=${state.selectedAddress.id}`,{
            method: "POST",
            headers: {
                session: getSessionId(),
            },
        })
        if (!res.ok) throw new Error("Failed to start payment");
        const data = await res.json();
        console.log("Payment started", data);
        setState((prev) => ({
         ...prev,
          loading: true,
          order_id: data.order_id,
        }));
        // Redirect to Razorpay checkout page
        const options = {
          key: process.env.RAZORPAY_KEY,
          amount: state.checkoutDetails.total_amount * 100, // amount should be in paise
          currency: "INR",
          name: "Millets",
          order_id: state.order_id,
          description: "Millets Store",
          image: `${base_url}/static/logo.png`,
          handler: handlePaymentComplete,
          prefill: {
            name: state.checkoutDetails.customer_name,
            email: state.checkoutDetails.customer_email,
            contact: state.checkoutDetails.customer_contact,
          },
        };
        const razorpay = new Razorpay(options);
        razorpay.open();


    } catch (error) {
      console.error("Error starting payment: ", error);
      setState((prev) => ({
        ...prev,
        isPaymentFailure: true,
        error: "Payment failed",
      }));
    }
  };

  const handlePaymentComplete = async (r) => {
    try {
      const res = await fetch(
        `${base_url}/store/${brand_id}/auth/checkout/payment/complete`,
        {
          method: "POST",
          headers: {
            session: getSessionId(),
          },
          body: JSON.stringify(r),
        }
      );

      if (!res.ok) throw new Error("Failed to complete payment");

      const data = await res.json();
      console.log("payment completed", data);

      setState((prev) => ({
        ...prev,
        loading: false,
      }));

      if (typeof window !== "undefined") {
        localStorage.setItem("order", JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error completing payment: ", error);
      setState((prev) => ({
        ...prev,
        isPaymentFailure: true,
        error: "Payment failed",
      }));
    }
  };

  useEffect(() => {
    handleGetAddress();
    handleCheckoutDetails();
    dispatch(fetchCartItemsAsync());
  }, [dispatch]);

  const handleSelectAddress = (address) => {
    setState((prevState) => ({
      ...prevState,
      selectedAddress: address,
    }));
  };

  return (
    <div className="flex flex-col w-full p-4 lg:p-8">
      <h2 className="text-2xl font-semibold mb-6">Checkout</h2>

      {/* Address Selection */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Select Address</h2>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {state.addresses.map((address) => (
            <div
              key={address.id}
              className={`border p-4 rounded-lg bg-gray-50 shadow-md flex justify-between items-start gap-4 ${
                state.selectedAddress?.id === address.id
                  ? "border-2 border-green-500"
                  : ""
              }`}
            >
              <div>
                <p className="text-gray-700 font-bold capitalize">
                  {address.person}
                </p>
                <p className="text-gray-600 flex items-center gap-2 font-semibold">
                  <MdAddCall className="text-xl" /> {address.mobile}
                </p>
                <p className="text-gray-600">
                  {address.door}, {address.apartment}, {address.landmark}
                </p>
                <p className="text-gray-600">
                  {address.city}, {address.pinCode}
                </p>
              </div>
              <Button
                text="Select"
                onClick={() => handleSelectAddress(address)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Items Display */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Items</h2>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {cartItems.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="border p-4 rounded-lg flex items-center gap-4 bg-white shadow-md"
              >
                <Image
                  src={item.image || ""}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                  width={80}
                  height={80}
                />
                <div className="flex flex-col justify-between">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gray-600 text-sm">
                    Size: {item.variantName}
                  </p>
                  <div className="text-lg font-bold text-gray-800">
                    Rs. {(item.price * item.qty).toFixed(2)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Total Bill */}
      {state.checkoutDetails && (
        <div className="border p-4 rounded-lg mt-6 bg-gray-50 shadow-md">
          <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span>{cartItems.length} items</span>
              <span>Rs. {state.checkoutDetails.orderValue?.toFixed(2)}</span>
            </li>
            <li className="flex justify-between">
              <span>Discount</span>
              <span>Rs. {state.checkoutDetails.discountAmt?.toFixed(2)}</span>
            </li>
            <li className="flex justify-between">
              <span>After Discount</span>
              <span>
                Rs. {state.checkoutDetails.orderValAfterDiscount?.toFixed(2)}
              </span>
            </li>
            <li className="">
              <div className="flex justify-between">
                <span>Shipping Charges</span>
                <span>
                  Rs. {state.checkoutDetails.shippingCharges?.toFixed(2)}
                </span>
              </div>
              <p className="flex items-end justify-end">
                {state.checkoutDetails.orderValue?.toFixed(2) < 699 && (
                  <p className="text-gray-500">
                    Free shipping applied for orders above Rs. 699 in Bangalore
                  </p>
                )}
              </p>
            </li>
            <li className="flex justify-between border-t pt-2 font-bold">
              <span>Total</span>
              <span>
                Rs. {state.checkoutDetails.totalOrderValue?.toFixed(2)}
              </span>
            </li>
          </ul>
        </div>
      )}

      {/* note */}
      <div className="my-3 border-2 bg-secondary bg-opacity-50 p-2 rounded-md border-secondary">
        <h5 className="text-[17px] font-semibold">Please Note :</h5>
        <p className="text-gray-600 text-sm leading-relaxed">
          Orders on Shipped within 2 working days.
          <br /> Orders may take Upto 7 working days to be delivered after
          shipping.
          <br /> Our Working Days are Monday to Saturday.
          <br /> We are Closed on Sunday.
          <br /> Our Working Hours are 9AM to 6PM.
          <br /> For Any enquiries about your order you can Call/WhatsApp us on
          6362033034.
        </p>
      </div>

      {/* Checkout Button */}
      <Button
        text="Pay & Place Order"
        onClick={() => {
          // Redirect to checkout page with selected address
          // (Assuming checkout page is a separate component)
          // window.location.href = "/checkout";
        }}
        disabled={state.selectedAddress === null || cartItems.length === 0}
      />
    </div>
  );
}
