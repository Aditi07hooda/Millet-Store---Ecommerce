import React, { useState, useEffect } from "react";
import { getSessionId } from "@/store/LocalStorage";

export default function Orders() {
  const [orders, setOrders] = useState({
    orderList: [],
    orderDetails: [],
  });

  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const brand_id = process.env.NEXT_PUBLIC_BRAND_ID;

  // Fetch order list
  const getOrders = async () => {
    try {
      const response = await fetch(
        `${base_url}/store/${brand_id}/auth/orders`,
        {
          headers: {
            session: getSessionId(),
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched orders:", data);
      setOrders((prevData) => ({
        ...prevData,
        orderList: data || [],
      }));

      // Call function to fetch details for each order
      getOrderDetailsForAll(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // console.log("order details",orders.orderDetails[0].orderDateStr)

  // Fetch order details for a specific order
  const getOrderDetails = async (orderId) => {
    try {
      const response = await fetch(
        `${base_url}/store/${brand_id}/auth/orders/${orderId}`,
        {
          headers: {
            session: getSessionId(),
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  // Fetch details for all orders concurrently
  const getOrderDetailsForAll = async (orders) => {
    try {
      const detailsPromises = orders.map((order) => getOrderDetails(order.id));
      const details = await Promise.all(detailsPromises);
      setOrders((prevData) => ({
        ...prevData,
        orderDetails: details,
      }));
    } catch (error) {
      console.error("Error fetching all order details:", error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="orders-container max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>
      {orders.orderList.length > 0 ? (
        orders.orderList.map((order, index) => (
          <div
            key={index}
            className="order-item bg-gray-50 border border-gray-200 p-4 rounded-lg mb-6 shadow hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold text-gray-700">#{order.orderNo.replace("ORDER-","")}</p>
              <p className={`text-sm font-semibold ${order.status === 'Delivered' ? 'text-green-600' : 'text-red-600'}`}>
                {order.status}
              </p>
              <p className="text-sm text-gray-500">
                {order.date}
              </p>
            </div>
            <hr className="my-3" />
            {orders.orderDetails[index] && (
              <div className="order-detail mt-3">
                <p className="text-base font-medium text-gray-800">Items:</p>
                {orders.orderDetails[index].lineItems.map((item, i) => (
                  <div key={i} className="mt-2 ml-4">
                    <p className="text-sm">Product Name: <span className="font-medium">{item.product.name}</span></p>
                    <p className="text-sm">Quantity: <span className="font-medium">{item.qty}</span></p>
                    <p className="text-sm">Price: <span className="font-medium">Rs. {item.itemValue}</span></p>
                    <p className="text-sm">Size: <span className="font-medium">{item.variant.matrix.size || item.variant.matrix.Size}</span></p>
                    <hr className="my-2" />
                  </div>
                ))}
                <p className="text-sm font-semibold mt-3">Total Amount: <span className="text-green-600">Rs. {orders.orderDetails[index].netValue}</span></p>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No orders found.</p>
      )}
    </div>
  );
}