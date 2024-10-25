import React from "react";
import Image from "next/image";
import logo from "../Image/logo.png";
import profile from "../Image/profile.avif";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, HeartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useSelector } from "react-redux";
import Badge, { BadgeProps } from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchBar from "./UI/SearchBar";
import { current } from "@reduxjs/toolkit";

const Navbar = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = String(cartItems.length);

  const navigation = [
    { name: "Blog", href: "/blog", current: false },
    { name: "About us", href: "/about", current: false },
    { name: "Contact us", href: "/contact", current: false },
    {name: "Collections", href: "/collections", current: false},
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: 13,
      border: `1px solid ${theme.palette.background.paper}`,
      backgroundColor: "#8B4513",
      padding: "0 1px",
    },
  }));

  const logoutHandler = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <>
      <Disclosure as="nav" className="bg-secondary sticky top-0 z-10">
        <div className="mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex items-center justify-between sm:items-stretch sm:justify-start cursor-pointer">
              <Link href="/">
                <div className="flex flex-shrink-0 items-center cursor-pointer">
                  <Image
                    alt="Your Company"
                    src={logo}
                    className="h-10 w-auto"
                  />
                  <p className="px-4 py-2 text-lg text-black font-semibold hidden sm:block">
                    The Millet Store
                  </p>
                </div>
              </Link>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
              {/* Mobile menu button */}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-primary-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block h-6 w-6 group-data-[open]:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden h-6 w-6 group-data-[open]:block"
                />
              </DisclosureButton>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex">
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <span
                        className={classNames(
                          item.current
                            ? "bg-primary text-white"
                            : "text-gray-900 hover:bg-primary hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                      >
                        {item.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
              <button
                type="button"
                className="relative rounded-full p-1 text-gray-900 hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 hidden sm:block"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Wishlist</span>
                <HeartIcon aria-hidden="true" className="h-6 w-6" />
              </button>

              <Link href="/cart" className="hidden sm:block">
                <IconButton aria-label="cart">
                  <StyledBadge badgeContent={cartCount} color="secondary">
                    <ShoppingCartIcon />
                  </StyledBadge>
                </IconButton>
              </Link>

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3 hidden sm:block">
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <Image
                      alt="profile picture"
                      src={profile}
                      className="h-8 w-8 rounded-full"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <Link href="/user/account">
                    <span className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-primary data-[focus]:text-white">
                      Your Profile
                    </span>
                  </Link>
                  <MenuItem>
                    <Link href="/user/account" onClick={logoutHandler}>
                      <span className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-primary data-[focus]:text-white">
                        Sign out
                      </span>
                    </Link>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>

        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                className={classNames(
                  item.current
                    ? "bg-primary text-white"
                    : "text-gray-900 hover:bg-primary hover:text-white",
                  "block rounded-md px-3 py-2 text-base font-medium"
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
        </DisclosurePanel>
      </Disclosure>
    </>
  );
};

export default Navbar;
