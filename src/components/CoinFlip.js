import React, { useState, useEffect } from 'react';

const CoinFlip = ({ onComplete }) => {
  const [isFlipping, setIsFlipping] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const flipTimer = setTimeout(() => {
      const flipResult = Math.random() < 0.5;
      setResult(flipResult);
      setIsFlipping(false);
      onComplete(flipResult);
    }, 3000);

    return () => clearTimeout(flipTimer);
  }, [onComplete]);

  return (
    <div className="coin-flip">
      {isFlipping ? (
        <div className="coin spinning"></div>
      ) : (
        <p className="coin-result">
          {result ? 'Heads' : 'Tails'}
        </p>
      )}
    </div>
  );
};

export default CoinFlip;