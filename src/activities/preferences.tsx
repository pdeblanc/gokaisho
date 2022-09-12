import React, { Component } from 'react';
import FileSelector from "../components/file_selector";

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

  render() {
    const {kataGoExecutablePath, kataGoModelPath} = this.state;
    return <div>
      <h1>Preferences</h1>
      <p>KataGo Executable:</p>
      <FileSelector
	prompt="Select the KataGo Executable"
	value={kataGoExecutablePath}
	onUpdate={value => this.setState({kataGoExecutablePath: value})}
      />
      <p>KataGo Model:</p>
      <FileSelector
	prompt="Select the KataGo Model File"
	value={kataGoModelPath}
	onUpdate={value => this.setState({kataGoModelPath: value})}
      />
    </div>
  };
}

export default Preferences;
