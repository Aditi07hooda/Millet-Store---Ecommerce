// pages/category/[slug].js
import React from "react";
import CategoryBasedProduct from "../../components/CategoryBasedProduct";
import { useRouter } from "next/router";
import Loader from "@/components/UI/Loader";
import { getSessionId } from "@/store/LocalStorage";

// Dynamic category page component
export default function CategoryPage({
  products,
  categoryName,
  categoryDescription,
}) {
  const router = useRouter();

  console.log(products, categoryName);

  // Show loading state when the page is being built
  if (router.isFallback) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <CategoryBasedProduct
      products={products}
      categoryName={categoryName}
      categoryDescription={categoryDescription}
    />
  );
}

// Fetch the paths for static generation
export async function getStaticPaths() {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const brand_id = process.env.NEXT_PUBLIC_BRAND_ID;

  // Fetch categories to get their slug name
  const sessionId = getSessionId();
  console.log("loadCategories with session", sessionId);
  const res = await fetch(`${base_url}/store/${brand_id}/categories`, {
    headers: {
      session: sessionId,
    },
  });
  const categories = await res.json();

  // Create paths for each category using their slug name
  const paths = categories.map((category) => ({
    params: { slug: category.slug },
  }));

  return { paths, fallback: true };
}

// Fetch products for a specific category
export async function getStaticProps({ params }) {
  const { slug } = params; // Get the slug from params
  console.log(slug)
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const brand_id = process.env.NEXT_PUBLIC_BRAND_ID;

  // Fetch categories to find the ID corresponding to the slug
  const categoryRes = await fetch(`${base_url}/store/${brand_id}/categories`, {
    headers: { session: getSessionId() },
  });
  const categories = await categoryRes.json();
  const category = categories.find((cat) => cat.slug === slug);

  // Check if category is found
  if (!category) {
    return {
      notFound: true,
    };
  }

  // Fetch products based on the category ID
  const res = await fetch(
    `${base_url}/store/${brand_id}/categories/${category.id}/products`,
    {
      headers: { session: getSessionId() },
    }
  );
  const products = await res.json();

  return {
    props: {
      products,
      categoryName: category.name,
      categoryDescription: category.description,
    },
    revalidate: 10,
  };
}
