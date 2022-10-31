import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import Currency from "react-currency-formatter";
import { useDispatch } from "react-redux";
import { addToCart, selectItems } from "../slices/cartSlice";
import { collection, doc, setDoc } from "firebase/firestore";
import db from "../firebase";
import { useSession } from "next-auth/react";
import axios from "axios";
import { json } from "micro";
import { CartContext } from "../pages/_app";
type Props = {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  id: any;
};

function Product({ id, title, price, description, category, image }: Props) {
  const { cart, setCart }: any = useContext(CartContext as any);
  //require setters and use effect because we are doing SSR. With SSR, math.random will generate different values for the server vs client.
  const [rating, setRating] = useState(3);
  const [hasPrime, setHasPrime] = useState(false);
  const { data: session } = useSession();
  useEffect(() => {
    setRating(Math.floor(Math.random() * 5) + 1);
    setHasPrime(Math.random() < 0.5);
  }, []);

  function updateCart() {
    addItemToCart();
    if (!session) {
      return;
    }

    setCart((prevCart: any) => {
      //hacky way of checking for duplicates... would not reccommend in the future. would use initial object DS instead
      //and use itemid as keys
      for (let i = 0; i < prevCart.length; i++) {
        if (prevCart[i].id === `item: ${id}`) {
          return [...prevCart];
        }
      }
      return [
        ...prevCart,
        {
          id: id,
          title: title,
          price: price,
          description: description,
          category: category,
          image: image,
          count: "add logic here",
        },
      ];
    });
  }
  const addItemToCart = async () => {
    if (!session) {
      alert("Please Log In To Add An Item To Your Cart");
      return;
    }
    const addToCartSession = await axios.post("/api/add-item-to-cart", {
      id: id,
      title: title,
      price: price,
      description: description,
      category: category,
      image: image,
      count: "add logic here",
      email: session?.user?.email,
    });
  };
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
        className="object-contain h-auto w-auto"
        placeholder="blur"
        blurDataURL={image}
      />
      <h4 className="my-4">{title}</h4>
      <div className="flex">
        {Array(rating)
          .fill("_")
          .map((_, i) => {
            return <FaStar key={i} className="w-5 h-5 text-yellow-500" />;
          })}
      </div>
      <p className="text-xs my-2 line-clamp-2">{description}</p>
      <div className="mb-5">
        <Currency quantity={price} currency="CAD" />
      </div>
      {hasPrime && (
        <div className="flex items-center space-x-2 -mt-5">
          <img className="w-12 h-auto" src="/prime_img.png" alt="Prime Logo" />
          <p className="text-xs text-gray-500">Free Next-day Delivery</p>
        </div>
      )}
      <button
        onClick={() => {
          updateCart();
        }}
        className="mt-auto button"
      >
        Add To Cart
      </button>
    </div>
  );
}

export default Product;
