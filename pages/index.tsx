import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import Banner from "../components/Banner";
import ProductFeed from "../components/ProductFeed";
import Products from "../components/ProductFeed";
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
export const getServerSideProps: GetServerSideProps = async (context) => {
  const products = await fetch("https://fakestoreapi.com/products").then(
    (res) => res.json()
  );
  return { props: { products } };
  // ...
};
export default Home;
