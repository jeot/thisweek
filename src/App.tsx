import * as React from 'react';
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from '@tauri-apps/api/window'
import Week from "./components/Week.tsx"
import BasicSpeedDial from "./components/BasicSpeedDial.tsx"
import Header from "./components/Header.tsx"

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
import { ids, itemKind, itemStatus } from './constants.ts';

function App() {

  const [disableKeyboardNavigation, setDisableKeyboardNavigation] = useState(false);
  const [newKeyFlag, setNewKeyFlag] = useState(false);
  const [copyKeyFlag, setCopyKeyFlag] = useState(false);
  const [editingId, setEditingId] = useState(ids.none)
  const [selectedId, setSelectedId] = useState(ids.none)

  const [weekState, setWeekState] = useState({
    week_title: "",
    today_persian_date: "",
    today_english_date: "",
    items: [],
  });

  const handleUserKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && event.altKey) {
      event.preventDefault();
      appWindow.toggleMaximize();
    }

    if (event.key === 'q' && event.altKey) {
      event.preventDefault();
      appWindow.close();
    }

    if (event.key === 'Escape' && editingId != ids.none) {
      event.preventDefault();
      handleOnCancel(editingId);
    }

    if (!disableKeyboardNavigation) {
      // console.log('event', event);
      if (event.code === 'KeyW' && !event.shiftKey) {
        event.preventDefault();
        showNextWeek();
      }

      if (event.code === 'KeyW' && event.shiftKey) {
        event.preventDefault();
        showPreviousWeek();
      }

      if (event.code === 'KeyT' && !event.shiftKey) {
        event.preventDefault();
        showCurrentWeek();
      }

      // new key with N
      if (!newKeyFlag && event.code === 'KeyN') {
        event.preventDefault();
        setNewKeyFlag(true);
      } else if (newKeyFlag && event.code === 'KeyG') {
        event.preventDefault();
        // new goal
        // console.log("start new goal editing...");
        setNewKeyFlag(false);
        setEditingId(ids.new_goal);
        setDisableKeyboardNavigation(true);
      } else if (newKeyFlag && event.code === 'KeyN') {
        event.preventDefault();
        // new note
        // console.log("start new note editing...");
        setNewKeyFlag(false);
        setEditingId(ids.new_note);
        setDisableKeyboardNavigation(true);
      } else if (newKeyFlag) {
        event.preventDefault();
        setNewKeyFlag(false);
      } else { }

      // copy key with C
      if (!copyKeyFlag && event.code === 'KeyC') {
        event.preventDefault();
        setCopyKeyFlag(true);
      } else if (copyKeyFlag && event.code === 'KeyA') {
        // copy all item's text
        event.preventDefault();
        let text = "";
        text = weekState.week_title;
        text = text + "\n";
        weekState.items.forEach((item) => {
          if (item.kind === itemKind.goal)
            text = text + item.title + "\n";
          if (item.kind === itemKind.note)
            text = text + item.note + "\n";
        });
        console.log("Copied all items in the week into clipboard:");
        console.log(text);
        navigator.clipboard.writeText(text);
        setCopyKeyFlag(false);
      } else if (copyKeyFlag) {
        event.preventDefault();
        setCopyKeyFlag(false);
      } else { }

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
  }, [disableKeyboardNavigation, newKeyFlag, copyKeyFlag, editingId]);

  const handleOnCancel = function(id: number) {
    // console.log("handleOnCancel id:", id);
    setEditingId(ids.none);
    setDisableKeyboardNavigation(false);
    invoke("get_week_state").then((result) => {
      // console.log("result:", result);
      setWeekState(result);
    });
  }

  const handleOnEdit = function(id: number) {
    // console.log(`new onEdit(${id})`);
    if (editingId != ids.none) {
      console.log("error: editingId is already set.");
    }
    setEditingId(id);
    setDisableKeyboardNavigation(true);
  }

  const handleOnSelect = function(id: number) {
    // console.log(`new onSelect(${id})`);
    setSelectedId(id);
  }

  const handleOnToggle = function(id: number) {
    // console.log(`new handleOnToggle(${id})`);
    invoke("toggle_item_state", { id: id }).then((result) => {
      setWeekState(result);
    });
  }

  const handleOnFocusLeave = function({ id, text }) {
    // disable text field if it's for new goal/note input and is empty
    if (text != "") return;
    if (id == ids.new_goal || id == ids.new_note) {
      handleOnCancel(id);
    }
  }

  const showNextWeek = function() {
    invoke("get_next_week").then((result) => {
      setWeekState(result);
    });
  }

  const showPreviousWeek = function() {
    invoke("get_previous_week").then((result) => {
      setWeekState(result);
    });
  }

  const showCurrentWeek = function() {
    invoke("get_current_week").then((result) => {
      setWeekState(result);
    });
  }

  const handleOnSubmit = function({ id, text, keyboard_submit }) {
    if (id === undefined || text === undefined) return;
    if (id == ids.new_goal) {
      invoke("add_new_goal", { text: text }).then((result) => {
        setWeekState(result);
      });
      // to continue adding new goals or not?
      if (keyboard_submit === undefined) {
        setEditingId(ids.none);
        setDisableKeyboardNavigation(false);
      } else
        setEditingId(ids.new_goal);
    } else if (id == ids.new_note) {
      // comment if you want to continue new note section
      setEditingId(ids.none);
      setDisableKeyboardNavigation(false);
      invoke("add_new_note", { text: text }).then((result) => {
        setWeekState(result);
      });
    } else if (editingId == id) { // submiting an edit on previous item
      setEditingId(ids.none);
      setDisableKeyboardNavigation(false);
      invoke("update_item", { id: id, text: text }).then((result) => {
        setWeekState(result);
      });
    } else { }
  }

  const handleOnDelete = function(id: string) {
    invoke("delete_item", { id: id }).then((result) => {
      setWeekState(result);
    });
  }

  const onSpeedDialClick = function(action_name: string) {
    if (editingId != ids.none) return;
    // console.log(action_name);
    if (action_name == 'Goal' && editingId == ids.none) {
      setEditingId(ids.new_goal);
      setDisableKeyboardNavigation(true);
    }
    if (action_name == 'Note' && editingId == ids.none) {
      setEditingId(ids.new_note);
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
          <Header
            today_persian_date={weekState.today_persian_date}
            today_english_date={weekState.today_english_date}
          />
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
            onFocusLeave={handleOnFocusLeave}
            onNextWeek={showNextWeek}
            onPreviousWeek={showPreviousWeek}
          />
          {editingId == ids.none && <BasicSpeedDial onClick={onSpeedDialClick} />}
        </CssBaseline>
      </ThemeProvider>
    </React.Fragment>

  );
}

export default App;
