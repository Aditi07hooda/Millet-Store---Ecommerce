import React, { useState } from 'react';
import Button from './UI/Button';
import { useRouter } from 'next/router';
import { getSessionId, setSessionId } from '@/store/LocalStorage';

const Login = () => {
    const router = useRouter();
    const [state, setState] = useState({
        contactNumber: '',
        isValid: false,
        validationInput: false,
        otp: '',
        loading: false,
        error: '',
    });

    const base_url = process.env.NEXT_PUBLIC_BASE_URL;
    const brand_id = process.env.NEXT_PUBLIC_BRAND_ID;

    const isContactNumberValid = (contactNumber) => {
        return /^[0-9]{10}$/.test(contactNumber);
    };

    // Send OTP function
    const sendOtp = async (contactNumber) => {
        setState((prevState) => ({ ...prevState, loading: true, error: '' }));
        try {
            const response = await fetch(`${base_url}/store/${brand_id}/otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                    'Authorization' : `Bearer ${getSessionId()}`,
                    'session': getSessionId(),
                },
                body: new URLSearchParams({
                    mobile: contactNumber,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send OTP');
            }

            const data = await response.json();
            console.log('OTP sent successfully', data);
            setState((prevState) => ({
                ...prevState,
                validationInput: true,
                loading: false,
            }));
        } catch (error) {
            console.error('Error sending OTP', error);
            setState((prevState) => ({
                ...prevState,
                loading: false,
                error: 'Failed to send OTP. Please try again.',
            }));
        }
    };

    // Validate OTP function
    const validateOtp = async (otp) => {
        setState((prevState) => ({ ...prevState, loading: true, error: '' }));
        try {
            const response = await fetch(`${base_url}/store/${brand_id}/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization' : `Bearer ${getSessionId()}`,
                    'session': getSessionId(),
                    'Accept': 'application/json',
                },
                body: new URLSearchParams({
                    mobile: state.contactNumber,
                    otp: otp,
                    action: 'OTP',
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to validate OTP');
            }

            const data = await response.json();
            console.log('OTP validated successfully', data);
            setState((prevState) => ({
                ...prevState,
                otp: '',
                loading: false,
                isValid: true,
                validationInput: false,
                contactNumber: '',
            }));
            console.log(state)
            setSessionId(data.session);
            router.push('/user');
        } catch (error) {
            console.error('Error validating OTP', error);
            setState((prevState) => ({
                ...prevState,
                loading: false,
                error: 'Failed to validate OTP. Please try again.',
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isContactNumberValid(state.contactNumber)) {
            setState((prevState) => ({
                ...prevState,
                error: 'Invalid contact number. Please enter a valid 10-digit number.',
            }));
            return;
        }

        if (!state.validationInput) {
            sendOtp(state.contactNumber);
        } else {
            validateOtp(state.otp);
            console.log(state.isValid);           
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState((prevState) => ({ ...prevState, [name]: value, error: '' }));
    };

    return (
        <div className="flex h-screen flex-1 flex-col px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Log In / Sign Up
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="contactNumber"
                            className="block text-sm font-medium leading-6 text-gray-900"
                        >
                            Contact Number
                        </label>
                        <div className="mt-2">
                            <input
                                id="contactNumber"
                                name="contactNumber"
                                type="tel"
                                required
                                autoComplete="tel"
                                value={state.contactNumber}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                aria-label="Contact Number"
                                placeholder=" Enter your contact number"
                            />
                        </div>
                    </div>

                    {state.validationInput && (
                        <div>
                            <label
                                htmlFor="otp"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Enter OTP
                            </label>
                            <div className="mt-2">
                                <input
                                    id="otp"
                                    name="otp"
                                    type="tel"
                                    required
                                    autoComplete="tel"
                                    value={state.otp}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                                    aria-label="OTP"
                                    placeholder="Enter the OTP"
                                />
                            </div>
                        </div>
                    )}

                    {state.error && (
                        <p className="text-red-500 text-sm mt-2">{state.error}</p>
                    )}

                    <div>
                        <Button
                            type="submit"
                            text={state.validationInput ? 'Validate OTP' : 'Get OTP'}
                            disabled={state.loading}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
