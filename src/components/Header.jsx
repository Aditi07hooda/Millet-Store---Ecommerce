import React from 'react';
import SidebarCategory from './Elements/SidebarCategory';
import Carousel from './Elements/Carousel';
import HeaderBottom from './Elements/HeaderBottom';

const Header = () => {
  return (
    <div className="flex flex-col sm:flex-row max-h-[calc(100vh-5rem)] my-4">
      <div className="order-2 sm:order-1">
        <SidebarCategory />
      </div>
      <div className="flex flex-col w-full justify-between h-[calc(100vh-6rem)] order-1 sm:order-2">
        <Carousel />
        <HeaderBottom />
      </div>
    </div>
  );
};

export default Header;
