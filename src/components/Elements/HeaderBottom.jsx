import React from 'react';
import Image from 'next/image';
import FreshlyGroundFloorAndAtta from "../../Image/product/FreshlyGroundFloorAndAtta.jpg";
import MilletSnacksAndSavouries from "../../Image/product/MilletSnackSavouries.avif";
import SproutedFlours from "../../Image/product/SproutedFlour.jpg";
import HealthyMixAndNutsPowder from "../../Image/product/HealthMixAndNutsPowder.png";
import { useRouter } from 'next/router';

const HeaderBottom = () => {
    const router = useRouter();
    const featuredProduct = [
        { name: 'Freshly Ground Floor And Atta', imageUrl: FreshlyGroundFloorAndAtta, href: '/category/459-special-flours' },
        { name: 'Millet Snacks - Savouries', imageUrl: MilletSnacksAndSavouries, href: '/category/376-millet-savouries' },
        { name: 'Sprouted Flours', imageUrl: SproutedFlours, href: '/category/404-sprouted-flour' },
        { name: 'Healthy Mix & Nuts Powder', imageUrl: HealthyMixAndNutsPowder, href: '/category/860-HEALTH-MIX' },
    ];

    const handleClickCategory = (href) => {
        router.push(href);
    };

    return (
        <div className="py-4 px-8 mx-6 rounded-lg bg-secondary bg-opacity-20">
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {featuredProduct.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => handleClickCategory(item.href)}
                        className="flex flex-col flex-wrap cursor-pointer items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 hover:text-primary"
                    >
                        <Image
                            className="rounded-full"
                            src={item.imageUrl}
                            alt={item.name}
                            width={100}
                            height={100}
                        />
                        <p className="text-sm font-semibold text-center mt-2 flex flex-wrap">{item.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HeaderBottom;
