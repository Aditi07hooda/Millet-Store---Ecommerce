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
      updateAddress(userFormData.Address.id);
    } else {
      saveAddress();
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
      body: JSON.stringify({...userFormData.Address,
        pincode : userFormData.Address.pinCode,
        name: userFormData.Address.person,
        phone: userFormData.Address.mobile,
      }),
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
    console.log("update address ",userFormData.Address);
    const res = await fetch(`${base_url}/store/${brand_id}/auth/address/${addressId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        session: getSessionId(),
      },
      body: JSON.stringify({
        name: userFormData.Address.name,
        phone: userFormData.Address.phone,
        door: userFormData.Address.door,
        apartment: userFormData.Address.apartment,
        landmark: userFormData.Address.landmark,
        city: userFormData.Address.city,
        pincode: userFormData.Address.pinCode,
        email: userFormData.Address.email,
        address: userFormData.Address.address,
        id: addressId,
      }),
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
        Address: {
            ...addressToEdit,
            id: addressId,
            email: userFormData.Address.email,
            name: addressToEdit.person,
            phone: addressToEdit.mobile,
         },
        isAddressSaved: false,
      }));
    }
  };

  const me = async() => {
    const response = await fetch(`${base_url}/store/${brand_id}/auth/me`, {
      headers: {
        "session": getSessionId(),
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
    setUserFormData((prev)=> {
        return {
         ...prev,
          Address: {
            email: data.email,
          },
        }
    })
  }

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
              <div key={index} className="border p-4 rounded-lg bg-gray-50 shadow-md">
                <p className="text-gray-700 font-bold capitalize">{address.person}</p>
                <p className="text-gray-600 flex flex-wrap gap-2 align-middle font-semibold"><MdAddCall className="text-xl" /> {address.mobile}</p>
                <p className="text-gray-600">
                  {address.door}, {address.apartment}, {address.landmark}
                </p>
                <p className="text-gray-600">{address.city}, {address.pinCode}</p>
                <Button
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
          {["person", "mobile", "door", "apartment", "address", "landmark", "city", "pinCode"].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="text-gray-700 capitalize">{field}</label>
              <input
                type="text"
                name={field}
                data-section="Address"
                value={userFormData.Address[field]}
                onChange={handleChange}
                className="px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                required = {field === "landmark" ? "" : "required"}
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