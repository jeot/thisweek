import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from '@tauri-apps/api/window'
import GoalList from "./components/Goals.tsx"
// import "./App.css";

const keyDownHandler = event => {
  // console.log('User pressed: ', event.key);

  if (event.key === 'Enter') {
    event.preventDefault();
    appWindow.toggleMaximize();
  }

  if (event.key === 'q') {
    event.preventDefault();
    appWindow.close();
  }
};

document.addEventListener('keydown', keyDownHandler);

function App() {

  const [weekState, setWeekState] = useState({
    week_title: "",
    today_title: "",
    goals: [],
    });

  useEffect(() => {
    invoke("get_week_state").then((result) => {
      console.log(result);
      setWeekState(result);
    });
  }, []);

  const handleGoalSubmit = function () {
    console.log("todo: handle goal submit...");
  }

  return (
    <div className="container">
      <h1 dir="auto">{weekState.week_title}</h1>
      <h2 dir="auto">{weekState.today_title}</h2>

      <GoalList goals={weekState.goals} onSubmit={handleGoalSubmit} />

    </div>
  );
}

export default App;
