import { Html, Head, Main, NextScript } from "next/document";
import { useState, useEffect } from "react";

export default function Document() {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const brand_id = process.env.NEXT_PUBLIC_BRAND_ID;

  const [state, setState] = useState();

  const metaData = async () => {
    const res = fetch(`${base_url}/store/${brand_id}/config?key=SITE_KEYWORDS`);
    const data = await res.json();
    setState(data);
  };

  useEffect(() => {
    metaData();
  }, []);

  return (
    <Html lang="en">
      <Head>
        <meta name="description" content={state} />
        <title>The Millet Store - We Make Food Delicious</title>
        <link
          rel="icon"
          href="https://ms-profiles.objectstore.e2enetworks.net/201816-KFb-logo-dark.png"
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
