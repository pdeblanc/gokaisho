import React, { Component } from 'react';
import { promptToSelectFile } from "../paths";


type FileSelectorProps = {
  prompt: string;
  value: string | null;
  onUpdate: (value: string) => void;
};


class FileSelector extends React.Component<FileSelectorProps> {
  async openFilePicker() {
    const {onUpdate, value, prompt} = this.props;
    const newValue = await promptToSelectFile(value, prompt);
    if (newValue) {
      onUpdate(newValue);
    }
  }

  render() {
    const {onUpdate, value} = this.props;
    return <div>
      <p>
	<input
	  size={50}
	  value={value}
	  onChange={event => onUpdate(event.target.value)}
	/>
	<button onClick={() => this.openFilePicker()}>Choose...</button>
      </p>
    </div>
  };
}

export default FileSelector;
