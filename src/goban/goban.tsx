import React, { Component } from 'react';
import { range } from "../util";
import { ImmutableSituation } from "../go";
import GobanSvg from "./goban_svg";
import GobanSurface from "./goban_surface";

const BOARD_SIZE = 19;
const SQUARE_SIZE = 16;

type GobanProps = {
  board: ImmutableSituation;
};

const Goban: React.FC<GobanProps> = ({board}) => {
  return (
    <GobanSvg>
      <GobanSurface />
      <>
	{
	  board.blackStones().map((coord) => (
	    <circle
	      cx={coord.x * SQUARE_SIZE}
	      cy={coord.y * SQUARE_SIZE}
	      r={SQUARE_SIZE / 2 - 0.25}
	      fill="black"
	      key={`${coord.x}_${coord.y}`}
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
	      key={`${coord.x}_${coord.y}`}
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
    </GobanSvg>
  );
};

export default Goban;
