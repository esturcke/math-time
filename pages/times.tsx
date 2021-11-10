import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@chakra-ui/react";
import Countdown from "../../components/Countdown";

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
  const [set, setSet] = useState(generateSet);
  const [state, setState] = useState<"ready" | "countdown" | "start" | "done">(
    "ready"
  );
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    if (state === "start") setStartTime(Date.now());
  }, [state]);

  return (
    <div>
      <Head>
        <title>🎉 Times Time</title>
        <meta name="description" content="Maths for kids" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {state === "ready" ? (
          <Button onClick={() => setState("countdown")}>Start!</Button>
        ) : state === "countdown" ? (
          <Countdown onDone={() => setState("start")} />
        ) : null}
      </main>
    </div>
  );
};

export default Times;
