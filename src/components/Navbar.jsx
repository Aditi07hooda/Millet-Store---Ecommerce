import React from 'react'
import Image from 'next/image'
import logo from "../Image/logo.png"
import profile from "../Image/profile.avif"
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'


const Navbar = () => {
    const navigation = [
        // { name: 'Team', href: '#', current: false },
        { name: 'About us', href: '/about', current: false },
        // { name: 'Calendar', href: '#', current: false },
    ]

    const CategoriesNavigation = [
        { name: 'Millet Snacks - Savouries', href: '#', current: false, img: "" },
        { name: 'Sprouted Flours', href: '#', current: false, img: "" },
        { name: "Freshly Ground Flour's & Attas's", href: '#', current: false, img: "" },
        { name: "Freshly Ground Masala & chutney podi", href: '#', current: false, img: "" },
        { name: 'Whole Millets & Millet Flours', href: '#', current: false, img: "" },
        { name: 'Activated | Soaked Flours', href: '#', current: false, img: "" },
        { name: 'Instant Ready Mixes', href: '#', current: false, img: "" },
        { name: 'Healthy Mix & Nuts Powder', href: '#', current: false, img: "" },
        { name: 'Herbal Hair oil', href: '#', current: false, img: "" },
        { name: 'Cold Pressed Oil', href: '#', current: false, img: "" },
    ]

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <>
            <Disclosure as="nav" className="bg-secondary">
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                            {/* Mobile menu button*/}
                            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-primary-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Open main menu</span>
                                <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                                <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
                            </DisclosureButton>
                        </div>
                        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                            <Link href="/">
                                <div className="flex flex-shrink-0 items-center">
                                    <Image
                                        alt="Your Company"
                                        src={logo}
                                        className="h-10 w-auto cursor-default"
                                    />
                                    <p className='block px-4 py-2 text-lg text-black font-semibold cursor-default'>
                                        The Millet Store
                                    </p>
                                </div>
                            </Link>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            <div className="hidden sm:ml-6 sm:block">
                                <div className="flex">
                                    <Menu as="div" className="">
                                        <div>
                                            <MenuButton className="hover:bg-primary text-gray-900 hover:text-white text-sm font-medium py-2 px-3 rounded-md">
                                                Categories
                                            </MenuButton>
                                            <MenuItems
                                                transition
                                                className="grid grid-flow-row grid-cols-2 absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                            >
                                                {CategoriesNavigation.map((item) => (
                                                    <MenuItem key={item.name}>
                                                        <Link href={item.href} className="block px-4 py-2 text-sm font-medium text-gray-900 hover:text-white hover:bg-primary hover:rounded-md">
                                                            {item.name}
                                                        </Link>
                                                    </MenuItem>
                                                ))}
                                            </MenuItems>
                                        </div>
                                    </Menu>
                                    {navigation.map((item) => (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            aria-current={item.current ? 'page' : undefined}
                                            className={classNames(
                                                item.current ? 'bg-primary text-white' : 'text-gray-900 hover:bg-primary hover:text-white',
                                                'rounded-md px-3 py-2 text-sm font-medium',
                                            )}
                                        >
                                            {item.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <button
                                type="button"
                                className="relative rounded-full p-1 text-gray-900 hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                            >
                                <span className="absolute -inset-1.5" />
                                <span className="sr-only">Cart</span>
                                <ShoppingCartIcon aria-hidden="true" className="h-6 w-6" />
                            </button>

                            {/* Profile dropdown */}
                            <Menu as="div" className="relative ml-3">
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
                                    <MenuItem>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-primary data-[focus]:text-white">
                                            Your Profile
                                        </a>
                                    </MenuItem>
                                    <MenuItem>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-primary data-[focus]:text-white">
                                            Settings
                                        </a>
                                    </MenuItem>
                                    <MenuItem>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-primary data-[focus]:text-white">
                                            Sign out
                                        </a>
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
                                aria-current={item.current ? 'page' : undefined}
                                className={classNames(
                                    item.current ? 'bg-primary text-white' : 'text-gray-900 hover:bg-primary hover:text-white',
                                    'block rounded-md px-3 py-2 text-base font-medium',
                                )}
                            >
                                {item.name}
                            </DisclosureButton>
                        ))}
                    </div>
                </DisclosurePanel>
            </Disclosure>
        </>
    )
}

export default Navbar
