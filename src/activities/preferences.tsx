import React, { useState } from 'react';
import FileSelector from "../components/file_selector";

type PreferencesState = {
  kataGoExecutablePath: string | null;
  kataGoModelPath: string | null;
};


export default function Preferences() {
  const [kataGoExecutablePath, setKataGoExecutablePath] = useState("");
  const [kataGoModelPath, setKataGoModelPath] = useState("");
  return <div>
    <h1>Preferences</h1>
    <p>KataGo Executable:</p>
    <FileSelector
      prompt="Select the KataGo Executable"
      value={kataGoExecutablePath}
      onUpdate={value => setKataGoExecutablePath(value)}
    />
    <p>KataGo Model:</p>
    <FileSelector
      prompt="Select the KataGo Model File"
      value={kataGoModelPath}
      onUpdate={value => setKataGoModelPath(value)}
    />
  </div>
};
