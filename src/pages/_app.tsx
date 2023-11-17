import { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    
      <Head>
      
        <title>JMangoes</title>
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
};
