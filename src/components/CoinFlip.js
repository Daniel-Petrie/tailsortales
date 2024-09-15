import React, { useState, useEffect } from 'react';

const CoinFlip = ({ onComplete }) => {
  const [isFlipping, setIsFlipping] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const flipDuration = 3000; // 3 seconds
    const flipTimer = setTimeout(() => {
      const flipResult = Math.random() < 0.5;
      setResult(flipResult);
      setIsFlipping(false);
      onComplete(flipResult);
    }, flipDuration);

    return () => clearTimeout(flipTimer);
  }, [onComplete]);

  return (
    <div className="coin-flip">
      <div className={`coin ${isFlipping ? 'flipping' : ''}`}>
        <div className="side heads"></div>
        <div className="side tails"></div>
      </div>
      {!isFlipping && (
        <p className="coin-result">
          {result ? 'Heads: The answer is revealed!' : 'Tails: The answer remains a mystery!'}
        </p>
      )}
    </div>
  );
};

export default CoinFlip;