import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const Carousel = ({ images, autoSlide = true, autoSlideInterval = 3000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (autoSlide) {
            const slideInterval = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, autoSlideInterval);
            return () => clearInterval(slideInterval);
        }
    }, [autoSlide, autoSlideInterval, images.length]);


    return (
        <div className="relative w-full max-w-[830px] mx-auto">
            <div className="relative h-64">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`${index === currentIndex ? 'translate-x-0' : 'translate-x-full'
                            }`}
                    >
                        <Image src={image} alt={`Slide ${index}`} className="w-full h-full object-cover rounded-lg" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Carousel;