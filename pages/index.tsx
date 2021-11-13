import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Text } from "@chakra-ui/react";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>🎉 Math Time Is Fun Time</title>
        <meta name="description" content="Maths for kids" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Text fontSize="6xl">
          <Link href="./times">Times Time</Link>
        </Text>
      </main>
    </div>
  );
};

export default Home;
