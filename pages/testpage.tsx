import { getSession } from "next-auth/react";
import React, { useContext } from "react";
import {
  collection,
  orderBy,
  getDocs,
  query,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import db from "../firebase";
import { json } from "micro";
import { CartContext } from "./_app";
type Props = {
  cart: any;
};

function testpage({}: Props) {
  const { cart, setCart }: any = useContext(CartContext as any);
  console.log(cart);
  return <div>HELLO</div>;
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
    };
  }

  return { props: {} };
}

export default testpage;

/**
 */
