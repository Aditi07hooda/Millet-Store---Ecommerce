import React from 'react'

const Loader = () => {
  return (
    <>
      <div class="flex justify-center items-center h-screen">
        <div class="rounded-full h-20 w-20 bg-primary animate-ping"></div>
      </div>
    </>
  )
}

export default Loader;
