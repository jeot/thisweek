import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from '@tauri-apps/api/window'
import Header from "./components/Header.tsx"
import Week from "./components/Week.tsx"

function App() {

  const [editing, setEditing] = useState(false);

  const [weekState, setWeekState] = useState({
    week_title: "",
    today_title: "",
    goals: [],
    notes: [],
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
      console.log("get_week_state result: ", result);
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

  const handleGoalSubmit = function (goal) {
    if (goal.id == 0) {
      invoke("add_new_goal", { goalText: goal.text }).then((result) => {
        // console.log(result);
        setWeekState(result);
      });
    }
    // if (goal.id != 0) {
    //   invoke("edit_goal", { goalId: goal.id, goalText: goal.text }).then((result) => {
    //     // console.log(result);
    //     setWeekState(result);
    //   });
    // }
  }

  const handleOnGoalDelete = function (id) {
    invoke("delete_goal", { id: id }).then((result) => {
      // console.log(result);
      setWeekState(result);
    });
  }

  const goals = weekState.goals.map((x) => x.Goal);
  const notes = weekState.notes.map((x) => x.Note);

  return (
    <>
    <Header today={weekState.today_title} />
    <Week
      title={weekState.week_title}
      goals={goals}
      onSubmit={handleGoalSubmit}
      onEditing={handleOnEditing}
      onGoalDelete={handleOnGoalDelete}
    />
    </>
  );
}

export default App;
