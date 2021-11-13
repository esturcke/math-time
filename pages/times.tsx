import type { NextPage } from "next";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Link,
  Progress,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { createIcon } from "@chakra-ui/icons";
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
const questions = 20;

const generateSet = () => {
  let pairs: Problem[] = [];
  for (let i = range[0]; i <= range[1]; i++)
    for (let j = range[0]; j <= i; j++)
      pairs.push({ factors: Math.random() > 0.5 ? [i, j] : [j, i] });
  shuffle(pairs);
  return pairs.slice(0, questions);
};

const Quiz = ({ onDone }: { onDone: (set: Problem[]) => void }) => {
  const [set, setSet] = useState(generateSet);
  const [n, setN] = useState(0);
  const toast = useToast();
  // check if done
  useEffect(() => {
    if (n >= set.length) onDone(set);
  }, [n, onDone, set]);

  // callback to set answer
  const answer = useCallback(
    ({ n, answer }: { n: number; answer: number }) => {
      if (set[n].factors[0] * set[n].factors[1] !== answer) {
        toast({ title: "Nope, try again.", status: "error" });
      } else {
        toast({ title: "That's right!", status: "success" });
        setSet(
          produce((draft) => {
            draft[n].answer = answer;
          })
        );
        setN(n + 1);
      }
      setValue("");
    },
    [set, toast]
  );

  const [value, setValue] = useState("");
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setValue(e.target.value);

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      answer({ n, answer: parseInt(value, 10) });
    }
  };

  return n >= set.length ? null : (
    <Stack>
      <Text>
        {n + 1} of {set.length}
      </Text>
      <Progress size="xs" width="3xs" value={(100 * n) / set.length} />
      <Flex alignItems="center" sx={{ gap: 10 }}>
        <Text fontSize="6xl" whiteSpace="nowrap">
          {set[n].factors[0]} × {set[n].factors[1]} ={" "}
        </Text>
        <Box position="relative">
          <Input
            type="number"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            autoFocus
            fontSize="6xl"
            height="2em"
            width="4ch"
            variant="flushed"
          />
        </Box>
      </Flex>
    </Stack>
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
        Score: <b>{score}</b>
      </Text>
    </Flex>
  );
};

const HomeIcon = createIcon({
  viewBox: "0 0 576 512",
  d: "M570.24 215.42L323.87 13a56 56 0 0 0-71.75 0L5.76 215.42a16 16 0 0 0-2 22.54L14 250.26a16 16 0 0 0 22.53 2L64 229.71V288h-.31v208a16.13 16.13 0 0 0 16.1 16H496a16 16 0 0 0 16-16V229.71l27.5 22.59a16 16 0 0 0 22.53-2l10.26-12.3a16 16 0 0 0-2.05-22.58zM464 224h-.21v240H352V320a32 32 0 0 0-32-32h-64a32 32 0 0 0-32 32v144H111.69V194.48l.31-.25v-4L288 45.65l176 144.62z",
});

const RestartIcon = createIcon({
  viewBox: "0 0 512 512",
  d: "M500 8h-27.711c-6.739 0-12.157 5.548-11.997 12.286l2.347 98.568C418.075 51.834 341.788 7.73 255.207 8.001 118.82 8.428 7.787 120.009 8 256.396 8.214 393.181 119.165 504 256 504c63.926 0 122.202-24.187 166.178-63.908 5.113-4.618 5.354-12.561.482-17.433l-19.738-19.738c-4.498-4.498-11.753-4.785-16.501-.552C351.787 433.246 306.105 452 256 452c-108.322 0-196-87.662-196-196 0-108.322 87.662-196 196-196 79.545 0 147.941 47.282 178.675 115.302l-126.389-3.009c-6.737-.16-12.286 5.257-12.286 11.997V212c0 6.627 5.373 12 12 12h192c6.627 0 12-5.373 12-12V20c0-6.627-5.373-12-12-12z",
});

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
          <Button
            size="lg"
            fontSize="2xl"
            onClick={() => setState("countdown")}
          >
            Start!
          </Button>
        ) : state === "countdown" ? (
          <Countdown onDone={() => setState("start")} />
        ) : state === "start" ? (
          <Quiz onDone={setState} />
        ) : (
          <div>
            <Results set={state} time={Date.now() - startTime} />
            <Stack spacing={4} direction="row" align="center">
              <Link href="./">
                <Button leftIcon={<HomeIcon />} size="lg" fontSize="2xl">
                  Home
                </Button>
              </Link>
              <Button
                leftIcon={<RestartIcon />}
                size="lg"
                fontSize="2xl"
                onClick={() => setState("countdown")}
              >
                Restart
              </Button>
            </Stack>
          </div>
        )}
      </main>
    </div>
  );
};

export default Times;
