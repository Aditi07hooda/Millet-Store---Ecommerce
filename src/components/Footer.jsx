import Image from "next/image";
import React from "react";
import logo from "../Image/logo.png";
import { useRouter } from "next/router";

const Footer = () => {
  const router = useRouter();

  const productsName = {
    Ragi: "/product/ragi",
    Jowar: "/product/jowar",
    Bajra: "/product/bajra",
    Kodo: "/product/kodo",
    Foxtail: "/product/foxtail",
    Barnyard: "/product/barnyard",
    Pearl: "/product/pearl",
    "Brown Top": "/product/brown-top",
    Sharbati: "/product/sharbati",
    Emmer: "/product/emmer",
    Fenugreek: "/product/fenugreek",
    "Poppy Seeds": "/product/poppy-seeds",
    Soya: "/product/soya",
    Buckwheat: "/product/buckwheat",
  };

  const legalLinks = {
    "Privacy Policy": "/privacy",
    "Terms & Conditions": "/terms",
    "Shipping & Returns": "/shipping",
    "About Us": "/about",
    "Contact Us": "/contact",
  };

  const handleSearchProductClick = (name) => {
    router.push(`/search/${name}`);
  };

  return (
    <footer className="bg-secondary bg-opacity-75 sm:bg-opacity-100 lg:bg-opacity-100 lg:text-left rounded-lg">
      <div className="mx-6 py-10 text-center md:text-left text-black">
        <div className="grid-1 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="cursor-default">
            <h6 className="mb-4 flex items-center justify-center font-semibold uppercase md:justify-start">
              <Image src={logo} alt="The Millet Store" className=" size-12" />©
              Basuvaraj (OPC) Private Limited
            </h6>
            <p>
              We deliver freshly made atta, flours, masala and oil to your
              doorstep, once a week.
            </p>
          </div>
          <div className="flex flex-col justify-between gap-8">
            <div>
              <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start cursor-default">
                Products
              </h6>
              <div className="grid grid-cols-3 grid-flow-rows gap-3">
                {Object.entries(productsName).map(([productName]) => (
                  <p
                    key={productName}
                    className="mb-4 cursor-pointer"
                    onClick={() => handleSearchProductClick(productName)}
                  >
                    {productName}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <h6 className="mb-4 flex justify-center font-semibold uppercase md:justify-start cursor-default">
                Legal Links
              </h6>
              <div className="grid grid-cols-2 grid-flow-rows gap-2">
                {Object.entries(legalLinks).map(([linkName, linkUrl]) => (
                  <p key={linkName} className="mb-4">
                    <a
                      className="text-neutral-600 dark:text-neutral-200 cursor-pointer"
                      href={linkUrl}
                    >
                      {linkName}
                    </a>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
