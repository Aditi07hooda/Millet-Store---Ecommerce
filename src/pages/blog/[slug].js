import BlogDetails from "@/components/Elements/BlogDetails";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function BlogDetail() {
  const router = useRouter();
  const { slug } = router.query;
  console.log(slug);
  const [blogData, setBlogData] = useState();

  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const brand_id = process.env.NEXT_PUBLIC_BRAND_ID;

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(
          `${base_url}/store/${brand_id}/blogs/${slug}`
        );
        const data = await response.json();
        setBlogData(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDetail();
  }, []);

  return (
    <>
    {blogData && (
        <BlogDetails title={blogData.title} snippet={blogData.snippet} content={blogData.content} />
    )}
    </>
  );
}
