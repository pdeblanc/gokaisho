import React, { Component } from 'react';
import Goban from "./goban/goban";
import { randomSymmetry, transformJaCoord } from "./coord";
import { transformMove } from "./go";

type MiaiQuizProps = {
  problems: any;
};

type MiaiQuizState = {
  currentProblemIndex: number;
};

class MiaiValueQuiz extends React.Component<MiaiQuizProps, MiaiQuizState> {
  render() {
    const {problems} = this.props;
    const example = problems[Math.floor(Math.random() * problems.length)];
    // choose rotation
    const symmetry = randomSymmetry();
    // rotate example
    const rotatedExample = {
      board: example.board.transform(symmetry),
      captures: example.captures.map(
	(stone: any) => transformJaCoord(example.board.size, symmetry, stone)
      ),
      miaiValue: example.miaiValue,
      move: transformMove(example.board.size, symmetry, example.move),
      moveNo: example.moveNo,
      path: example.path,
      symmetry,
    }
    console.log(rotatedExample);
    return <Goban
      board={rotatedExample.board}
      lastMove={rotatedExample.move}
      justCaptured={rotatedExample.captures}
    />;
  }
}

export default MiaiValueQuiz;
