import React from 'react';
import Card from './Elements/ProductCard';
import DOMPurify from 'dompurify';

export default function CategoryBasedProduct({ products, categoryName, categoryDescription }) {
    if (!products || products.length === 0) {
        return <p>No products found for this category.</p>;
    }

    console.log(products)

    const sanitizedDescription = DOMPurify.sanitize(categoryDescription);

    return (
        <div>
            <ul>
                <section key={categoryName} className="mb-8 mx-2">
                    <h2 className="text-xl font-semibold my-4">{categoryName}</h2>
                    <p
                        className="text-gray-600 mb-4"
                        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                    />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {products.map(product => (
                            <Card key={product.id} product={product} categoryName={categoryName} />
                        ))}
                    </div>
                </section>
            </ul>
        </div>
    );
}
