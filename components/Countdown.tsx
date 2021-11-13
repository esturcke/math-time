import { useEffect, useState } from "react";
import { Text } from "@chakra-ui/react";

type Props = {
  onDone: () => void;
};

const Countdown = ({ onDone }: Props) => {
  const [n, setN] = useState<number>(3);
  useEffect(() => {
    const id = setInterval(() => {
      setN((n) => n - 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (n < 0) onDone();
  }, [n, onDone]);
  return <Text fontSize="6xl">{n > 0 ? n : n === 0 ? "GO!" : null}</Text>;
};

export default Countdown;
