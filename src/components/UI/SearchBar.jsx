import React from 'react'
import { TbListSearch } from "react-icons/tb";

const SearchBar = () => {
  return (
    <>
      <div>
        <input type="text" placeholder="Search..." />
        <TbListSearch className="ml-2 text-sm" />
        <button>Search</button>
      </div>
    </>
  )
}

export default SearchBar
