import React, { useState, useEffect } from "react";
import Button from "../UI/Button";
import { getSessionId } from "@/store/LocalStorage";

export default function UserAddress() {
  const [userFormData, setUserFormData] = useState({
    Address: {
      name: "",
      email: "",
      door: "",
      apartment: "",
      landmark: "",
      city: "",
      pincode: "",
      phone: "",
      id: null, // Used to track if we are editing an existing address
    },
    existingAddress: [],
    isAddressSaved: false,
  });

  const isSaveBtnDisabled =
    userFormData.Address.name === "" ||
    userFormData.Address.phone === "" ||
    userFormData.Address.door === "" ||
    userFormData.Address.apartment === "" ||
    userFormData.Address.address === "" ||
    userFormData.Address.landmark === "" ||
    userFormData.Address.pincode === "" ||
    userFormData.Address.city === "" ||
    userFormData.Address.email === "";

  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const brand_id = process.env.NEXT_PUBLIC_BRAND_ID;

  const handleChange = (e) => {
    const { name, value, dataset } = e.target;
    setUserFormData((prevFormData) => ({
      ...prevFormData,
      [dataset.section]: {
        ...prevFormData[dataset.section],
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userFormData.Address.id) {
      // Update the address if the ID exists
      updateAddress(userFormData.Address.id);
    } else {
      // Save a new address if no ID exists
      saveAddress();
    }
  };

  const saveAddress = async () => {
    const res = await fetch(`${base_url}/store/${brand_id}/auth/address`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        session: getSessionId(),
      },
      body: JSON.stringify(userFormData.Address),
    });
    if (!res.ok) {
      const errorMessage = await res.text();
      console.error(`Error: ${errorMessage}`);
      return;
    }
    const data = await res.json();
    console.log(data);

    setUserFormData((prevFormData) => ({
      ...prevFormData,
      existingAddress: [...prevFormData.existingAddress, userFormData.Address],
      Address: {
        name: "",
        email: "",
        door: "",
        apartment: "",
        landmark: "",
        city: "",
        pincode: "",
        phone: "",
        id: null,
      },
      isAddressSaved: true,
    }));
  };

  const fetchAddress = async () => {
    const res = await fetch(`${base_url}/store/${brand_id}/auth/address`, {
      headers: {
        session: getSessionId(),
      },
    });
    if (!res.ok) {
      const errorMessage = await res.text();
      console.error(`Error: ${errorMessage}`);
      return;
    }
    const data = await res.json();
    setUserFormData((prevFormData) => ({
      ...prevFormData,
      existingAddress: data,
    }));
  };

  const updateAddress = async (addressId) => {
    const res = await fetch(`${base_url}/store/${brand_id}/auth/address/${addressId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        session: getSessionId(),
      },
      body: JSON.stringify(userFormData.Address),
    });
    if (!res.ok) {
      const errorMessage = await res.text();
      console.error(`Error: ${errorMessage}`);
      return;
    }
    const data = await res.json();
    console.log(data);

    // Update the address in the existing list
    const updatedAddresses = userFormData.existingAddress.map((addr) =>
      addr.id === addressId ? userFormData.Address : addr
    );

    setUserFormData((prevFormData) => ({
      ...prevFormData,
      existingAddress: updatedAddresses,
      Address: {
        name: "",
        email: "",
        door: "",
        apartment: "",
        landmark: "",
        city: "",
        pincode: "",
        phone: "",
        id: null,
      },
      isAddressSaved: true,
    }));
  };

  const handleEditClick = (addressId) => {
    const addressToEdit = userFormData.existingAddress.find((addr) => addr.id === addressId);
    if (addressToEdit) {
      setUserFormData((prevFormData) => ({
        ...prevFormData,
        Address: { ...addressToEdit },
        isAddressSaved: false,
      }));
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between gap-8 py-6">
      {/* Existing Addresses */}
      <div className="w-full lg:w-1/2">
        <h2 className="text-xl font-semibold mb-4">Existing Addresses</h2>
        <div className="flex flex-col gap-4">
          {userFormData.existingAddress.length > 0 ? (
            userFormData.existingAddress.map((address, index) => (
              <div key={index} className="border p-4 rounded-lg bg-gray-50 shadow-md">
                <p className="text-gray-700 font-bold capitalize">{address.name}</p>
                <p className="text-gray-600">{address.phone}</p>
                <p className="text-gray-600">
                  {address.door}, {address.apartment}, {address.landmark}
                </p>
                <p className="text-gray-600">{address.city}, {address.pincode}</p>
                <Button
                  type="button"
                  text="Edit"
                  onClick={() => handleEditClick(address.id)}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500">No addresses found.</p>
          )}
        </div>
      </div>

      {/* Add / Edit Address */}
      <div className="w-full lg:w-1/2">
        <h2 className="text-xl font-semibold mb-4">
          {userFormData.Address.id ? "Edit Address" : "Add New Address"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "phone", "email", "door", "apartment", "address", "landmark", "city", "pincode"].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="text-gray-700 capitalize">{field}</label>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                data-section="Address"
                value={userFormData.Address[field]}
                onChange={handleChange}
                className="px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          ))}
          <Button
            type="submit"
            text={userFormData.Address.id ? "Update Address" : "Save Address"}
            disabled={isSaveBtnDisabled}
          />
          {userFormData.isAddressSaved && (
            <div className="text-green-500 mt-2">Address saved successfully!</div>
          )}
        </form>
      </div>
    </div>
  );
}