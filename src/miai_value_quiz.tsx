import React, { Component } from 'react';
import Goban from "./goban/goban";
import { randomSymmetry, transformJaCoord, Symmetry } from "./coord";
import { transformMove } from "./go";

type MiaiQuizProps = {
  problems: any;
};

type MiaiQuizState = {
  problemIndex: number;
  symmetry: Symmetry;
};

class MiaiValueQuiz extends React.Component<MiaiQuizProps, MiaiQuizState> {
  constructor(props: MiaiQuizProps) {
    super(props);
    this.state = this.randomState();
  }

  randomState(): MiaiQuizState {
    const {problems} = this.props;
    return {
      problemIndex: Math.floor(Math.random() * problems.length),
      symmetry: randomSymmetry()
    };
  }

  render() {
    const {problems} = this.props;
    const {symmetry, problemIndex} = this.state;
    const example = problems[problemIndex];
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
    return <div>
      <Goban
	board={rotatedExample.board}
	lastMove={rotatedExample.move}
	justCaptured={rotatedExample.captures}
      />
      <button onClick={() => this.setState(this.randomState())}>Next Problem</button>
    </div>
  }
}

export default MiaiValueQuiz;
