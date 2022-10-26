import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import Header from "../components/Header";
import Banner from "../components/Banner";
const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Amazon Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="max-w-screen-2xl mx-auto">
        <Banner />
      </main>
    </div>
  );
};

export default Home;
