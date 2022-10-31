import React, { useContext } from "react";
import Image from "next/image";
import AmazonLogo from "../public/amazon_logo.png";
import { FaSearch } from "react-icons/fa";
import { AiOutlineShoppingCart, AiOutlineMenu } from "react-icons/ai";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectItems } from "../slices/cartSlice";
import { CartContext } from "../pages/_app";
type Props = {};

function Header({}: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const { cart, setCart }: any = useContext(CartContext as any);
  return (
    <header>
      {/**top nav */}
      <div className="flex items-center bg-amazon_blue p-1 flex-grow py-2">
        <div className="mt-2 flex items-center flex-grow sm:flex-grow-0">
          <Image
            src={AmazonLogo}
            alt="Amazon Logo"
            width={150}
            height={40}
            className="object-contain cursor-pointer pl-4"
            onClick={() => router.push("/")}
          />
        </div>
        {/**Search  */}
        <div className="hidden sm:flex items-center h-10 rounded-md flex-grow cursor-pointer bg-yellow-400 hover:bg-yellow-500 ml-4">
          <input
            type="text"
            className="p-2 h-full w-6 flex-grow flex-shrink rounded-l-md focus:outline-none px-4"
          />
          <FaSearch className="h-12 p-4 w-12 " />
        </div>
        {/**Right */}
        <div className="text-white flex items-center text-xs space-x-6 mx-6 whitespace-nowrap">
          <div
            onClick={() => {
              !session ? signIn() : signOut();
            }}
            className="link"
          >
            <p>{session ? `Hello ${session?.user?.name}` : "Sign In"}</p>
            <p className="font-extrabold md:text-sm">Accounts & Lists</p>
          </div>
          <div className="link " onClick={() => router.push("/orders")}>
            <p>Returns</p>
            <p className="font-extrabold md:text-sm"> & orders</p>
          </div>
          <div
            className="relative link flex items-center"
            onClick={() => router.push("/checkout")}
          >
            <span className="absolute top-0 right-2 md:right-10 h-4 w-4 bg-yellow-400 text-center rounded-full text-black font-bold">
              {cart.length}
            </span>
            <AiOutlineShoppingCart className="h-10 w-10 " />
            <p className="hidden md:inline font-extrabold md:text-sm mt-2 ">
              Cart
            </p>
          </div>
        </div>
      </div>
      {/**bottom nav */}

      <div className="flex items-center space-x-3 p-2 pl-6 bg-amazon_blue-light text-white text-sm">
        <p className="link flex items-center">
          <AiOutlineMenu className="h-6 w-6 mr-1" />
          All
        </p>
        <p className="link">Prime Video</p>
        <p className="link">Amazon Business</p>
        <p className="link">Today's Deal</p>
        <p className="link hidden md:inline-flex">Gift Ideas</p>
        <p className="link hidden md:inline-flex">Gift Cards</p>
        <p className="link hidden md:inline-flex">Coupons</p>
        <p className="link hidden md:inline-flex">Buy Again</p>
        <p className="link hidden md:inline-flex">Beauty & Personal Care</p>
        <p className="link hidden md:inline-flex">Health & Household</p>
        <p className="link hidden md:inline-flex">Grocery</p>
      </div>
    </header>
  );
}

export default Header;
