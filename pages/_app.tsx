import "../styles/globals.css";
import type { AppContext, AppInitialProps, AppProps } from "next/app";
import { getSession, SessionProvider } from "next-auth/react";
import { collection, getDocs } from "firebase/firestore";
import db from "../firebase";
import App from "next/app";
import { useState, createContext, useContext } from "react";
export const CartContext = createContext([]);

type AppOwnProps = {
  cart: any;
};
function MyCustomApp({ Component, pageProps, cart }: AppProps & AppOwnProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <CartContext.Provider value={cart}>
        <Component {...pageProps} />
      </CartContext.Provider>
    </SessionProvider>
  );
}

export default MyCustomApp;
MyCustomApp.getInitialProps = async (
  context: AppContext
): Promise<AppOwnProps & AppInitialProps> => {
  const ctx: any = await App.getInitialProps(context);
  const session = await getSession(context as any);
  if (!session) {
    console.log("SESSION NOT FOUND");
    return {
      ...ctx,
    };
  }
  const databaseCart = await getDocs(
    collection(db, "users", session?.user?.email as string, "cart")
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
  return { ...ctx, cart: cart };
};
