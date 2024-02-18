import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from '@tauri-apps/api/window'
import GoalList from "./components/Goals.tsx"
import Header from "./components/Header.tsx"
import "./App.css";



function App() {

  const [weekState, setWeekState] = useState({
    week_title: "",
    today_title: "",
    goals: [],
    });

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

    if (event.key === 'w') {
      event.preventDefault();
      invoke("get_next_week").then((result) => {
        setWeekState(result);
      });
    }

    if (event.key === 'W') {
      event.preventDefault();
      invoke("get_previous_week").then((result) => {
        setWeekState(result);
      });
    }

    if (event.key === 't') {
      event.preventDefault();
      invoke("get_current_week").then((result) => {
        setWeekState(result);
      });
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', keyDownHandler);
    invoke("get_week_state").then((result) => {
      // console.log(result);
      setWeekState(result);
    });
  }, []);

  const handleGoalSubmit = function () {
    console.log("todo: handle goal submit...");
  }

  return (
    <>
    <Header today={weekState.today_title} />
    <div className="container">
      <h2 dir="auto">{weekState.week_title}</h2>

      <GoalList goals={weekState.goals} onSubmit={handleGoalSubmit} />

    </div>
    </>
  );
}

export default App;
