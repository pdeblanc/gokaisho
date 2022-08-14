import React, { Component } from 'react';
import Goban from "./goban/goban";
import { randomSymmetry, transformJaCoord } from "./rotate";
import { Symmetry } from "./types";
import { transformMove } from "./go";
import { MiaiValueProblem, saveAttempt } from "./library";

type MiaiQuizProps = {
  problems: Array<MiaiValueProblem>;
};

type MiaiQuizState = {
  problemIndex: number;
  symmetry: Symmetry;
  userGuess: number | null;
};

class MiaiValueQuiz extends React.Component<MiaiQuizProps, MiaiQuizState> {
  inputElement: HTMLInputElement | null;

  constructor(props: MiaiQuizProps) {
    super(props);
    this.inputElement = null;
    this.state = this.randomState();
  }

  randomState(): MiaiQuizState {
    const {problems} = this.props;
    console.log(`Choosing from ${problems.length} problems...`);
    const problemIndex = Math.floor(Math.random() * problems.length)
    return {
      problemIndex,
      symmetry: randomSymmetry(),
      userGuess: null
    };
  }

  submitGuess() {
    // retrieve values
    const {problems} = this.props;
    const {problemIndex, symmetry} = this.state;
    const problem = problems[problemIndex];
    const guess = this.inputElement.value;
    const parsedGuess = parseFloat(guess);
    if (!(parsedGuess >= 0 && parsedGuess <= 14)) {
      return;
    }
    const timeStampMs = Date.now();
    // save result
    saveAttempt({
      path: problem.path,
      moveNo: problem.moveNo,
      symmetry,
      miaiValue: problem.miaiValue,
      parsedGuess,
      timeStampMs,
      localDate: new Date().toLocaleString()
    });
    // select new problem
    this.setState({userGuess: parsedGuess});
  }

  nextProblem() {
    // select new problem
    this.setState(this.randomState());
  }

  render() {
    const {problems} = this.props;
    const {symmetry, problemIndex, userGuess} = this.state;

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
      {
	userGuess === null ?
	<div>
	  Value:
	  <input
	    type="number"
	    min="0"
	    max="14"
	    step="0.01"
	    id="number-input"
	    ref={element => this.inputElement = element}
	    autoFocus
	    onKeyPress={
	      event => {
		if (event.type === "keypress" && event.key === "Enter") {
		  this.submitGuess();
		}
	      }
	    }
	  />
	  <button onClick={() => this.submitGuess()}>This is my best guess</button>
	</div>
	:
	<div>
	  Your guess: {userGuess}; correct answer: {example.miaiValue}
	  <button autoFocus onClick={() => this.nextProblem()}>Next Problem</button>
	</div>
      }
    </div>
  }
}

export default MiaiValueQuiz;
