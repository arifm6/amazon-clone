import React, { useEffect } from "react";
import Header from "../components/Header";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { selectItems, selectTotal, setCart } from "../slices/cartSlice";
import CheckoutProduct from "../components/CheckoutProduct";
import { getSession, useSession } from "next-auth/react";
import Currency from "react-currency-formatter";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { GetServerSideProps } from "next";
import { collection, getDocs } from "firebase/firestore";
import db from "../firebase";
const stripePromise = loadStripe(process.env.stripe_public_key as string);
type Props = {
  session: any;
  cart: any;
};

function Checkout({ session, cart }: Props) {
  const items = useSelector(selectItems);
  const total = useSelector(selectTotal);
  const dispatch = useDispatch();
  useEffect(() => {
    if (session) {
      dispatch(setCart(cart));
    }
  }, []);

  const createCheckoutSession = async () => {
    const stripe = await stripePromise;

    //now call backend to create checkout session
    const checkoutSession = await axios.post("/api/create-checkout-session", {
      items: items,
      email: session?.user?.email,
    });
    //redirect user to stripe checkout
    const result = await stripe?.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });
    if (result?.error) {
      alert(result.error.message);
    }
  };
  return (
    <div className="bg-gray-100">
      <Header />
      <main className="lg:flex max-w-screen-2xl mx-auto">
        {/**left */}

        <div className="flex-grow m-5 shadow-sm border">
          <Image
            src="/checkout_banner.jpeg"
            width={1020}
            height={250}
            alt="Checkout Banner"
            className="object-contain mx-auto"
          />
          <div className="flex flex-col p-5 space-y-10 bg-white">
            <h1 className="text-3xl border-b pb-4">
              {items.length === 0
                ? "Your Amazon Cart is Empty."
                : "Your Shopping Basket"}
            </h1>
            {items.map((item, i) => {
              return (
                <CheckoutProduct
                  key={i}
                  id={item.id}
                  title={item.title}
                  rating={item.rating}
                  price={item.price}
                  description={item.description}
                  category={item.category}
                  image={item.image}
                  hasPrime={item.hasPrime}
                />
              );
            })}
          </div>
        </div>
        {/**right */}
        <div className="flex flex-col bg-white p-10 shadow-md">
          {items.length > 0 && (
            <>
              <h2 className="whitespace-nowrap">
                Subtotal ({items.length} item{items.length > 1 && "s"})
                <span className="font-bold">
                  <Currency quantity={total} currency="CAD" />
                </span>
              </h2>
              <button
                role="link"
                onClick={createCheckoutSession}
                disabled={!session}
                className={`button mt-2 ${
                  !session &&
                  "from-gray-300 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed"
                }`}
              >
                {!session ? "Sign in to check out" : "Proceed to checkout"}
              </button>
            </>
          )}
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
export default Checkout;
