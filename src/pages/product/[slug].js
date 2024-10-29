import React from "react";
import { useRouter } from "next/router";
import CardDetails from "@/components/Elements/ProductCardDetails";
import { getSessionId } from "@/store/LocalStorage";
import Loader from "@/components/UI/Loader";

export default function ProductPage({ products }) {
  const router = useRouter();

  // Show loading state when the page is being built
  if (router.isFallback) {
    return (
      <div>
        <Loader />
      </div>
    );
  }
  return (
    <div>
      <CardDetails product={products} />
    </div>
  );
}

export async function getStaticPaths() {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const brand_id = process.env.NEXT_PUBLIC_BRAND_ID;

  // Fetch products to get their slug name
  const sessionId = getSessionId();
  console.log("loadProducts with session", sessionId);
  const res = await fetch(`${base_url}/store/${brand_id}/products`, {
    headers: {
      session: sessionId,
    },
  });
  const products = await res.json();

  // Create paths for each product using their slug name
  const paths = products.map((product) => ({
    params: { slug: product.slug },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const { slug } = params; // Get the slug from params
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const brand_id = process.env.NEXT_PUBLIC_BRAND_ID;
  const sessionId = getSessionId();
  // Fetch product details based on the slug name
  const res = await fetch(`${base_url}/store/${brand_id}/products`, {
    headers: {
      session: sessionId,
    },
  });
  const product = await res.json();
  const desiredProduct = product.find((pro) => pro.slug === slug);

  if (!desiredProduct) {
    return { notFound: true };
  }
  const result = await fetch(
    `${base_url}/store/${brand_id}/products/${desiredProduct.id}`,
    {
      headers: {
        session: sessionId,
      },
    }
  );
  const productData = await result.json();
  return { props: { products: productData }, revalidate: 10 };
}
