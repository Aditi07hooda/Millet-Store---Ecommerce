import React from "react";
import Image from "next/image";
import {
    Card,
    Typography,
    List,
    ListItem,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import product from "../../../data/product.json";
import { Disclosure } from '@headlessui/react';

export default function SidebarCategory() {
    return (
        <Disclosure as="nav" className="bg-secondary relative">
            {({ open }) => (
                <>
                    {/* Mobile menu button */}
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden z-10">
                        <Disclosure.Button className="inline-flex items-center justify-center p-2 text-gray-400 hover:bg-primary-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                            <span className="sr-only">Open main menu</span>
                            {open ? (
                                <XMarkIcon className="block h-6 w-6 bg-black" aria-hidden="true" />
                            ) : (
                                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </Disclosure.Button>
                    </div>

                    {/* Sidebar content for large screens */}
                    <Card className="hidden sm:block w-full max-w-[20rem] shadow-xl shadow-blue-gray-900/5 h-[calc(100vh-6rem)]">
                        <div className="bg-primary p-4">
                            <Typography variant="h5" color="blue-gray" className="text-white font-semibold text-lg">
                                Categories
                            </Typography>
                        </div>
                        <div className="h-[calc(100vh-10rem)] overflow-y-auto">
                            <List className="bg-secondary bg-opacity-15">
                                {[...new Set(product.map(item => item.category.name))].map((categoryName, index) => {
                                    const categoryItem = product.find(item => item.category.name === categoryName);

                                    return (
                                        <ListItem
                                            key={index}
                                            className="relative hover:bg-primary hover:bg-opacity-20"
                                        >
                                            {categoryItem.category.imageUrl && (
                                                <Image
                                                    src={categoryItem.category.imageUrl}
                                                    alt={categoryName}
                                                    width={28}
                                                    height={28}
                                                    className="h-7 w-7 rounded-full mr-3"
                                                />
                                            )}
                                            {categoryName}
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </div>
                    </Card>

                    {/* Mobile menu */}
                    <Disclosure.Panel className="fixed inset-0 bg-black bg-opacity-50 z-10 sm:hidden">
                        <div className="flex flex-col  w-3/4 max-w-xs h-full">
                            <Typography variant="h5" color="blue-gray" className="text-white font-semibold text-lg mb-4 bg-primary p-4">
                                Categories
                            </Typography>
                            <div className="overflow-y-auto bg-secondary">
                                {[...new Set(product.map(item => item.category.name))].map((categoryName, index) => {
                                    const categoryItem = product.find(item => item.category.name === categoryName);

                                    return (
                                        <Disclosure.Button
                                            key={index}
                                            className="relative flex items-center p-2 text-white hover:bg-primary hover:bg-opacity-20 rounded-md"
                                        >
                                            {categoryItem.category.imageUrl && (
                                                <Image
                                                    src={categoryItem.category.imageUrl}
                                                    alt={categoryName}
                                                    width={28}
                                                    height={28}
                                                    className="h-7 w-7 rounded-full mr-3"
                                                />
                                            )}
                                            {categoryName}
                                        </Disclosure.Button>
                                    );
                                })}
                            </div>
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
}
