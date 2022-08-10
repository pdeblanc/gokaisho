import React, { Component } from 'react';
import { range } from "./util";
import { MutableSituation } from "./go";

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

type GobanProps = {
  board: MutableSituation;
};

const Goban: React.FC<GobanProps> = ({board}) => {
  const boxMin = -SQUARE_SIZE / 2 - 2;
  const boxSize = BOARD_SIZE * SQUARE_SIZE + 4;
  return (
    <svg
      width="500"
      height="500"
      viewBox={`${boxMin}, ${boxMin}, ${boxSize}, ${boxSize}`}
    >
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
	    />
	  ))
	}
      </>
      <>
	{
	  board.blackStones().map((coord) => (
	    <circle
	      cx={coord.x * SQUARE_SIZE}
	      cy={coord.y * SQUARE_SIZE}
	      r={SQUARE_SIZE / 2 - 0.25}
	      fill="black"
	    />
	  ))
	}
      </>
      <>
	{
	  board.whiteStones().map((coord) => (
	    <circle
	      cx={coord.x * SQUARE_SIZE}
	      cy={coord.y * SQUARE_SIZE}
	      r={SQUARE_SIZE / 2 - 0.25}
	      fill="white"
	      stroke="black"
	    />
	  ))
	}
      </>
      <>
	{
	  board.ko && <rect
	    x={(board.ko.x - 1/4) * SQUARE_SIZE}
	    y={(board.ko.y - 1/4) * SQUARE_SIZE}
	    width={1/2 * SQUARE_SIZE}
	    height={1/2 * SQUARE_SIZE}
	    stroke="black"
	    fill="none"
	  />
	}
      </>
    </svg>
  );
};

export default Goban;
