import React, { useState, useEffect } from "react";
import Button from "../UI/Button";
import { getSessionId } from "@/store/LocalStorage";
import { MdAddCall } from "react-icons/md";

export default function UserAddress() {
  const [userFormData, setUserFormData] = useState({
    Address: {
      name: "",
      email: "",
      door: "",
      apartment: "",
      landmark: "",
      city: "",
      pinCode: "",
      phone: "",
      address: "",
      id: null, // Used to track if we are editing an existing address
    },
    existingAddress: [],
    isAddressSaved: false,
  });

  const isSaveBtnDisabled = !Object.values(userFormData.Address).every(
    (field) => field !== "" || field === null 
  );

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userFormData.Address.id) {
      await updateAddress(userFormData.Address.id);
    } else {
      await saveAddress();
    }
  };

  const saveAddress = async () => {
    console.log("save address", userFormData.Address);
    const res = await fetch(`${base_url}/store/${brand_id}/auth/address`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        session: getSessionId(),
      },
      body: JSON.stringify({
        ...userFormData.Address,
        pincode: userFormData.Address.pinCode,
        name: userFormData.Address.name,
        phone: userFormData.Address.phone,
      }),
    });

    if (!res.ok) {
      const errorMessage = await res.text();
      console.error(`Error: ${errorMessage}`);
      return;
    }

    const data = await res.json();
    console.log(data);

    // Clear the form data after saving
    resetForm();
    setUserFormData((prevFormData) => ({
      ...prevFormData,
      existingAddress: [...prevFormData.existingAddress, userFormData.Address],
      isAddressSaved: true,
    }));
  };

  const updateAddress = async (addressId) => {
    console.log("update address ", userFormData.Address);
    const res = await fetch(
      `${base_url}/store/${brand_id}/auth/address/${addressId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          session: getSessionId(),
        },
        body: JSON.stringify({
          ...userFormData.Address,
          id: addressId,
        }),
      }
    );

    if (!res.ok) {
      const errorMessage = await res.text();
      console.error(`Error: ${errorMessage}`);
      return;
    }

    const data = await res.json();
    console.log(data);

    const updatedAddresses = userFormData.existingAddress.map((addr) =>
      addr.id === addressId ? userFormData.Address : addr
    );

    resetForm();
    setUserFormData((prevFormData) => ({
      ...prevFormData,
      existingAddress: updatedAddresses,
      isAddressSaved: true,
    }));
  };

  const resetForm = () => {
    setUserFormData((prevFormData) => ({
      ...prevFormData,
      Address: {
        name: "",
        email: "",
        door: "",
        apartment: "",
        landmark: "",
        city: "",
        pinCode: "",
        phone: "",
        address: "",
        id: null,
      },
      isAddressSaved: false,
    }));
  };

  const handleEditClick = (addressId) => {
    const addressToEdit = userFormData.existingAddress.find(
      (addr) => addr.id === addressId
    );
    if (addressToEdit) {
      setUserFormData((prevFormData) => ({
        ...prevFormData,
        Address: {
          ...addressToEdit,
          id: addressId,
          email: addressToEdit.email,
          name: addressToEdit.name,
          phone: addressToEdit.phone,
        },
        isAddressSaved: false,
      }));
    }
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

  const me = async () => {
    const response = await fetch(`${base_url}/store/${brand_id}/auth/me`, {
      headers: {
        session: getSessionId(),
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`Error: ${errorMessage}`);
      return;
    }

    const data = await response.json();
    console.log(data);

    // Set user details here
    setUserFormData((prev) => ({
      ...prev,
      Address: {
        email: data.email,
      },
    }));
  };

  useEffect(() => {
    fetchAddress();
    me();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between gap-8 py-6">
      {/* Existing Addresses */}
      <div className="w-full lg:w-1/2">
        <h2 className="text-xl font-semibold mb-4">Existing Addresses</h2>
        <div className="flex flex-col gap-4">
          {userFormData.existingAddress.length > 0 ? (
            userFormData.existingAddress.map((address, index) => (
              <div
                key={index}
                className="border p-4 rounded-lg bg-gray-50 shadow-md"
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
                {/* <Button
                  text="Edit"
                  onClick={() => handleEditClick(address.id)}
                /> */}
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
          {[
            "name",
            "email",
            "phone",
            "door",
            "apartment",
            "address",
            "landmark",
            "city",
            "pinCode",
          ].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="text-gray-700 capitalize">{field}</label>
              <input
                type="text"
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
            text={userFormData.Address.id ? "Update Address" : "Save Address"}
            disabled={isSaveBtnDisabled}
          />
        </form>
      </div>
    </div>
  );
}
