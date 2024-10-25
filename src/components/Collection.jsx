import React, { useEffect, useState } from "react";
import { getSessionId } from "@/store/LocalStorage";
import { useRouter } from "next/router";

export default function Collection() {
  const router = useRouter();
  const [state, setState] = useState({
    collection: [],
  });

  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const brand_id = process.env.NEXT_PUBLIC_BRAND_ID;

  const fetchCollections = async () => {
    const res = await fetch(`${base_url}/store/${brand_id}/collections`, {
      headers: { session: getSessionId() },
    });
    const data = await res.json();
    setState((prev) => {
      return {
        ...prev,
        collection: data,
      };
    });
  };

  const handleCollectionClick = (name) => {
    router.push(`/collections/${name}`);
  };

  useEffect(() => {
    fetchCollections();
  }, []);


  return (
    <>
      <h1>Collection</h1>
      {state.collection.map((collection) => (
        <div key={collection.id} onClick={()=> handleCollectionClick(collection.name)} className="cursor-pointer">
          <h2>{collection.name}</h2>
        </div>
      ))}
    </>
  );
}
