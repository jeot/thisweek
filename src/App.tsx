import * as React from 'react';
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from '@tauri-apps/api/window'
import Header from "./components/Header.tsx"
import Week from "./components/Week.tsx"
import BasicSpeedDial from "./components/BasicSpeedDial.tsx"

import CssBaseline from '@mui/material/CssBaseline';
// import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';

import ShabnamThin from './assets/fonts/Shabnam-Thin.woff';
import ShabnamLight from './assets/fonts/Shabnam-Light.woff';
import ShabnamNormal from './assets/fonts/Shabnam.woff';
import ShabnamMedium from './assets/fonts/Shabnam-Medium.woff';
import ShabnamBold from './assets/fonts/Shabnam-Bold.woff';

// import ShabnamFD from './assets/fonts/Shabnam-FD.woff'
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
  const [selectedId, setSelectedId] = useState("");

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
      // console.log('event', event);
      if (event.code === 'KeyW' && !event.shiftKey) {
        event.preventDefault();
        invoke("get_next_week").then((result) => {
          setWeekState(result);
        });
      }

      if (event.code === 'KeyW' && event.shiftKey) {
        event.preventDefault();
        invoke("get_previous_week").then((result) => {
          setWeekState(result);
        });
      }

      if (event.code === 'KeyT' && !event.shiftKey) {
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
    // console.log(`new onEdit(${id})`);
    if (editingId != "") {
      console.log("error: editingId is already set.");
    }
    setEditingId(id);
    setDisableKeyboardNavigation(true);
  }

  const handleOnSelect = function (id) {
    console.log(`new onSelect(${id})`);
    setSelectedId(id);
  }

  const handleOnToggle = function (id) {
    invoke("goal_checkbox_changed", { id: id }).then((result) => {
        setWeekState(result);
    });
  }

  const handleOnSubmit = function ({id, text}) {
    if (id === undefined || text === undefined) return;
    if (id == "new_goal_id") {
      // uncomment if you want to clear the new goal section
      // setEditingId("");
      // setDisableKeyboardNavigation(false);
      invoke("add_new_goal", { text: text }).then((result) => {
        setWeekState(result);
      });
    } else if (id == "new_note_id") {
      // uncomment if you want to clear the new note section
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
        'Shabnam',
        // 'B Nazanin',
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
            font-family: 'Shabnam';
            src: url(${ShabnamThin}) format('woff');
            font-display: swap;
            font-weight: 100; /*thin;*/
            font-style: normal;
          }

          @font-face {
            font-family: 'Shabnam';
            src: url(${ShabnamLight}) format('woff');
            font-display: swap;
            font-weight: 300; /*light;*/
            font-style: normal;
          }

          @font-face {
            font-family: 'Shabnam';
            src: url(${ShabnamNormal}) format('woff');
            font-display: swap;
            font-weight: 400; /*normal;*/
            font-style: normal;
          }

          @font-face {
            font-family: 'Shabnam';
            src: url(${ShabnamMedium}) format('woff');
            font-display: swap;
            font-weight: 500; /*medium;*/
            font-style: normal;
          }

          @font-face {
            font-family: 'Shabnam';
            src: url(${ShabnamBold}) format('woff');
            font-display: swap;
            font-weight: 700; /*bold;*/
            font-style: normal;
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
        selectedId={selectedId}
        onSubmit={handleOnSubmit}
        onEdit={handleOnEdit}
        onSelect={handleOnSelect}
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
