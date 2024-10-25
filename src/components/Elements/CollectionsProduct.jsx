import React from "react";
import Card from "./Card";

export default function CollectionsProduct({ collection, collectionProducts }) {
  return (
    <>
      <h3>{collection.name}</h3>
      {collectionProducts.map((product) => (
        <div key={product.id}>
          <Card product={product} categoryName={collection.name} />
        </div>
      ))}
    </>
  );
}
