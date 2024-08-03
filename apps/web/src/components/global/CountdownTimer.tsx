"use client";

import { useState, useEffect } from "react";

const CountdownTimer = ({ initialMinutes = 0, initialSeconds = 0 }) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const timerId = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else {
        if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          clearInterval(timerId);
        }
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [minutes, seconds]);

  return (
    <div className="p-4 text-2xl font-bold text-center">
      {`${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}
    </div>
  );
};

export default CountdownTimer;
