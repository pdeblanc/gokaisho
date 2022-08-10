import React, { Component } from 'react';

const BOARD_SIZE = 19;
const SQUARE_SIZE = 16;

type GobanSvgProps = {
  children: React.ReactNode;
};

const GobanSvg: React.FC<GobanSvgProps> = ({children}) => {
  const boxMin = -SQUARE_SIZE / 2 - 2;
  const boxSize = BOARD_SIZE * SQUARE_SIZE + 4;
  return (
    <svg
      width="500"
      height="500"
      viewBox={`${boxMin}, ${boxMin}, ${boxSize}, ${boxSize}`}
    >
      {children}
    </svg>
  );
};

export default GobanSvg;
