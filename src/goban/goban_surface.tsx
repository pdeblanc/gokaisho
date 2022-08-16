import React, { Component } from 'react';
import { range } from "../util";
import { SQUARE_SIZE } from "./constants";


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
  w: number,
  h: number,
};

const GobanSurface: React.FC<GobanSurfaceProps> = ({w, h}) => {
  return (
    <>
      <rect
	x={-SQUARE_SIZE / 2}
	y={-SQUARE_SIZE / 2}
	width={w * SQUARE_SIZE+ 4}
	height={h * SQUARE_SIZE + 4}
	stroke="none"
	fill="#ea1"
      />
      <>
	{
	  range(0, w).map(u => (
	    <line
	      x1={u * SQUARE_SIZE}
	      x2={u * SQUARE_SIZE}
	      y1={0}
	      y2={(h - 1) * SQUARE_SIZE}
	      stroke="black"
	      strokeWidth="0.5"
	      key={u}
	    />
	  ))
	}
      </>
      <>
	{
	  range(0, h).map(v => (
	    <line
	      x1={0}
	      x2={(w - 1) * SQUARE_SIZE}
	      y1={v * SQUARE_SIZE}
	      y2={v * SQUARE_SIZE}
	      stroke="black"
	      strokeWidth="0.5"
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
