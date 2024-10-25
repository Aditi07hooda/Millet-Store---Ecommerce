import React, { useState } from "react";
import { HeartIcon, HomeIcon } from "@heroicons/react/24/outline";
import { BiSolidCategoryAlt } from "react-icons/bi";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { useSelector } from "react-redux";
import SidebarCategory from "../Elements/SidebarCategory";
import SearchBar from "./SearchBar";

function MobileBottomNavbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = String(cartItems.length);

  const bottomItems = [
    { label: "Home", href: "/", icon: HomeIcon },
    {
      label: "Category",
      href: "#",
      icon: BiSolidCategoryAlt,
      action: () => setIsSidebarOpen(true),
    },
    { label: "Search", icon: <SearchBar /> },
    { label: "Cart", href: "/cart", icon: ShoppingCartIcon },
    { label: "Profile", href: "/user/account", icon: FaUserCircle },
  ];

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: 13,
      border: `1px solid ${theme.palette.background.paper}`,
      backgroundColor: "#8B4513",
      padding: "0 4px",
    },
  }));

  return (
    <>
      <div className="sticky bottom-0 z-10 bg-secondary sm:hidden lg:hidden">
        <div className="flex justify-between items-center px-4 py-2 text-sm text-black">
          {bottomItems.map((item) => {
            if (item.label === "Cart") {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex flex-col items-center"
                >
                  <IconButton aria-label="cart">
                    <StyledBadge badgeContent={cartCount} color="secondary">
                      <ShoppingCartIcon className="w-5 h-5" />
                    </StyledBadge>
                  </IconButton>
                  <p className="text-xs text-gray-500">{item.label}</p>
                </Link>
              );
            } else if (item.label === "Category") {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.label}
                  onClick={item.action ? item.action : null} // Trigger action on click
                  className="flex flex-col items-center"
                >
                  <IconComponent className="w-5 h-5" />
                  <p className="text-xs text-gray-500">{item.label}</p>
                </div>
              );
            } else if (item.label === "Search") {
              return(
                <div
                  key={item.label}
                  className="flex flex-col items-center"
                >
                  <SearchBar />
                  <p className="text-xs text-gray-500">{item.label}</p>
                </div>
              );
            } else {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex flex-col items-center"
                >
                  <IconComponent className="w-5 h-5" />
                  <p className="text-xs text-gray-500">{item.label}</p>
                </Link>
              );
            }
          })}
        </div>
      </div>

      {/* Sidebar Category Pop-Up */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-20 flex">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          ></div>

          <div className="relative w-64 h-full max-h-screen shadow-lg text-xl overflow-auto">
            <SidebarCategory isMobile={true} />
            <button
              className="absolute top-0 right-0 m-4 text-xl"
              onClick={() => setIsSidebarOpen(false)}
            >
              &times; {/* Close button */}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default MobileBottomNavbar;
