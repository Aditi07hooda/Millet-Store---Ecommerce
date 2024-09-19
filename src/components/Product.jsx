import React, { useEffect, useState } from 'react';
import Card from './Elements/Card';

const Product = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const base_url = process.env.NEXT_PUBLIC_BASE_URL;
    const brand_id = process.env.NEXT_PUBLIC_BRAND_ID;

    useEffect(() => {
        const getProducts = async () => {
            try {
                const response = await fetch(`${base_url}/store/${brand_id}/products`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                console.log('Successful fetch:', data);
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        getProducts();
    }, [base_url, brand_id]);

    if (loading) return <p>Loading products...</p>;
    if (error) return <p>Error loading products: {error}</p>;

    // Group products by category
    const categorizedProducts = products.reduce((acc, product) => {
        const categoryName = product.category.name || 'Uncategorized';
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(product);
        return acc;
    }, {});

    return (
        <div>
            {Object.keys(categorizedProducts).length > 0 ? (
                Object.entries(categorizedProducts).map(([categoryName, products]) => (
                    <section key={categoryName} className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">{categoryName}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {products.slice(0,3).map(product => (
                                <Card key={product.id} product={product} categoryName={categoryName} />
                            ))}
                        </div>
                    </section>
                ))
            ) : (
                <p>No products available</p>
            )}
        </div>
    );
};

export default Product;
