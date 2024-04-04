import * as React from 'react';
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from '@tauri-apps/api/window'
import Header from "./components/Header.tsx"
import Week from "./components/Week.tsx"
import BasicSpeedDial from "./components/BasicSpeedDial.tsx"

import CssBaseline from '@mui/material/CssBaseline';
// import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';

import Koodak from './assets/fonts/BKoodkBd.ttf';
// import Nazanin from './assets/fonts/B-NAZANIN.ttf';
// import Rubik from './assets/fonts/Rubik-Regular.ttf';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { createTheme, ThemeProvider } from '@mui/material';

function App() {

  const [editing, setEditing] = useState(false);
  const [newKeyFlag, setNewKeyFlag] = useState(false);
  const [startNewGoalEditing, setStartNewGoalEditing] = useState(false);
  const [startNewNoteEditing, setStartNewNoteEditing] = useState(false);

  const [weekState, setWeekState] = useState({
    week_title: "",
    today_title: "",
    items: [],
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

      if (!newKeyFlag && event.code === 'KeyN') {
        event.preventDefault();
        setNewKeyFlag(true);
      } else if (newKeyFlag && event.code === 'KeyG') {
        event.preventDefault();
        // new goal
        // console.log("start new goal editing...");
        setNewKeyFlag(false);
        setStartNewGoalEditing(true);
      } else if (newKeyFlag && event.code === 'KeyN') {
        event.preventDefault();
        // new note
        // console.log("start new note editing...");
        setNewKeyFlag(false);
        setStartNewNoteEditing(true);
      } else if (newKeyFlag) {
        event.preventDefault();
        setNewKeyFlag(false);
      } else {}

    }
  };

  useEffect(() => {
    invoke("get_week_state").then((result) => {
      // console.log("get_week_state result: ", result);
      setWeekState(result);
      });
    }, []);

  useEffect(() => {
    // console.log(`adding new keydown event listener with editing: ${editing}.`);
    window.addEventListener("keydown", handleUserKeyPress);
    return () => {
      // console.log("removing keydown event listener.");
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [editing, newKeyFlag, startNewGoalEditing, startNewNoteEditing]);

  const handleOnEditing = function (isEditing) {
    console.log(`setting the editing: ${isEditing}`);
    setEditing(isEditing);
    if (!isEditing) setStartNewGoalEditing(false);
    if (!isEditing) setStartNewNoteEditing(false);
  }

  const handleGoalSubmit = function (goal) {
    if (goal.id == 0) { // it's a new goal
      invoke("add_new_goal", { goalText: goal.text }).then((result) => {
        // console.log(result);
        setWeekState(result);
      });
    }
    if (goal.id != 0) { // it's previous goal edit
      invoke("edit_goal", { id: goal.id, text: goal.text }).then((result) => {
        // console.log(result);
        setWeekState(result);
      });
    }
  }

  const handleOnGoalDelete = function (id) {
    invoke("delete_goal", { id: id }).then((result) => {
        // console.log(result);
        setWeekState(result);
        });
  }

  const onSpeedDialClick = function (action_name) {
    console.log(action_name);
    setStartNewGoalEditing(true);
  }

  const theme = createTheme({
    typography: {
      fontSize: 14,
      fontFamily: [
        'Koodak',
        'B Nazanin',
        // 'Rubik',
        // 'B Koodak',
        'Roboto',
        'Times',
      ].join(','),
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @font-face {
            font-family: 'Koodak';
            font-style: normal;
            font-display: swap;
            font-weight: 400;
            src: local('B Koodak Bold'),
                 url(${Koodak}) format('ttf');
          }
        `,
      },
    },
  });

  return (
    <React.Fragment>
    <ThemeProvider theme={theme}>
      <CssBaseline>
      <Header today={weekState.today_title} />
      <Week
        weekState={weekState}
        onSubmit={handleGoalSubmit}
        onEdit={handleOnEditing}
        onDelete={handleOnGoalDelete}
        startNewGoalEditing={startNewGoalEditing}
        startNewNoteEditing={startNewNoteEditing}
      />
      <BasicSpeedDial onClick={onSpeedDialClick} />
      </CssBaseline>
    </ThemeProvider>
    </React.Fragment>

  );
}

export default App;
