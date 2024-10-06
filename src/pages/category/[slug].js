// pages/category/[slug].js
import React from 'react';
import CategoryBasedProduct from '../../components/CategoryBasedProduct';
import { useRouter } from 'next/router';
import Loader from '@/components/UI/Loader';

// Dynamic category page component
export default function CategoryPage({ products, categoryName, categoryDescription }) {
  const router = useRouter();

  console.log(products , categoryName)

  // Show loading state when the page is being built
  if (router.isFallback) {
    return <div><Loader /></div>;
  }

  return <CategoryBasedProduct products={products} categoryName={categoryName} categoryDescription={categoryDescription} />;
}

// Fetch the paths for static generation
export async function getStaticPaths() {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const brand_id = process.env.NEXT_PUBLIC_BRAND_ID;

  // Fetch categories to get their IDs
  const res = await fetch(`${base_url}/store/${brand_id}/categories`);
  const categories = await res.json();

  // Create paths for each category using their IDs
  const paths = categories.map((category) => ({
    params: { slug: category.id }, 
  }));

  return { paths, fallback: true };
}

// Fetch products for a specific category
export async function getStaticProps({ params }) {
  const { slug } = params; // Get the slug from params
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const brand_id = process.env.NEXT_PUBLIC_BRAND_ID;

  // Fetch products based on the category ID
  const res = await fetch(`${base_url}/store/${brand_id}/categories/${slug}/products`);
  const products = await res.json();

  // Fetch category info to get the name
  const categoryRes = await fetch(`${base_url}/store/${brand_id}/categories`);
  const categories = await categoryRes.json();
  const category = categories.find(cat => cat.id === slug);

  return {
    props: {
      products,
      categoryName: category ? category.name : 'Unknown Category',
      categoryDescription : category ? category.description : 'Unknown Description',
    },
    revalidate: 10,
  };
}
