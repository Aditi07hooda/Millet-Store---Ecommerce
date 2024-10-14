import React, { useState, useRef } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineClose } from "react-icons/md";
import { getSessionId } from "@/store/LocalStorage";
import Image from "next/image";

const SearchBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);

  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const brand_id = process.env.NEXT_PUBLIC_BRAND_ID;

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      closeSearch();
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    
    if (value) {
      search(value);
    } else {
      setSearchResults([]); 
    }
  };

  const search = async (term) => {
    if (!term) return;

    try {
      const res = await fetch(
        `${base_url}/store/${brand_id}/search?q=${term}`,
        {
          method: "GET",
          headers: {
            session: getSessionId(),
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to search for products");
      }
      const data = await res.json();
      setSearchResults(data.results);
      console.log(term);
      console.log(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <div className="sm:hidden">
        <div className="shadow-sm mr-10">
          <IoSearchOutline
            className="ml-2 text-2xl font-bold cursor-pointer text-gray-600 transition duration-150 ease-in-out hover:text-gray-800"
            onClick={openSearch}
          />
        </div>
      </div>

      <div className="hidden sm:flex">
        <div className="max-w-md mx-auto">
          <div className="relative flex items-center w-full h-10 rounded-full shadow-md focus-within:shadow-lg bg-white overflow-hidden transition duration-150">
            <div className="grid place-items-center h-full w-14 text-gray-400">
              <IoSearchOutline className="ml-2 text-xl font-bold" />
            </div>
            <input
              className="peer h-full w-full outline-none text-sm text-gray-700 pr-4 bg-transparent"
              type="text"
              id="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-start"
          onClick={handleClickOutside}
        >
          <div
            className={`relative bg-white w-full sm:max-w-lg p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${
              isSearchOpen
                ? "max-h-screen opacity-100 translate-y-0"
                : "max-h-0 opacity-0 -translate-y-full"
            }`}
            ref={searchRef}
          >
            <button
              className="absolute top-2 right-4 text-gray-500 hover:text-gray-800 transition"
              onClick={closeSearch}
            >
              <MdOutlineClose className="h-6 w-6" />
            </button>

            <div className="flex flex-col items-center w-full h-auto border rounded-lg bg-gray-100 overflow-hidden mt-6 p-2">
              <div className="flex w-full items-center rounded-md border border-gray-300 bg-white shadow-sm transition duration-200 focus-within:ring focus-within:ring-indigo-200">
                <div className="grid place-items-center h-full w-12 text-gray-400">
                  <IoSearchOutline className="text-xl" />
                </div>
                <input
                  className="h-full w-full outline-none text-sm text-gray-700 pr-4 bg-transparent"
                  type="text"
                  id="mobile-search"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={handleInputChange}
                  autoFocus
                />
              </div>

              {searchResults.length > 0 && (
                <div className="mt-4 w-full max-h-96 rounded-lg bg-white p-4 shadow-lg overflow-y-auto">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">
                    Search Results:
                  </h3>
                  <ul className="space-y-2">
                    {searchResults.map((result, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg shadow-md hover:bg-indigo-50 transition duration-150 ease-in-out"
                      >
                        <div className="flex items-center space-x-3">
                          <Image
                            src={result.oneImg}
                            className="h-8 w-8 rounded-full"
                            width={32}
                            height={32}
                            alt={result.name}
                          />
                          <span className="text-gray-700 font-medium">
                            {result.name}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar;