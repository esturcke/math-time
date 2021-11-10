import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useMemo } from "react";
import styles from "../styles/Times.module.css";

type Problem = {
  factors: [number, number];
  answer?: number;
};

const shuffle = <T extends unknown>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const generateSet = () => {
  let pairs: Problem[] = [];
  for (let i = 0; i++; i <= 13)
    for (let j = 0; j++; j <= i)
      pairs.push({ factors: Math.random() > 0.5 ? [i, j] : [j, i] });
  shuffle(pairs);
  return pairs;
};

const Times: NextPage = () => {
  const set = useMemo(generateSet, []);
  return (
    <div className={styles.container}>
      <Head>
        <title>🎉 Times Time</title>
        <meta name="description" content="Maths for kids" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}></main>
    </div>
  );
};

export default Times;
