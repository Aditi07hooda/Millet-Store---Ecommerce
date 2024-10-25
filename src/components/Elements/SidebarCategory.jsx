import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card, Typography, List, ListItem } from "@material-tailwind/react";
import { Disclosure } from "@headlessui/react";
import Loader from '../UI/Loader';
import { useRouter } from 'next/router';
import { getSessionId } from "@/store/LocalStorage";

export default function SidebarCategory({ isMobile }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const brand_id = process.env.NEXT_PUBLIC_BRAND_ID;

  useEffect(() => {
    const getCategories = async () => {
      try {
        let sessionId = getSessionId();
        const response = await fetch(`${base_url}/store/${brand_id}/categories`, {
          headers: {
            session: sessionId,
          },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, [base_url, brand_id]);

  if (loading) return <Loader />;
  if (error) return <p>Error loading Categories: {error}</p>;

  // Function to handle category click and navigate to CategoryBasedProduct component
  const handleCategoryClick = (slug) => {
    router.push(`/category/${slug}`);
  };

  return (
    <Disclosure as="nav" className={`relative ${isMobile ? 'block sm:hidden' : 'hidden sm:block'}`}>
      {() => (
        <>
          <Card className={`${isMobile ? 'w-full h-full' : 'max-w-[20rem] h-auto'} shadow-xl shadow-blue-gray-900/5`}>
            <div className="bg-primary p-4 flex justify-between">
              <Typography
                variant="h5"
                color="blue-gray"
                className="text-white font-semibold text-lg"
              >
                Categories
              </Typography>
            </div>
            <div className={`overflow-y-auto ${isMobile ? 'max-h-full' : 'h-auto'}`}>
              <List className="bg-secondary bg-opacity-15">
                {categories.map((category) => (
                  <ListItem
                    key={category.id} // Use category.id for the key
                    onClick={() => handleCategoryClick(category.slug)} // Use category.slug as slug
                    className="relative hover:bg-primary hover:bg-opacity-20 flex items-center cursor-pointer text-black"
                  >
                    {category.imageUrl && (
                      <Image
                        src={category.imageUrl}
                        alt={category.name}
                        width={28}
                        height={28}
                        sizes="(max-width: 640px) 20px, 28px"
                        className="h-auto w-auto max-w-[28px] max-h-[28px] sm:max-w-[36px] sm:max-h-[36px] rounded-full mr-3"
                      />
                    )}
                    <Typography variant="small" className="text-sm sm:text-sm">
                      {category.name}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </div>
          </Card>
        </>
      )}
    </Disclosure>
  );
}
