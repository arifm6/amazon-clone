import Image from "next/image";
import React from "react";
import { FaStar } from "react-icons/fa";
import Currency from "react-currency-formatter";
import { useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../slices/cartSlice";
import {
  doc,
  setDoc,
  increment,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import db from "../firebase";
import { useSession } from "next-auth/react";

type Props = any;

export default function CheckoutProduct({
  id,
  title,
  rating,
  price,
  description,
  category,
  image,
  hasPrime,
}: Props) {
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const addItemToCart = async () => {
    const product = {
      id: id,
      title: title,
      price: price,
      description: description,
      category: category,
      image: image,
      rating: rating,
      hasPrime: hasPrime,
    };
    if (session) {
      try {
        await updateDoc(
          doc(db, "users", session?.user?.email as string, "cart", `id_${id}`),
          {
            id: id,

            title: title,
            price: price,
            description: description,
            category: category,
            image: image,
            rating: rating,
            hasPrime: hasPrime,
            count: increment(1),
          }
        );
      } catch {
        await setDoc(
          doc(db, "users", session?.user?.email as string, "cart", `id_${id}`),
          {
            id: id,
            title: title,
            price: price,
            description: description,
            category: category,
            image: image,
            rating: rating,
            hasPrime: hasPrime,

            count: increment(1),
          }
        );
      }
    }

    dispatch(addToCart(product));
  };
  const removeItemFromCart = async () => {
    if (session) {
      try {
        await updateDoc(
          doc(db, "users", session?.user?.email as string, "cart", `id_${id}`),
          {
            id: id,

            title: title,
            price: price,
            description: description,
            category: category,
            image: image,
            rating: rating,
            hasPrime: hasPrime,
            count: increment(-1),
          }
        );
        if (
          (await (
            await getDoc(
              doc(
                db,
                "users",
                session?.user?.email as string,
                "cart",
                `id_${id}`
              )
            )
          ).data()?.count) === 0
        ) {
          await deleteDoc(
            doc(db, "users", session?.user?.email as string, "cart", `id_${id}`)
          );
        }
      } catch {
        await deleteDoc(
          doc(db, "users", session?.user?.email as string, "cart", `id_${id}`)
        );
      }
    }
    dispatch(removeFromCart(id));
  };
  return (
    <div className="grid grid-cols-5">
      <Image
        src={image}
        width={200}
        height={200}
        alt={description}
        className="object-contain"
      />
      <div className="col-span-3 mx-5">
        <p>{title}</p>
        <div className="flex">
          {Array(rating)
            .fill("_")
            .map((_, i) => {
              return <FaStar key={i} className="w-5 h-5 text-yellow-500" />;
            })}
        </div>
        <p className="text-xs my-2 line-clamp-3">{description}</p>
        <Currency quantity={price} currency="CAD" />
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
            removeItemFromCart();
          }}
        >
          Remove From Cart
        </button>
      </div>
    </div>
  );
}
