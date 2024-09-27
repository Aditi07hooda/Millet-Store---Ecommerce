import React from "react";
import Image from "next/image";
import { Card, Typography, List, ListItem } from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import product from "../../../data/product.json";
import { Disclosure } from "@headlessui/react";

export default function SidebarCategory() {
  return (
    <Disclosure as="nav" className="relative">
      {() => (
        <>
          {/* Sidebar content for large screens */}
          <Card className="hidden sm:block w-full max-w-[20rem] shadow-xl shadow-blue-gray-900/5 h-[calc(100vh-6rem)]">
            <div className="bg-primary p-4 flex justify-between">
              <Typography
                variant="h5"
                color="blue-gray"
                className="text-white font-semibold text-lg"
              >
                Categories
              </Typography>
            </div>
            <div className="h-[calc(100vh-10rem)] overflow-y-auto">
              <List className="bg-secondary bg-opacity-15">
                {[...new Set(product.map((item) => item.category.name))].map(
                  (categoryName, index) => {
                    const categoryItem = product.find(
                      (item) => item.category.name === categoryName
                    );

                    return (
                      <ListItem
                        key={index}
                        className="relative hover:bg-primary hover:bg-opacity-20 flex items-center text-black"
                      >
                        {categoryItem.category.imageUrl && (
                          <Image
                            src={categoryItem.category.imageUrl}
                            alt={categoryName}
                            width={0}
                            height={0}
                            sizes="(max-width: 640px) 20px, 28px"
                            className="h-auto w-auto max-w-[28px] max-h-[28px] sm:max-w-[36px] sm:max-h-[36px] rounded-full mr-3"
                          />
                        )}
                        <Typography
                          variant="small"
                          className="text-xs sm:text-sm"
                        >
                          {categoryName}
                        </Typography>
                      </ListItem>
                    );
                  }
                )}
              </List>
            </div>
          </Card>

          {/* Mobile menu */}
          <Disclosure.Panel className="fixed inset-0 bg-black bg-opacity-50 z-10 sm:hidden">
            <div className="flex flex-col w-3/4 max-w-xs h-full">
              <div className="bg-primary p-4 flex justify-between items-center">
                <Typography
                  variant="h5"
                  color="blue-gray"
                  className="text-white font-semibold text-lg"
                >
                  Categories
                </Typography>
                <Disclosure.Button className="inline-flex items-center justify-center text-gray-400 hover:bg-primary-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </Disclosure.Button>
              </div>
              <div className="overflow-y-auto bg-secondary">
                {[...new Set(product.map((item) => item.category.name))].map(
                  (categoryName, index) => {
                    const categoryItem = product.find(
                      (item) => item.category.name === categoryName
                    );

                    return (
                      <Disclosure.Button
                        key={index}
                        className="relative flex items-center p-2 text-white hover:bg-primary hover:bg-opacity-20 rounded-md"
                      >
                        {categoryItem.category.imageUrl && (
                          <Image
                            src={categoryItem.category.imageUrl}
                            alt={categoryName}
                            width={0}
                            height={0}
                            sizes="(max-width: 640px) 20px, 28px"
                            className="h-auto w-auto max-w-[28px] max-h-[28px] sm:max-w-[36px] sm:max-h-[36px] rounded-full mr-3"
                          />
                        )}
                        <Typography
                          variant="small"
                          className="text-sm sm:text-base text-white"
                        >
                          {categoryName}
                        </Typography>
                      </Disclosure.Button>
                    );
                  }
                )}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
