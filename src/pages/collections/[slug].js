import React from "react";
import { getSessionId } from "@/store/LocalStorage";
import { useRouter } from "next/router";
import CollectionsProduct from "@/components/Elements/CollectionsProduct";
import Loader from "@/components/UI/Loader";

export default function collectionPage({ collection, products }) {
  const router = useRouter();
  if (router.isFallback) {
    return (
      <div>
        <Loader />
      </div>
    );
  }
  return (
    <CollectionsProduct collection={collection} collectionProducts={products} />
  );
}

export const getStaticPaths = async() => {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const brand_id = process.env.NEXT_PUBLIC_BRAND_ID;

  //   fetch collections api to get name
  const res = await fetch(`${base_url}/store/${brand_id}/collections`, {
    headers: {
      session: getSessionId(),
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch collections: ${res.status}`);
  }

  const collections = await res.json();

  const paths = collections.map((collection) => ({
    params: { slug: collection.name },
  }));

  console.log(paths)

  return { paths, fallback: 'blocking' };
}

export const getStaticProps = async({ params }) => {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const brand_id = process.env.NEXT_PUBLIC_BRAND_ID;
  const { slug } = params;

  // fetch collection to find corresponding id to the slug
  const res = await fetch(`${base_url}/store/${brand_id}/collections`, {
    headers: {
      session: getSessionId(),
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch collections: ${res.status}`);
  }
  const collections = await res.json();
  console.log(collections)

  const collection = collections.find((c) => c.name === slug);

  if (!collection) {
    return { notFound: true };
  }

  // fetch products for the collection
  const productRes = await fetch(
    `${base_url}/store/${brand_id}/collections/${collection.id}/products`,
    {
      headers: {
        session: getSessionId(),
      },
    }
  );

  if (!productRes.ok) {
    throw new Error(
      `Failed to fetch products for collection: ${productRes.status}`
    );
  }

  const products = await productRes.json();
  return {
    props: {
      collection,
      products,
    },
    revalidate: 60,
  };
}
