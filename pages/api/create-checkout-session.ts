import type { NextApiRequest, NextApiResponse } from "next";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async (req: any, res: any) => {
  const { items, email } = req.body;
  const transformedItems = items.map(
    (item: { description: any; price: number; title: any; image: any }) => ({
      quantity: 1,
      price_data: {
        currency: "CAD",
        unit_amount: item.price * 100,
        product_data: {
          name: item.title,
          images: [item.image],
          description: item.description,
        },
      },
    })
  );
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_options: [
      { shipping_rate: "shr_1Ly6FqJm0yvb4rVggH3NJlJP" },
      { shipping_rate: "shr_1Ly7KCJm0yvb4rVgQscecbTQ" },
    ],
    shipping_address_collection: {
      allowed_countries: ["GB", "US", "CA"],
    },
    line_items: transformedItems,
    mode: "payment",
    success_url: `${process.env.HOST}/success`,
    cancel_url: `${process.env.HOST}/checkout`,
    metadata: {
      email,
      images: JSON.stringify(items.map((item: { image: any }) => item.image)),
    },
  });
  res.status(200).json({ id: session.id });
};
