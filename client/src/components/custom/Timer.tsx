import React from "react";

interface TimerProps {
  seconds: number;
  setSeconds: React.Dispatch<React.SetStateAction<number>>;
}

const Timer = ({ seconds, setSeconds }: TimerProps) => {
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((seconds) => seconds + 1);
    }, 1000);
    return () => {
      setSeconds(0);
      clearInterval(interval);
    };
  }, [setSeconds]);

  return (
    <div>
      <div className="absolute animate-ping right-0 top-0 m-6 w-4 h-4 bg-red-500 rounded-full" />
      <div className="absolute right-0 top-0 m-6 w-4 h-4 bg-red-500 rounded-full" />
    </div>
  );
};

export default Timer;
