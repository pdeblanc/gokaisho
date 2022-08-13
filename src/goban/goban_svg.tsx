import React, { Component } from 'react';
import { SQUARE_SIZE } from "./constants";

type GobanSvgProps = {
  w: number,
  h: number,
  children: React.ReactNode;
};

const GobanSvg: React.FC<GobanSvgProps> = ({children, w, h}) => {
  const boxMin = -SQUARE_SIZE / 2 - 2;
  const boxWidth = w * SQUARE_SIZE + 4;
  const boxHeight = h * SQUARE_SIZE + 4;
  return (
    <svg
      width="500"
      height="500"
      viewBox={`${boxMin}, ${boxMin}, ${boxWidth}, ${boxHeight}`}
    >
      {children}
    </svg>
  );
};

export default GobanSvg;
