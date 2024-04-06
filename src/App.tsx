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

  const [disableKeyboardNavigation, setDisableKeyboardNavigation] = useState(false);
  const [newKeyFlag, setNewKeyFlag] = useState(false);
  const [editingId, setEditingId] = useState("");

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

    if (event.key === 'Escape' && editingId != "") {
      event.preventDefault();
      handleOnCancel(0);
    }

    if (!disableKeyboardNavigation) {
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
        setEditingId('new_goal_id');
        setDisableKeyboardNavigation(true);
      } else if (newKeyFlag && event.code === 'KeyN') {
        event.preventDefault();
        // new note
        // console.log("start new note editing...");
        setNewKeyFlag(false);
        setEditingId('new_note_id');
        setDisableKeyboardNavigation(true);
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
    }, []
  );

  useEffect(() => {
    // console.log(`adding new keydown event listener with disableKeyboardNavigation: ${disableKeyboardNavigation}.`);
    window.addEventListener("keydown", handleUserKeyPress);
    return () => {
      // console.log("removing keydown event listener.");
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [disableKeyboardNavigation, newKeyFlag, editingId]);

  const handleOnCancel = function (id) {
    console.log("handleOnCancel id:", id);
    setEditingId("");
    setDisableKeyboardNavigation(false);
    invoke("get_week_state").then((result) => {
      console.log("result:", result);
      setWeekState(result);
    });
  }

  const handleOnEdit = function (id) {
    console.log(`new onEdit(${id})`);
    if (editingId != "") {
      console.log("error: editingId is already set.");
    }
    setEditingId(id);
    setDisableKeyboardNavigation(true);
  }

  const handleOnToggle = function (id) {
    invoke("goal_checkbox_changed", { id: id }).then((result) => {
        setWeekState(result);
    });
  }

  const handleOnSubmit = function ({id, text}) {
    if (id === undefined || text === undefined) return;
    if (id == "new_goal_id") {
      setEditingId("");
      setDisableKeyboardNavigation(false);
      invoke("add_new_goal", { text: text }).then((result) => {
        setWeekState(result);
      });
    } else if (id == "new_note_id") {
      setEditingId("");
      setDisableKeyboardNavigation(false);
      invoke("add_new_note", { text: text }).then((result) => {
        setWeekState(result);
      });
    } else if (editingId == id) {
      setEditingId("");
      setDisableKeyboardNavigation(false);
      invoke("edit_item", { id: id, text: text }).then((result) => {
        setWeekState(result);
      });
    } else {}
  }

  const handleOnDelete = function (id) {
    invoke("delete_item", { id: id }).then((result) => {
      setWeekState(result);
    });
  }

  const onSpeedDialClick = function (action_name) {
    if (editingId != "") return;
    console.log(action_name);
    if (action_name == 'Goal' && editingId == "") {
      setEditingId('new_goal_id');
      setDisableKeyboardNavigation(true);
    }
    if (action_name == 'Note') {
      setEditingId('new_note_id');
      setDisableKeyboardNavigation(true);
    }
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
        editingId={editingId}
        onSubmit={handleOnSubmit}
        onEdit={handleOnEdit}
        onDelete={handleOnDelete}
        onCancel={handleOnCancel}
        onToggle={handleOnToggle}
      />
      {editingId == "" && <BasicSpeedDial onClick={onSpeedDialClick} />}
      </CssBaseline>
    </ThemeProvider>
    </React.Fragment>

  );
}

export default App;
