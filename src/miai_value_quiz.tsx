import React, { Component } from 'react';
import Goban from "./goban/goban";
import { randomSymmetry, transformJaCoord, Symmetry } from "./coord";
import { transformMove } from "./go";
import { saveAttempt } from "./library";

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
    console.log(`Choosing from ${problems.length} problems...`);
    return {
      problemIndex: Math.floor(Math.random() * problems.length),
      symmetry: randomSymmetry()
    };
  }

  submitGuess() {
    // retrieve values
    const {problems} = this.props;
    const {problemIndex, symmetry} = this.state;
    const problem = problems[problemIndex];
    const inputElt = document.getElementById("number-input") as HTMLInputElement;
    const guess = inputElt.value;
    const timeStampMs = Date.now();
    // save result
    saveAttempt({
      path: problem.path,
      moveNo: problem.moveNo,
      symmetry,
      miaiValue: 13.37,
      guess,
      timeStampMs,
      localDate: new Date().toLocaleString()
    });
    // update UI
    inputElt.value = "";
    // select new problem
    this.setState(this.randomState());
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
      Value:
      <input
	type="number"
	min="0"
	max="14"
	step="0.01"
	id="number-input"
	autoFocus
	onKeyPress={
	  event => {
	    if (event.type === "keypress" && event.key === "Enter") {
	      this.submitGuess();
	    }
	  }
	}
      />
      <button onClick={() => this.submitGuess()}>Next Problem</button>
    </div>
  }
}

export default MiaiValueQuiz;
