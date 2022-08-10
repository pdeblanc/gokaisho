import React, { Component } from 'react';
import { range } from "../util";

const BOARD_SIZE = 19;
const SQUARE_SIZE = 16;

const HOSHI = [
  {x: 3, y: 3},
  {x: 9, y: 3},
  {x: 15, y: 3},
  {x: 3, y: 9},
  {x: 9, y: 9},
  {x: 15, y: 9},
  {x: 3, y: 15},
  {x: 9, y: 15},
  {x: 15, y: 15},
];

type GobanSurfaceProps = {
};

const GobanSurface: React.FC<GobanSurfaceProps> = () => {
  return (
    <>
      <>
	{
	  range(0, BOARD_SIZE).map(u => (
	    <line
	      x1={u * SQUARE_SIZE}
	      x2={u * SQUARE_SIZE}
	      y1={0}
	      y2={(BOARD_SIZE - 1) * SQUARE_SIZE}
	      stroke="black"
	      key={u}
	    />
	  ))
	}
      </>
      <>
	{
	  range(0, BOARD_SIZE).map(v => (
	    <line
	      x1={0}
	      x2={(BOARD_SIZE - 1) * SQUARE_SIZE}
	      y1={v * SQUARE_SIZE}
	      y2={v * SQUARE_SIZE}
	      stroke="black"
	      key={v}
	    />
	  ))
	}
      </>
      <>
	{
	  HOSHI.map((coord) => (
	    <circle
	      cx={coord.x * SQUARE_SIZE}
	      cy={coord.y * SQUARE_SIZE}
	      r={SQUARE_SIZE / 8}
	      fill="black"
	      key={`hoshi_${coord.x}_${coord.y}`}
	    />
	  ))
	}
      </>
    </>
  );
};

export default GobanSurface;
