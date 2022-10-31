import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import db from "../../firebase";

export default async (req: any, res: any) => {
  const { id, title, price, description, category, image, count, email } =
    req.body;
  await deleteDoc(doc(db, "users", email, "cart", `${id}`));
  res
    .status(200)
    .json({ message: `successfully deleted item: ${id} from the DB` });
};
