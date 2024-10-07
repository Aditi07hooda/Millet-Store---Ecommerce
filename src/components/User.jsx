import React, { useState, useEffect } from 'react';
import Button from './UI/Button';
import Loader from './UI/Loader';
import { useRouter } from 'next/router';

const User = () => {
  const [formData, setFormData] = useState({
    Profile: {
      name: '',
      email: '',
      mobile: '',
    },
    Address: {
      street: '',
      city: '',
      state: '',
      Pincode: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const brand_id = process.env.NEXT_PUBLIC_BRAND_ID;
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, dataset } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [dataset.section]: {
        ...prevFormData[dataset.section],
        [name]: value,
      },
    }));
  };

  const getUserProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${base_url}/store/${brand_id}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'session': `${localStorage.getItem('sessionId')}`,
        },
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        setError(`Error: ${response.status} ${errorMessage}`);
        setLoading(false);
        return;
      }
      const data = await response.json();
      setFormData((prevFormData) => ({
        ...prevFormData,
        Profile: {
          name: data.name,
          email: data.email,
          mobile: data.mobile,
        },
        Address: {
          street: data.street || '',
          city: data.city || '',
          state: data.state || '',
          Pincode: data.Pincode || '',
        },
      }));
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    getUserProfile();
    localStorage.setItem('userData', JSON.stringify(formData.Profile));
  }, []);

  const saveUserProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${base_url}/store/${brand_id}/auth/me`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sessionId')}`,
          'session': `${localStorage.getItem('sessionId')}`,
        },
        body: JSON.stringify({
          id: localStorage.getItem('sessionId'),
          name: formData.Profile.name,
          mobile: formData.Profile.mobile,
          email: formData.Profile.email,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        setError(`Error: ${response.status} ${errorMessage}`);
        return;
      }

      localStorage.setItem('userData', JSON.stringify(formData.Profile));
      console.log('User saved successfully:', formData.Profile);

      setFormData((prevFormData) => ({
        ...prevFormData,
        Profile: {
          name: '',
          email: '',
          mobile: '',
        },
      }));

      router.push('/');
    } catch (error) {
      setError('Error saving user profile.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveUserProfile();
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <>
    <div className="w-full max-w-md px-6 bg-white rounded-lg py-8 my-9">
      <h2 className="text-2xl font-semibold text-center mb-6">My Account</h2>
      <div className="flex justify-center mb-6">
        <ul className="flex space-x-6">
          <li className="cursor-pointer border-b-2 border-black">Profile</li>
          <li className="cursor-pointer text-primary">Addresses</li>
          <li className="cursor-pointer text-primary">Orders</li>
        </ul>
      </div>
      <form onSubmit={handleSubmit}>
        {/* Profile Fields */}
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            data-section="Profile"
            value={formData.Profile.name}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phone</label>
          <input
            type="text"
            name="mobile"
            data-section="Profile"
            value={formData.Profile.mobile}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            data-section="Profile"
            value={formData.Profile.email}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <Button
          type="submit"
          text="Save Profile"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
        />
      </form>
    </div>
    
    </>
  );
};

export default User;
