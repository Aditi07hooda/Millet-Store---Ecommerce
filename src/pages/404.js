import Button from "@/components/UI/Button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import error from "../Image/404.png";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center pb-6 px-6 text-center bg-gray-100">
      <div className="relative w-full max-w-md mb-6 lg:h-80 h-64">
        <Image src={error} alt="404" layout="fill" objectFit="contain" />
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        This page is gone.
      </h1>
      <p className="text-gray-600 mb-8">
        ...maybe the page you are looking for is not found or never existed.
      </p>
      <Link href="/" passHref>
        <Button
          text={"Back to Home"}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out shadow-md"
        />
      </Link>
    </div>
  );
};

export default NotFound;