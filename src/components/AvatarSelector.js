import React from 'react';
import FrogAvatar from './FrogAvatar';

const AvatarSelector = ({ selectedColor, onSelectColor }) => {
  const colors = ['green', 'blue', 'purple', 'orange', 'pink'];

  return (
    <div className="avatar-selector">
  <h3>Choose your frog:</h3>
  <div className="avatar-container">
    <div className="avatar-options">
      {colors.map(color => (
        <button
          key={color}
          className={`avatar-option ${selectedColor === color ? 'selected' : ''}`}
          onClick={() => onSelectColor(color)}
        >
          <FrogAvatar color={color} size={60} />
        </button>
      ))}
    </div>
  </div>
</div>
  );
};

export default AvatarSelector;