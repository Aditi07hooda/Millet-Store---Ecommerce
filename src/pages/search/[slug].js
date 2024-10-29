import React, { useEffect, useState } from "react";
import { getSessionId } from "@/store/LocalStorage";
import { useRouter } from "next/router";
import logo from "../../Image/logo.png";
import {
  Card as CardLayout,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import DOMPurify from "dompurify";

export default function SearchPage() {
  const router = useRouter();
  const [slug, setSlug] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const brand_id = process.env.NEXT_PUBLIC_BRAND_ID;

  const handleProductClick = (slug) => {
    router.push(`/product/${slug}`);
  };

  const search = async (term) => {
    if (!term) return;

    try {
      const res = await fetch(
        `${base_url}/store/${brand_id}/search?q=${encodeURIComponent(term)}`,
        {
          method: "GET",
          headers: {
            session: getSessionId(),
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to search for products");
      }
      const data = await res.json();
      setSearchResults(data.results);
      console.log("Search term:", term);
      console.log("Search results:", data);
    } catch (error) {
      console.error("Error fetching search results:", error.message);
    }
  };

  const formatDescription = (description) => {
    return DOMPurify.sanitize(description);
  };

  useEffect(() => {
    if (router.query.slug) {
      setSlug(router.query.slug);
    }
  }, [router.query.slug]);

  useEffect(() => {
    if (slug) {
      search(slug);
    }
  }, [slug]);

  return (
    <div className="container mx-auto px-2 sm:px-6 lg:px-8 pb-3">
      <h1 className="text-3xl font-bold py-5 flex justify-center">
        Search Results for {slug}
      </h1>
      {searchResults.length > 0 ? (
        <div className="grid grid-flow-row lg:grid-cols-3 lg:gap-3 grid-cols-1 gap-2">
          {searchResults.map((result, index) => (
            <div key={index} onClick={() => handleProductClick(result.slug)}>
              <CardLayout className="bg-secondary bg-opacity-25 transition-transform duration-300 cursor-pointer">
                <CardHeader
                  shadow={"false"}
                  floated={"false"}
                  className="relative"
                >
                  {result.oneImg ? (
                    <img
                      src={result.oneImg}
                      alt={result.name}
                      className="h-auto max-w-full w-max rounded-lg"
                      //layout="fill"
                      // objectFit="cover"
                    />
                  ) : (
                    <img
                      alt="The millet store"
                      src={logo.src}
                      className="h-auto max-w-full w-max rounded-lg"
                    />
                  )}
                </CardHeader>
                <CardBody>
                  <div className="mb-2 flex items-center justify-between">
                    <Typography
                      color="blue-gray"
                      className="cursor-default font-semibold truncate whitespace-nowrap text-xl"
                    >
                      {result.name}
                    </Typography>
                  </div>
                  <div className="mb-1 flex items-center justify-between">
                    {result.ingredients && (
                      <Typography
                        color="gray"
                        className="font-small text-gray-400"
                      >
                        <b className="text-black">Ingredients:</b>{" "}
                        {result.ingredients.map((item, index) => (
                          <span key={index}>
                            {item}
                            {index < result.ingredients.length - 1 && ", "}
                          </span>
                        ))}
                      </Typography>
                    )}
                  </div>
                  <div className="mb-1 flex items-center justify-between">
                    <Typography
                      color="gray"
                      className="font-small text-gray-400"
                    >
                      <p
                        className="text-gray-600 mb-4"
                        dangerouslySetInnerHTML={{
                          __html: formatDescription(result.description),
                        }}
                      />
                    </Typography>
                  </div>
                </CardBody>
              </CardLayout>
            </div>
          ))}
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
}
