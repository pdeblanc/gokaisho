import React, { Component } from 'react';
import { promptForKataGoExecutablePath } from "../paths";

type PreferencesState = {
  kataGoExecutablePath: string | null;
  kataGoModelPath: string | null;
};

class Preferences extends React.Component<{}, PreferencesState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      kataGoExecutablePath: "",
      kataGoModelPath: "",
    };
  }

  async getExecutablePath() {
    const selectedPath = await promptForKataGoExecutablePath(this.state.kataGoExecutablePath);
    if (selectedPath) {
      this.setState({kataGoExecutablePath: selectedPath});
    }
  }

  render() {
    const {kataGoExecutablePath} = this.state;
    return <div>
      <h1>Preferences</h1>
      <p>
	KataGo Executable:
      </p>
      <p>
	<input
	  size={50}
	  value={kataGoExecutablePath}
	  onChange={event => this.setState({kataGoExecutablePath: event.target.value})}
	/>
	<button onClick={() => this.getExecutablePath()}>Choose...</button>
      </p>
    </div>
  };
}

export default Preferences;
