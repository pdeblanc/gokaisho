import React, { Component } from 'react';
import Preferences from "./activities/preferences";
import MiaiValueQuiz from "./activities/miai_value_quiz";
import { activity } from "./atoms";
import { RecoilRoot, useRecoilValue } from "recoil";
import { KataGo } from "./katago";
import { MiaiValueProblem } from "./library";


type RootProps = {
  problems: Array<MiaiValueProblem>;
  katago: KataGo;
};


/*
const activities = {
  "miai_value_quiz": MiaiValueQuiz,
  "preferences": Preferences,
}
*/


const Navigator = (props: RootProps) => {
  const currentActivity = useRecoilValue(activity);
  // const currentActivity = "miai_value_quiz";
  if (currentActivity === "miai_value_quiz") {
    return <MiaiValueQuiz {...props} />
  } else {
    return <Preferences />
  }
};


class Root extends React.Component<RootProps> {
  render() {
    return (
      <RecoilRoot>
	<Navigator {...this.props} />
      </RecoilRoot>
    );
  };
}

export default Root;
