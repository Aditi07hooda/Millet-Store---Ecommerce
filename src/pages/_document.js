import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>The Millet Store</title>
        <meta
          name="description"
          content="The Millet Store specialises in making ready mixes and special attas, which are easy to use and store. The ingredients are freshly sourced and each product is customised to suit the taste and varying requirements of our customers. If you want it, we can make it!"
        />
        <link rel="icon" href="https://ms-profiles.objectstore.e2enetworks.net/201816-KFb-logo-dark.png" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
