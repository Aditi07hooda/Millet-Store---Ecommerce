import React from 'react';
import Image from 'next/image';
import FreshlyGroundFloorAndAtta from "../../Image/product/FreshlyGroundFloorAndAtta.jpg";
import MilletSnacksAndSavouries from "../../Image/product/MilletSnackSavouries.avif";
import SproutedFlours from "../../Image/product/SproutedFlour.jpg";
import HealthyMixAndNutsPowder from "../../Image/product/HealthMixAndNutsPowder.png";

const HeaderBottom = () => {
    const featuredProduct = [
        { name: 'Freshly Ground Floor And Atta', imageUrl: FreshlyGroundFloorAndAtta, href: '#' },
        { name: 'Millet Snacks - Savouries', imageUrl: MilletSnacksAndSavouries, href: '#' },
        { name: 'Sprouted Flours', imageUrl: SproutedFlours, href: '#' },
        { name: 'Healthy Mix & Nuts Powder', imageUrl: HealthyMixAndNutsPowder, href: '#' },
    ];

    return (
        <div className="py-4 px-8 mx-6 rounded-lg bg-secondary bg-opacity-20">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {featuredProduct.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 hover:text-primary"
                    >
                        <Image
                            className="rounded-full"
                            src={item.imageUrl}
                            alt={item.name}
                            width={100}
                            height={100}
                            objectFit="cover"
                        />
                        <p className="text-sm font-semibold text-center mt-2">{item.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HeaderBottom;