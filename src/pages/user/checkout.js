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

  const cartItems = useSelector((state) => state.cart.items);
  const [Razorpay] = useRazorpay();
  const [state, setState] = useState({
    addresses: [],
    selectedAddress: null,
    checkoutDetails: null,
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

  const handleStartPayment = async () => {
    try {
      if (!state.selectedAddress) {
        throw new Error("Please select an address.");
      }

      const res = await fetch(
        `${base_url}/store/${brand_id}/auth/checkout/payment?address_id=${state.selectedAddress.id}`,
        {
          method: "POST",
          headers: {
            session: getSessionId(),
          },
        }
      );
      if (!res.ok) throw new Error("Failed to start payment");

      const data = await res.json();
      setState((prev) => ({
        ...prev,
        loading: true,
        order_id: data.order_id,
      }));

      data["handler"] = async (response) => {
        await handlePaymentComplete(response);
      };
      data["modal"] = {
        ondismiss: async () => {
          console.log("payment window dismissed");
          await enablePayBtn("payment abandoned", null);
        },
      };

      let rzp1 = new Razorpay(data);
      rzp1.on("payment.failed", async (response) => {
        console.error("Payment failed:", response.error.code);
        console.error("payment error", response.error.description);
        console.error("payment error", response.error.source);
        console.error("payment error", response.error.step);
        console.error("payment error", response.error.reason);
        console.error("payment error", response.error.metadata.order_id);
        console.error("payment error", response.error.metadata.payment_id);
        await handlePaymentCancel(
          "payment failed",
          response.error.metadata.order_id
        );
      });

      rzp1.open();
      console.log("Payment started");
    } catch (error) {
      console.error("Error starting payment: ", error);
      setState((prev) => ({
        ...prev,
        isPaymentFailure: true,
        error: "Payment failed",
      }));
    }
  };

  const handlePaymentComplete = async (response) => {
    try {
      const res = await fetch(
        `${base_url}/store/${brand_id}/auth/checkout/payment/complete`,
        {
          method: "POST",
          headers: {
            session: getSessionId(),
          },
          body: JSON.stringify(response),
        }
      );
      if (!res.ok) throw new Error("Failed to complete payment");

      const data = await res.json();
      console.log("Payment completed", data);

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

  const enablePayBtn = async (reason, order) => {
    console.log("Enable Payment Button again for", reason, order);
    await handlePaymentCancel(reason, order);
  };

  const handlePaymentCancel = async (reason, orderId) => {
    try {
      const payload = { reason, orderId };
      const res = await fetch(
        `${base_url}/store/${brand_id}/auth/checkout/payment`,
        {
          method: "DELETE",
          headers: {
            session: getSessionId(),
          },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error("Failed to cancel payment");
      const data = await res.json();
      console.log("Payment cancelled", data);
      setState((prevState) => ({
        ...prevState,
        isPaymentFailure: false,
        loading: false,
        error: "Payment Cancelled",
      }));
    } catch (error) {
      console.error("Payment cannot be cancelled", error);
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
      <div className="cursor-default">
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
      <div className="mt-6 cursor-default">
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
        <div className="border p-4 rounded-lg mt-6 bg-gray-50 shadow-md cursor-default">
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
              <span>Shipping Charges</span>
              <span>
                Rs. {state.checkoutDetails.shippingCharges?.toFixed(2)}
              </span>
            </li>
            <li className="flex justify-between">
              <strong>Total Payable</strong>
              <strong>
                Rs. {state.checkoutDetails.totalOrderValue?.toFixed(2)}
              </strong>
            </li>
          </ul>
        </div>
      )}

      {/* Payment Button */}
      <Button
        text={state.loading ? "Processing..." : "Place Order"}
        onClick={handleStartPayment}
        disabled={state.loading}
      />
    </div>
  );
}
