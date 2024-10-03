'use client'
import React from 'react'
import logo from "../Image/logo.png";
import Image from 'next/image';

const contact = () => {
    return (
        <>
            <div className='flex flex-col flex-wrap p-2 m-3 gap-8 sm:gap-24 lg:gap-20 sm:m-5 lg:m-5' style={{height: 'calc(100vh - 160px)'}}>
                <div className='flex flex-col justify-center gap-3'>
                    <Image src={logo} className='w-[20%] h-auto self-center lg:mt-10 lg:w-[10%]' alt='The millet store' />
                    <h1 className='text-xl font-bold text-gray-900 text-center sm:text-2xl lg:text-2xl underline'>
                        Contact Us
                    </h1>
                </div>
                <div className='flex flex-col flex-wrap gap-2'>
                    <p>
                        We deliver freshly made atta, flours, masala and oil to your doorstep, once a week. Just Call/WhatsApp us on <a href="tel:+91 6362033034" className='font-bold text-primary'>+91 6362033034</a> for any queries. We would love to hear from you. Your valuable suggestions help us serve you better.          </p>
                    <p>
                        Thanks
                    </p>
                    <p>
                        Ponmozhi & Team
                    </p>
                </div>
            </div>
        </>
    )
}

export default contact
