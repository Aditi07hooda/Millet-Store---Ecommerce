import React from "react";
import Card from "./ProductCard";

export default function CollectionsProduct({ collection, collectionProducts }) {
  return (
    <>
      <div className="p-3">
        <h3 className="text-xl font-semibold mb-3">{collection.name}</h3>
        <div className="grid grid-flow-row lg:grid-cols-5 lg:gap-3 grid-cols-2 gap-2">
          {collectionProducts.map((product) => (
            <div key={product.id}>
              <Card product={product} categoryName={collection.name} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
