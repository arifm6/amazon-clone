import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
type Props = {};

function Banner({}: Props) {
  return (
    <div className="relative">
      <div className="absolute w-full h-32 bg-gradient-to-t from-gray-100 to-transparent bottom-0 z-20 " />
      <Carousel
        autoPlay
        infiniteLoop
        showStatus={false}
        showIndicators={false}
        showThumbs={false}
        interval={5000}
      >
        <div className="bg-gray-100 ">
          <img src="/banner_1.png" alt="banner 1" loading="lazy" />
        </div>
        <div>
          <img src="/banner_2.jpeg" alt="banner 2" loading="lazy" />
        </div>
        <div>
          <img src="/banner_3.jpeg" alt="banner 3" loading="lazy" />
        </div>
      </Carousel>
    </div>
  );
}

export default Banner;
