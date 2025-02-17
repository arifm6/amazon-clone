import { buffer } from "micro";
import * as admin from "firebase-admin";
const { getFirestore } = require("firebase-admin/firestore");

//secure connection to firebase from our backend.
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  : admin.app();
const db = getFirestore();

//establish connection to stripe

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

const fulfillOrder = async (session) => {
  //console.log("fulfilling order", session);

  const output = db
    .collection("users")
    .doc(session.metadata.email)
    .collection("orders")
    .doc(session.id)
    .set({
      amount: session.amount_total / 100,
      amount_shipping: session.total_details.amount_shipping / 100,
      images: JSON.parse(session.metadata.images),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    })
    .then(() =>
      console.log(`SUCCESS: Order ${session.id} has been added to the database`)
    );
  await db
    .collection("users")
    .doc(session.metadata.email)
    .collection("cart")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // Delete each cart item
        doc.ref.delete();
      });
    });
  return output;
  /*
  return 
   reference:
  

    collection(
    app.firestore(),
    "users",
    session.metadata.email,
    "orders",
    session.id
  )
    .set({
      amount: session.amount_total / 100,
      amount_shipping: session.total_details.amount_shipping / 100,
      images: JSON.parse(session.metadata.images),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    })
    .then(() =>
      console.log(`SUCCESS: Order ${session.id} has been added to the database`)
    );
    */
};
export default async (req, res) => {
  if (req.method === "POST") {
    const requestBuffer = await buffer(req);
    const payload = requestBuffer.toString();
    const sig = req.headers["stripe-signature"];

    let event;

    //verify event posted came from stripe
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      console.log(`console Webhook error: ${err.message}`);
      return res.status(400).send(`Webhook error: ${err.message}`);
    }
    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      //fullfil order AKA put it inside database.
      return fulfillOrder(session)
        .then(() => {
          return res.status(200);
        })
        .catch((err) => {
          res.status(400).send(`Webhook error: ${err.message}`);
        });
    }
  }
};

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
