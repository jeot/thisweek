import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from '@tauri-apps/api/window'
import GoalList from "./components/Goals.tsx"
import Header from "./components/Header.tsx"
import "./App.css";

function App() {

  const [editing, setEditing] = useState(false);

  const [weekState, setWeekState] = useState({
    week_title: "",
    today_title: "",
    goals: [],
    });

  const handleUserKeyPress = event => {
    if (event.key === 'Enter' && event.altKey) {
      event.preventDefault();
      appWindow.toggleMaximize();
    }

    if (event.key === 'q' && event.altKey) {
      event.preventDefault();
      appWindow.close();
    }

    if (!editing) {
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
    }
  };

  useEffect(() => {
    invoke("get_week_state").then((result) => {
      setWeekState(result);
    });
  }, []);

  useEffect(() => {
    console.log(`adding new keydown event listener with editing: ${editing}.`);
    window.addEventListener("keydown", handleUserKeyPress);
    return () => {
      console.log("removing keydown event listener.");
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [editing]);

  const handleOnEditing = function (isEditing) {
    setEditing(isEditing);
  }

  const handleGoalSubmit = function (value) {
    invoke("add_new_goal", { goalText: value.text }).then((result) => {
      // console.log(result);
      setWeekState(result);
    });
  }

  return (
    <>
    <Header today={weekState.today_title} />
    <div className="container">
      <h2 dir="auto">{weekState.week_title}</h2>

      <GoalList
        goals={weekState.goals}
        onSubmit={handleGoalSubmit}
        onEditing={handleOnEditing}
      />

    </div>
    </>
  );
}

export default App;
