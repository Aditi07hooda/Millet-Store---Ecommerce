import React, { useEffect, useState } from "react";
import { getSessionId } from "@/store/LocalStorage";
import { useRouter } from "next/router";
import {
  Card as CardLayout,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import Image from "next/image";

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
      <div className="m-5">
        <h1 className="text-3xl font-semibold mb-4">Millet Collection</h1>
        <div className="p-2">
          <div className="grid grid-flow-row lg:grid-cols-5 lg:gap-3 grid-cols-2 gap-2">
            {state.collection.map((collection) => (
              <div
                key={collection.id}
                onClick={() => handleCollectionClick(collection.name)}
                className="cursor-pointer"
              >
                <CardLayout className="bg-secondary bg-opacity-25">
                  <CardHeader>
                    <Typography variant="h3" className="font-semibold truncate">
                      {collection.name}
                    </Typography>
                  </CardHeader>
                  <CardBody>
                    {collection.image_url === undefined ||
                    collection.image_url === null ? (
                      ""
                    ) : (
                      <div className="h-52">
                        <Image
                          src={
                            collection.image_url === null
                              ? ""
                              : collection.image_url
                          }
                          alt={collection.name}
                          className="w-full h-auto object-cover"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}
                  </CardBody>
                  <CardFooter>
                    <Typography variant="subtitle1" className="text-gray-400">
                      {collection.brand.name}
                    </Typography>
                  </CardFooter>
                </CardLayout>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
