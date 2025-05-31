import { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const App = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <Head>
        <link rel="icon" type="image/svg+xml" href="/webIcon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>KosBaliku</title>
        </Head>
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
};

export default App;
