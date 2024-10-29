import React from "react";
import Loader from "../UI/Loader";
import { getBannerWebImage } from "@/store/LocalStorage";
import { useRouter } from "next/router";
import Image from "next/image";

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
            className="h-48 lg:h-[26rem] md:h-[23rem] relative"
            onClick={() => router.push(imageLinkTo[0])}
          >
            <Image
              src={image}
              alt={`Slide ${index}`}
              className="w-full h-full object-cover rounded-lg"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
