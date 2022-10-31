import Image from "next/image";
import React, { useContext, useState } from "react";
import { FaStar } from "react-icons/fa";
import Currency from "react-currency-formatter";
import { addToCart, removeFromCart } from "../slices/cartSlice";
import { useSession } from "next-auth/react";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import db from "../firebase";
import axios from "axios";
import { CartContext } from "../pages/_app";
import { useEffect } from "react";
type Props = any;
console.log();
export default function CheckoutProduct({ id, rating, hasPrime }: Props) {
  const { cart, setCart }: any = useContext(CartContext as any);
  function getCartItem() {
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id === id) {
        return cart[i];
      }
    }
    return null;
  }
  const [cartItem, setCartItem] = useState(getCartItem());

  useEffect(() => {
    setCartItem(getCartItem());
  }, [cart]);

  const { data: session } = useSession();
  // call backend to add item to cart

  const addItemToCart = async () => {
    //now call backend to create checkout session
    const addToCart = await axios.post("/api/add-item-to-cart", {
      id: id,
      title: cartItem.title,
      price: cartItem.price,
      description: cartItem.description,
      category: cartItem.category,
      image: cartItem.image,
      count: "add logic here",
      email: session?.user?.email,
    });
  };

  function updateEmptyFromCart() {
    removeItemFromCart();
    //remove item from state

    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id === id) {
        setCart((prevCart: any) => {
          prevCart.splice(i, 1);
          return prevCart;
        });
      }
    }
  }
  const removeItemFromCart = async () => {
    //now call backend to remove item from db
    const removeFromCartSession = await axios.post(
      "/api/remove-item-from-cart",
      {
        id: id,
        title: cartItem.title,
        price: cartItem.price,
        description: cartItem.description,
        category: cartItem.category,
        image: cartItem.image,
        count: "add logic here",
        email: session?.user?.email,
      }
    );
    removeFromCartSession;
  };

  return cartItem ? (
    <div className="grid grid-cols-5">
      <Image
        src={cartItem.image}
        width={200}
        height={200}
        alt={cartItem.description}
        className="object-contain"
      />
      <div className="col-span-3 mx-5">
        <p>{cartItem.title}</p>
        <div className="flex">
          {Array(rating)
            .fill("_")
            .map((_, i) => {
              return <FaStar key={i} className="w-5 h-5 text-yellow-500" />;
            })}
        </div>
        <p className="text-xs my-2 line-clamp-3">{cartItem.description}</p>
        <Currency quantity={cartItem.price} currency="CAD" />
        {hasPrime && (
          <div className="flex items-center space-x-2">
            <img
              className="w-12"
              src="/prime_img.png"
              alt="Prime Logo"
              loading="lazy"
            />
            <p className="text-xs text-gray-500">Free Next-day Delivery</p>
          </div>
        )}
      </div>
      <div className="flex flex-col space-y-2 my-auto justify-self-end">
        <button
          className="button "
          onClick={() => {
            addItemToCart();
          }}
        >
          Add To Cart
        </button>
        <button
          className="button"
          onClick={() => {
            updateEmptyFromCart();
          }}
        >
          Remove From Cart
        </button>
      </div>
    </div>
  ) : (
    <></>
  );
}
