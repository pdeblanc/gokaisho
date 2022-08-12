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
  attempted: Set<Number>;

  constructor(props: MiaiQuizProps) {
    super(props);
    this.attempted = new Set();
    this.state = this.randomState();
  }

  randomState(): MiaiQuizState {
    const {problems} = this.props;
    console.log(`Choosing from ${problems.length} problems...`);
    let problemIndex = Math.floor(Math.random() * problems.length)
    console.log(problemIndex, this.attempted);
    while (this.attempted.has(problemIndex)) {
      if (problems.length <= this.attempted.size) {
	problemIndex = -1;
      } else {
	problemIndex = Math.floor(Math.random() * problems.length)
      }
    }
    if (problems.length === 0) {
      problemIndex = -1;
    }
    return {
      problemIndex,
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
    const parsedGuess = parseFloat(guess);
    if (!(parsedGuess >= 0 && parsedGuess <= 14)) {
      return;
    }
    const timeStampMs = Date.now();
    // save result
    this.attempted.add(problemIndex);
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

    if (problemIndex === -1) {
      return <div>No problems left. Have a nice day!</div>;
    }

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
