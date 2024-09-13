import React from 'react';

const frogColors = {
  green: '#90EE90',
  blue: '#87CEFA',
  purple: '#DDA0DD',
  orange: '#FFA07A',
  pink: '#FFB6C1',
  yellow: '#FFFF99',
  red: '#FF6347',
  teal: '#20B2AA'
};

const accessories = [
  { type: 'none', chance: 0.5 },
  { type: 'sunglasses', chance: 0.2 },
  { type: 'partyHat', chance: 0.15 },
  { type: 'bowtie', chance: 0.15 }
];

const getRandomAccessory = () => {
  const rand = Math.random();
  let cumulativeChance = 0;
  for (const acc of accessories) {
    cumulativeChance += acc.chance;
    if (rand < cumulativeChance) {
      return acc.type;
    }
  }
  return 'none';
};

const FrogAvatar = ({ color = 'green', size = 10, seed }) => {
  const mainColor = frogColors[color] || frogColors.green;
  const bellyColor = '#FFFACD';
  const outlineColor = '#000000';
  const blushColor = '#FFB6C1';

  // Use seed to generate consistent random accessories for the same frog
  const accessory = React.useMemo(() => getRandomAccessory(), [seed]);

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <path
        d="M10,50 Q20,20 50,20 Q80,20 90,50 Q80,80 50,80 Q20,80 10,50 Z"
        fill={mainColor}
        stroke={outlineColor}
        strokeWidth="3"
      />
      
      {/* Belly */}
      <ellipse cx="50" cy="60" rx="30" ry="20" fill={bellyColor} />
      
      {/* Eyes */}
      <g transform="translate(0, -5)">
        <circle cx="35" cy="40" r="12" fill="white" stroke={outlineColor} strokeWidth="2" />
        <circle cx="65" cy="40" r="12" fill="white" stroke={outlineColor} strokeWidth="2" />
        <circle cx="35" cy="40" r="6" fill="black" />
        <circle cx="65" cy="40" r="6" fill="black" />
      </g>
      
      {/* Blush */}
      <circle cx="25" cy="50" r="5" fill={blushColor} opacity="0.6" />
      <circle cx="75" cy="50" r="5" fill={blushColor} opacity="0.6" />
      
      {/* Mouth */}
      <path
        d="M40,60 Q50,67 60,60"
        fill="none"
        stroke={outlineColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Legs */}
      <path
        d="M15,70 Q25,75 35,70"
        fill="none"
        stroke={outlineColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M85,70 Q75,75 65,70"
        fill="none"
        stroke={outlineColor}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Accessories */}
      {accessory === 'sunglasses' && (
        <g transform="translate(0, -5)">
          <path d="M25,40 H45 Q50,40 55,40 H75" fill="none" stroke="#333" strokeWidth="3" />
          <rect x="25" y="35" width="20" height="10" fill="#333" rx="2" />
          <rect x="55" y="35" width="20" height="10" fill="#333" rx="2" />
        </g>
      )}
      {accessory === 'partyHat' && (
        <path d="M50,5 L35,25 H65 Z" fill="#FF69B4" stroke={outlineColor} strokeWidth="2" />
      )}
      {accessory === 'bowtie' && (
        <path d="M40,75 L30,70 L40,65 M60,75 L70,70 L60,65" fill="none" stroke="#FF0000" strokeWidth="3" />
      )}
    </svg>
  );
};

export default FrogAvatar;