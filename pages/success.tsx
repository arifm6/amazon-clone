import { collection, getDocs } from "firebase/firestore";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { useDispatch } from "react-redux";

import Header from "../components/Header";
import db from "../firebase";
import { setCart } from "../slices/cartSlice";
type Props = {
  cart: any;
  session: any;
};

function success({ session, cart }: Props) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (session) {
      dispatch(setCart(cart));
    }
  }, []);

  const router = useRouter();
  return (
    <div className="bg-gray-100 h-screen">
      <Header />
      <main className="max-w-screen-lg mx-auto">
        <div className="flex flex-col p-10 bg-white ">
          <div className="flex items-center space-x-2 mb-5">
            <AiFillCheckCircle className="text-green-500 h-10 w-10" />
            <h1 className="text-3xl">
              Thank you, your order has been confirmed!
            </h1>
          </div>
          <p>
            Thank you for being our valued customer. We hope our product will
            meet your expectations. Let us know if you have any questions.
          </p>
          <button
            onClick={() => router.push("/orders")}
            className="button mt-8"
          >
            Go to my orders
          </button>
        </div>
      </main>
    </div>
  );
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    console.log("SESSION NOT FOUND");
    return { props: {} };
  }

  const cartSnapshot = await getDocs(
    collection(db, "users", session?.user?.email as string, "cart")
  );
  let cartAlias: any[] = [];
  cartSnapshot.forEach((doc) => {
    cartAlias = [...cartAlias, doc.data()];
  });

  const cart = [...cartAlias];

  return {
    props: { session, cart },
  };
  // ...
};

export default success;
