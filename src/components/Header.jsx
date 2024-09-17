import React from 'react';
import SidebarCategory from './Elements/SidebarCategory';
import Carousel from './Elements/Carousel';
import header from '../Image/header.avif';
import HeaderBottom from './Elements/HeaderBottom';

const Header = () => {
    const images = [header];

    return (
        <div className="flex  max-h-[calc(100vh-5rem)] my-4">
            <SidebarCategory />
            <div className="flex flex-col w-full justify-between h-[calc(100vh-6rem)]">
                <Carousel images={images} />
                <HeaderBottom />
            </div>
        </div>
    );
};

export default Header;
