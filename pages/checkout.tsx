import React, { useContext } from "react";
import Header from "../components/Header";
import Image from "next/image";
import CheckoutProduct from "../components/CheckoutProduct";
import { useSession } from "next-auth/react";
import Currency from "react-currency-formatter";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import moment from "moment";
import { CartContext } from "./_app";
const stripePromise = loadStripe(process.env.stripe_public_key as string);
type Props = {};

function Checkout({}: Props) {
  const cart: any = useContext(CartContext as any);
  const getTotal = () => {
    return cart
      .map((cartItem: any) => cartItem.price)
      .reduce((accumulator: any, value: any) => {
        return accumulator + value;
      }, 0);
  };
  const { data: session } = useSession();

  const createCheckoutSession = async () => {
    const stripe = await stripePromise;

    //now call backend to create checkout session
    const checkoutSession = await axios.post("/api/create-checkout-session", {
      items: cart,
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

        <div className="flex-grow m-5 shadow-sm">
          <Image
            src="/checkout_banner.png"
            width={1020}
            height={250}
            alt="Checkout Banner"
            className="object-contain"
          />
          <div className="flex flex-col p-5 space-y-10 bg-white">
            <h1 className="text-3xl border-b pb-4">
              {cart && cart.length === 0
                ? "Your Amazon Cart is Empty."
                : "Your Shopping Cart"}
            </h1>
            {cart &&
              cart.map(
                (
                  cartItem: {
                    id: any;
                    title: any;
                    price: any;
                    description: any;
                    category: any;
                    image: any;
                  },
                  i: any
                ) => {
                  return (
                    <CheckoutProduct
                      key={i}
                      id={cartItem.id}
                      title={cartItem.title}
                      price={cartItem.price}
                      description={cartItem.description}
                      category={cartItem.category}
                      image={cartItem.image}
                    />
                  );
                }
              )}
          </div>
        </div>
        {/**right */}
        <div className="flex flex-col bg-white p-10 shadow-md">
          {cart && cart.length > 0 && (
            <>
              <h2 className="whitespace-nowrap">
                Subtotal ({cart.length} item{cart.length > 1 && "s"})
                <span className="font-bold">
                  <Currency quantity={getTotal()} currency="CAD" />
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

export default Checkout;
