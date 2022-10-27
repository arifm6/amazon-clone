import React from "react";
import Product from "./Product";
type Props = {
  products: any;
};

function ProductFeed({ products }: Props) {
  products.map((product: any) => {
    <p>hello</p>;
  });
  return (
    <div>
      <h1>Products here</h1>
      <>
        {products.map(
          ({ id, title, price, description, category, image }: any) => {
            return (
              <Product
                key={id}
                id={id}
                title={title}
                price={price}
                description={description}
                category={category}
                image={image}
              />
            );
          }
        )}
      </>
    </div>
  );
}

export default ProductFeed;
