import { collection, doc, setDoc } from "firebase/firestore";
import db from "../../firebase";

export default async (req: any, res: any) => {
  const { id, title, price, description, category, image, count, email } =
    req.body;
  //add item to db
  const cartRef = collection(db, "users", email as string, "cart");
  setDoc(doc(cartRef, `item: ${id}`), {
    title: title,
    price: price,
    description: description,
    category: category,
    image: image,
    count: "add logic here",
  });
};
