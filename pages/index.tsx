import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Button } from "@chakra-ui/react";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>🎉 Math Time Is Fun Time</title>
        <meta name="description" content="Maths for kids" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Link href="./times" passHref>
          <Button>Times Time</Button>
        </Link>
      </main>
    </div>
  );
};

export default Home;
