import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Header from "../components/Header";
import Banner from "../components/Banner";
import ProductFeed from "../components/ProductFeed";
import { getSession } from "next-auth/react";
const Home: NextPage<{ products: any }> = ({ products }) => {
  return (
    <div>
      <Head>
        <title>Amazon Clone</title>
        <link rel="icon" href="/favicon.ico" />
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
export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const session = await getSession(context);
  const products = await fetch("https://fakestoreapi.com/products").then(
    (res) => res.json()
  );
  return { props: { products, session } };
  // ...
};
export default Home;
