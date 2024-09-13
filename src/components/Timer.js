import React, { useState, useEffect } from 'react';

const Timer = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      onComplete();
    }
  }, [timeLeft, onComplete]);

  return (
    <div className="timer">
      Time remaining: {timeLeft} seconds
    </div>
  );
};

export default Timer;