import React from "react";
import Loader from "../UI/Loader";
import { getBannerWebImage } from "@/store/LocalStorage";
import { useRouter } from "next/router";

const Carousel = () => {
  const router = useRouter();
  if (getBannerWebImage() == null || getBannerWebImage() == undefined) {
    return <Loader />;
  }
  const bannerWeb = JSON.parse(getBannerWebImage());
  const images = [bannerWeb.name];
  const imageLinkTo = [bannerWeb.link];
  console.log("banner detail in header", bannerWeb, imageLinkTo);

  return (
    <div className="relative w-full max-w-[830px] mx-auto mb-2">
      <div className="relative">
        {images.map((image, index) => (
          <div
            key={index}
            className={``}
            onClick={() => router.push(imageLinkTo[0])}
          >
            <img
              src={image}
              alt={`Slide ${index}`}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
