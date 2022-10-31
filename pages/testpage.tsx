import { getSession } from "next-auth/react";
import React from "react";
import {
  collection,
  orderBy,
  getDocs,
  query,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import db from "../firebase";
import { json } from "micro";
type Props = {
  cart: any;
};

function testpage({ cart }: Props) {
  return <div>HELLO</div>;
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
    };
  }
  const databaseCart = await getDocs(
    query(
      collection(db, "users", "arifmassih6@gmail.com", "cart"),
      orderBy("timestamp", "desc")
    )
  );
  const cart = await Promise.all(
    databaseCart.docs.map(async (cartItem) => ({
      id: cartItem.id,
      title: cartItem.data().title,
      price: cartItem.data().price,
      description: cartItem.data().description,
      category: cartItem.data().category,
      image: cartItem.data().image,
    }))
  );

  return { props: { cart } };
}

export default testpage;

/**
 */
