import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import Banner from "../components/Banner";
import ProductFeed from "../components/ProductFeed";
import Products from "../components/ProductFeed";
import { getSession, useSession } from "next-auth/react";
import { collection, getDocs } from "firebase/firestore";
import db from "../firebase";
import { addToCart, setCart } from "../slices/cartSlice";
import { useEffect } from "react";
const Home: NextPage<{ products: any; cart: any; session: any }> = ({
  products,
  cart,
  session,
}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (session) {
      dispatch(setCart(cart));
    }
  }, []);
  return (
    <div>
      <Head>
        <title>Amazon Clone</title>
        <link rel="icon" href="/amazon_favicon.ico" />
      </Head>
      <Header />
      <main className="max-w-screen-2xl mx-auto bg-gray-100">
        <Banner />
        <ProductFeed products={products} />
      </main>
    </div>
  );
};

//https://fakestoreapi.com/products
export const getServerSideProps: GetServerSideProps = async (context) => {
  const products = await fetch("https://fakestoreapi.com/products").then(
    (res) => res.json()
  );
  const session = await getSession(context);
  if (!session) {
    console.log("SESSION NOT FOUND");
    return { props: { products } };
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
    props: { products, cart, session },
  };
  // ...
};
export default Home;
