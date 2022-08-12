import React, { Component } from 'react';
import { range } from "../util";
import { ImmutableSituation, Move } from "../go";
import { jaCoordToXyCoord, JaCoord } from "../coord";
import GobanSvg from "./goban_svg";
import GobanSurface from "./goban_surface";

const BOARD_SIZE = 19;
const SQUARE_SIZE = 16;

type GobanProps = {
  board: ImmutableSituation;
  lastMove: Move | null;
  justCaptured: Array<JaCoord>;
};

const Goban: React.FC<GobanProps> = ({board, justCaptured, lastMove}) => {
  const koXy = board.ko && jaCoordToXyCoord(board.ko);
  return (
    <GobanSvg>
      <GobanSurface />
      <>
	{
	  board.blackStones().map((coord) => {
	    const {x, y} = jaCoordToXyCoord(coord);
	    return <circle
	      cx={x * SQUARE_SIZE}
	      cy={y * SQUARE_SIZE}
	      r={SQUARE_SIZE / 2 - 0.25}
	      fill="black"
	      key={`${x}_${y}`}
	    />
	  })
	}
      </>
      <>
	{
	  justCaptured && justCaptured.map((coord) => {
	    const {x, y} = jaCoordToXyCoord(coord);
	    return (
	      <React.Fragment key={coord}>
		<circle
		  cx={x * SQUARE_SIZE}
		  cy={y * SQUARE_SIZE}
		  r={SQUARE_SIZE / 2 - 0.25}
		  fill={board.turn}
		  stroke={board.turn === "white" ? "black" : "none"}
		  opacity="0.5"
		/>
		<circle
		  cx={x * SQUARE_SIZE}
		  cy={y * SQUARE_SIZE}
		  r={SQUARE_SIZE / 4}
		  fill="none"
		  stroke="red"
		  opacity="0.5"
		/>
	      </React.Fragment>
	    )
	  })
	}
      </>
      <>
	{
	  board.whiteStones().map((coord) => {
	    const {x, y} = jaCoordToXyCoord(coord);
	    return <circle
	      cx={x * SQUARE_SIZE}
	      cy={y * SQUARE_SIZE}
	      r={SQUARE_SIZE / 2 - 0.25}
	      fill="white"
	      stroke="black"
	      key={`${x}_${y}`}
	    />
	  })
	}
      </>
      {
	koXy && <rect
	  x={(koXy.x - 1/4) * SQUARE_SIZE}
	  y={(koXy.y - 1/4) * SQUARE_SIZE}
	  width={1/2 * SQUARE_SIZE}
	  height={1/2 * SQUARE_SIZE}
	  stroke="black"
	  fill="none"
	/>
      }
      {
	lastMove && lastMove.value !== "pass" &&
	<text
	  x={jaCoordToXyCoord(lastMove.value).x * SQUARE_SIZE}
	  y={jaCoordToXyCoord(lastMove.value).y * SQUARE_SIZE + 3}
	  fontSize={8}
	  textAnchor="middle"
	  stroke={lastMove.player === "white" ? "black" : "white"}
	>1</text>
      }
    </GobanSvg>
  );
};

export default Goban;
