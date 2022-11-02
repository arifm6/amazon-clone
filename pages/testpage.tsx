import React from "react";
import db from "../firebase";
import { getSession } from "next-auth/react";
import { doc, setDoc, increment, updateDoc } from "firebase/firestore";

type Props = {};

function TestPage({}: Props) {
  return <div>testpage</div>;
}

export default TestPage;

export async function getServerSideProps(context: any) {
  // access db and pass the cart as a prop to the page.
  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
    };
  } // Add a new document in collection "cities"

  //id, title, price, description, category, image, count
  try {
    await updateDoc(
      doc(
        db,
        "users",
        session?.user?.email as string,
        "cart",
        "random number2"
      ),
      {
        id: "id",
        title: "title",
        price: "price",
        description: "description",
        category: "category",
        image: "image",
        count: increment(1),
      }
    );
  } catch {
    await setDoc(
      doc(db, "users", "gamermassih@gmail.com", "cart", "random number2"),
      {
        id: "id",
        title: "title",
        price: "price",
        description: "description",
        category: "category",
        image: "image",
        count: increment(1),
      }
    );
  }
  return {
    props: {},
  };
}
