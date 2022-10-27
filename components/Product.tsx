import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import Currency from "react-currency-formatter";
type Props = {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  id: any;
};

function Product({ id, title, price, description, category, image }: Props) {
  //require setters and use effect because we are doing SSR. With SSR, math.random will generate different values for the server vs client.
  const [rating, setRating] = useState(3);
  const [hasPrime, setHasPrime] = useState(false);
  useEffect(() => {
    setRating(Math.floor(Math.random() * 5) + 1);
    setHasPrime(Math.random() < 0.5);
  }, []);
  return (
    <div className="relative flex flex-col items-center m-5 bg-white z-30 p-10">
      <p className="absolute top-2 right-2 text-xs text-gray-400 italic">
        {category}
      </p>
      <Image
        src={image}
        height={200}
        width={200}
        alt={description}
        className="object-contain"
        placeholder="blur"
        blurDataURL={image}
      />
      <h4 className="my-4">{title}</h4>
      <div className="flex">
        {Array(rating)
          .fill(Math.random())
          .map((_, i) => {
            return <FaStar key={i} className="w-5 h-5 text-yellow-500" />;
          })}
      </div>
      <p className="text-xs my-2 line-clamp-2">{description}</p>
      <div>
        <Currency quantity={price} currency="CAD" />
      </div>
      {hasPrime && (
        <div>
          <img src="/prime_img.png" />
          <p>Free Next-day Delivery</p>
        </div>
      )}
      <button>Add To Cart</button>
    </div>
  );
}

export default Product;
