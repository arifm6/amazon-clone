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
  deleteDoc,
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

  return { props: {} };
}

export default testpage;

/**
 */
