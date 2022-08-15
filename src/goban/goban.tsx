import React, { Component } from 'react';
import { range } from "../util";
import { ImmutableSituation } from "../go";
import { jaCoordToXyCoord } from "../conversion";
import { JaCoord, Move } from "../types";
import GobanSvg from "./goban_svg";
import GobanSurface from "./goban_surface";
import { SQUARE_SIZE } from "./constants";

type GobanProps = {
  board: ImmutableSituation;
  lastMove: Move | null;
  justCaptured: Array<JaCoord>;
  ownership: Array<number> | null;
};

const Goban: React.FC<GobanProps> = ({board, justCaptured, lastMove, ownership}) => {
  const {w, h} = board.size;
  const koXy = board.ko && jaCoordToXyCoord(board.ko);
  return (
    <GobanSvg w={w} h={h}>
      <GobanSurface w={w} h={h} />
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
	ownership && <>
	  {
	    ownership.map((value, _) => {
	      const i = 360 - _;
	      const color = value >= 0 ? "black" : "white";
	      const certainty = Math.abs(value);
	      const radius = Math.sqrt(certainty);
	      const x = i % w;
	      const y = Math.floor(i / w);
	      return <circle
		cx={x * SQUARE_SIZE}
		cy={y * SQUARE_SIZE}
		r={radius * (SQUARE_SIZE / 4 - 0.125)}
		fill={color}
		key={`${x}_${y}`}
	      />
	    })
	  }
	</>
      }
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
