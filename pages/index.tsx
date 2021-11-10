import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>🎉 Math Time Is Fun Time</title>
        <meta name="description" content="Maths for kids" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Link href="./times">Times Time</Link>
      </main>
    </div>
  );
};

export default Home;
