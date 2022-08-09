import React, { Component } from 'react';
import { range } from "./util";
import { MutableSituation } from "./go";

const BOARD_SIZE = 19;
const SQUARE_SIZE = 16;

type GobanProps = {
  board: MutableSituation;
};

const Goban: React.FC<GobanProps> = ({board}) => {
  const boxMin = -SQUARE_SIZE / 2;
  const boxSize = BOARD_SIZE * SQUARE_SIZE;
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
	  board.blackStones().map((coord) => (
	    <circle
	      cx={coord.x * SQUARE_SIZE}
	      cy={coord.y * SQUARE_SIZE}
	      r={SQUARE_SIZE / 2}
	      fill="black"
	    />
	  ))
	}
      </>
    </svg>
  );
};

export default Goban;
