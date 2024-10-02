import React, { useState } from 'react';
import Button from './UI/Button';

const User = () => {
  const [formData, setFormData] = useState({
    Profile : {
        name: '',
        email: '',
        phone: '',
    },
    Address: {
        street: '',
        city: '',
        state: '',
        Pincode: '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // handle profile save logic here
    console.log('Profile saved:', formData);
  };

  return (
    <>
      <div className="w-full max-w-md px-6 bg-white rounded-lg py-8 my-9">
        <h2 className="text-2xl font-semibold text-center mb-6">My Account</h2>
        <div className="flex justify-center">
          <ul className="flex space-x-6">
            <li className="cursor-pointer border-b-2 border-black">Profile</li>
            <li className="cursor-pointer text-primary">Addresses</li>
            <li className="cursor-pointer text-primary">Orders</li>
          </ul>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.Profile.name}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.Profile.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.Profile.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <Button
            type="submit"
            text='Save Profile'
          />
        </form>
      </div>
    </>
  );
};

export default User;
