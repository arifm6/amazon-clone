import { useRouter } from "next/router";
import { AiFillCheckCircle } from "react-icons/ai";

import Header from "../components/Header";
type Props = {};

function success({}: Props) {
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

export default success;
