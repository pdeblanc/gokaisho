import React, { Component } from 'react';
import { range } from "./util";

const BOARD_SIZE = 19;
const SQUARE_SIZE = 16;

const Goban = () => {
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
    </svg>
  );
};

export default Goban;
