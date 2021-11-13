import type { NextPage } from "next";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import Countdown from "../components/Countdown";
import produce from "immer";

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

const range = [0, 12];

const generateSet = () => {
  let pairs: Problem[] = [];
  for (let i = range[0]; i <= range[1]; i++)
    for (let j = range[0]; j <= i; j++)
      pairs.push({ factors: Math.random() > 0.5 ? [i, j] : [j, i] });
  shuffle(pairs);
  return pairs;
};

const Quiz = ({ onDone }: { onDone: (set: Problem[]) => void }) => {
  const [set, setSet] = useState(generateSet);
  const [n, setN] = useState(0);

  // check if done
  useEffect(() => {
    if (n >= set.length) onDone(set);
  }, [n, onDone, set]);

  // callback to set answer
  const answer = useCallback(({ n, answer }: { n: number; answer: number }) => {
    setSet(
      produce((draft) => {
        draft[n].answer = answer;
      })
    );
    setN(n + 1);
    setValue("");
  }, []);

  const [value, setValue] = useState("");
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setValue(e.target.value);

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      answer({ n, answer: Number.parseInt(value, 10) });
    }
  };

  return n >= set.length ? null : (
    <Flex alignItems="center" sx={{ gap: 10 }}>
      <Text fontSize="6xl" whiteSpace="nowrap">
        {set[n].factors[0]} × {set[n].factors[1]} ={" "}
      </Text>
      <Input
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoFocus
        fontSize="6xl"
        height="2em"
        width="4ch"
        variant="flushed"
      />
    </Flex>
  );
};

const Results = ({ set, time }: { set: Problem[]; time: number }) => {
  const mistakes = set.filter(
    ({ factors, answer }) => factors[0] * factors[1] !== answer
  );
  const score = Math.max(
    Math.round(
      (set.length * 10000) / (time / 1000 + 100 * mistakes.length) - 100
    ),
    0
  );
  return (
    <Flex alignItems="center" sx={{ gap: 10 }}>
      <Text fontSize="6xl" whiteSpace="nowrap">
        {score}
      </Text>
    </Flex>
  );
};

const Times: NextPage = () => {
  const [state, setState] = useState<
    "ready" | "countdown" | "start" | Problem[]
  >("ready");
  const [startTime, setStartTime] = useState<number>(0);
  console.log(state);
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
        ) : state === "start" ? (
          <Quiz onDone={setState} />
        ) : (
          <Results set={state} time={Date.now() - startTime} />
        )}
      </main>
    </div>
  );
};

export default Times;
