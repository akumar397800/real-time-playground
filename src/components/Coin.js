import React from 'react';
import './Coin.css';

const Coin = ({ x, y, value, id, onCollect }) => {
  const handleClick = () => {
    onCollect(id);
  };

  return (
    <div 
      className={`coin value-${value}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
      onClick={handleClick}
    >
      {value}
    </div>
  );
};

export default Coin;