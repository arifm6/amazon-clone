import Header from "../components/Header";
import { getSession, useSession } from "next-auth/react";
import db from "../firebase";
import {
  collection,
  orderBy,
  doc,
  getDocs,
  QuerySnapshot,
  query,
} from "firebase/firestore";
import moment from "moment";
import Order from "../components/Order";
type Props = {
  orders: any;
};

function Orders({ orders }: Props) {
  console.log(orders);
  const { data: session, status } = useSession();
  return (
    <div>
      <Header />
      <main className="max-w-screen-lg mx-auto p-10">
        <h1 className="text-3xl border-b mb-2 pb-1 border-yellow-400">
          Your orders
        </h1>
        {status === "authenticated"
          ? `${orders.length} order${orders.length === 1 ? "" : "s"}`
          : "Please sign in to see your orders"}
        <div className="mt-5 space-y-4 ">
          {orders?.map(
            ({ id, amount, amountShipping, items, timestamp, images }: any) => (
              <Order
                key={id}
                id={id}
                amount={amount}
                amountShipping={amountShipping}
                items={items}
                timestamp={timestamp}
                images={images}
              />
            )
          )}
        </div>
      </main>
    </div>
  );
}

export default Orders;

export async function getServerSideProps(context: any) {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  //get users logged in credentials

  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
    };
  }
  // firebase db
  const stripeOrders = await getDocs(
    query(
      collection(db, "users", session?.user?.email as string, "orders"),
      orderBy("timestamp", "desc")
    )
  );
  //stripe orders
  const orders = await Promise.all(
    stripeOrders.docs.map(async (order) => ({
      id: order.id,
      amount: order.data().amount,
      amountShipping: order.data().amount_shipping,
      images: order.data().images,
      timestamp: moment(order.data().timestamp.toDate()).unix(),
      items: await stripe.checkout.sessions.listLineItems(order.id, {
        limit: 100,
      }),
    }))
  );

  return { props: { orders } };
}
