import * as React from 'react';
import { useState, useEffect, useRef } from "react";
import useStateRef from 'react-usestateref'
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from '@tauri-apps/api/window'
import Week from "./components/Week.tsx"
import BasicSpeedDial from "./components/BasicSpeedDial.tsx"
import Header from "./components/Header.tsx"
import * as Keyboard from "./Keyboard.ts"

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
import { Action, ids, itemKind, itemStatus } from './constants.ts';


function App() {

  // interface Item { };
  interface WeekState {
    week_title: string;
    today_persian_date: string;
    today_english_date: string;
    items: [],
  };
  const week_init: WeekState = {
    week_title: "",
    today_persian_date: "",
    today_english_date: "",
    items: [],
  };

  const [editingId, setEditingId] = useState(ids.none)
  const [selectedId, setSelectedId, selectedIdRef] = useStateRef(ids.none)
  const [weekState, setWeekState] = useState(week_init);
  const weekStateRef = useRef();
  weekStateRef.current = weekState;

  useEffect(() => {
    Keyboard.init();
    Keyboard.listen(keyboard_action_callback);
    invoke("get_week_state").then((result) => {
      // console.log("get_week_state result: ", result);
      setWeekState(result);
    });
  }, []
  );

  const keyboard_action_callback = (action: number) => {
    console.log("this is keyboard_callback in App! new action: ", action);
    switch (action) {
      case Action.toggleMaximizeWindow: appWindow.toggleMaximize(); break;
      case Action.closeWindow: appWindow.close(); break;
      case Action.showNextWeek: showNextWeek(); break;
      case Action.showPreviousWeek: showPreviousWeek(); break;
      case Action.showCurrentWeek: showCurrentWeek(); break;
      case Action.escapePressed: handleOnCancel(); break;
      case Action.selectNextItem: selectNextItem(); break
      case Action.selectPreviousItem: selectPreviousItem(); break
      case Action.newGoal:
        setEditingId(ids.new_goal);
        Keyboard.set_insert_mode(true);
        break;
      case Action.newNote:
        setEditingId(ids.new_note);
        Keyboard.set_insert_mode(true);
        break;
      case Action.copyAllItems: copyAllWeekItemsToClipboard(); break;
      default:
        console.log("Warning! @keyboard_action_callback() invalid action number callback: ", action);
    }
  }

  const handleOnCancel = function(id?: number) {
    setEditingId(ids.none);
    setSelectedId(ids.none);
    Keyboard.set_insert_mode(false);
    invoke("get_week_state").then((result) => {
      setWeekState(result);
    });
  }

  const handleOnEdit = function(id: number) {
    // console.log(`new onEdit(${id})`);
    if (editingId != ids.none) {
      console.log("error: editingId is already set.");
    }
    setEditingId(id);
    Keyboard.set_insert_mode(true);
  }

  const handleOnSelect = function(id: number) {
    // console.log(`new onSelect(${id})`);
    setSelectedId(id);
    // invoke("get_near_items_id", { id: id }).then((result) => {
    //   console.log(result);
    // });
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
      handleOnCancel();
    }
  }

  const showNextWeek = function() {
    setSelectedId(ids.none);
    invoke("get_next_week").then((result) => {
      setWeekState(result);
    });
  }

  const showPreviousWeek = function() {
    setSelectedId(ids.none);
    invoke("get_previous_week").then((result) => {
      setWeekState(result);
    });
  }

  const showCurrentWeek = function() {
    setSelectedId(ids.none);
    invoke("get_current_week").then((result) => {
      setWeekState(result);
    });
  }

  const selectNextItem = function() {
    invoke("get_near_items_id", { id: selectedIdRef.current }).then((result) => {
      // console.log(result);
      const nextId = result[1];
      if (nextId != null) {
        setSelectedId(nextId);
      }
    });
  }

  const selectPreviousItem = function() {
    invoke("get_near_items_id", { id: selectedIdRef.current }).then((result) => {
      // console.log(result);
      const prevId = result[0];
      if (prevId != null) {
        setSelectedId(prevId);
      }
    });
  }

  const copyAllWeekItemsToClipboard = () => {
    const currentWeekState: WeekState = weekStateRef.current;
    console.log("copying all items...");
    let text: string = "";
    text = currentWeekState.week_title;
    text = text + "\n\n";
    currentWeekState.items.forEach((item) => {
      if (item.kind === itemKind.goal)
        text = text + item.title + "\n";
      if (item.kind === itemKind.note)
        text = text + item.note + "\n";
    });
    console.log("Copied all items in the week into clipboard:");
    console.log(text);
    navigator.clipboard.writeText(text);
    return text;
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
        Keyboard.set_insert_mode(false);
      } else
        setEditingId(ids.new_goal);
    } else if (id == ids.new_note) {
      // comment if you want to continue new note section
      setEditingId(ids.none);
      Keyboard.set_insert_mode(false);
      invoke("add_new_note", { text: text }).then((result) => {
        setWeekState(result);
      });
    } else if (editingId == id) { // submiting an edit on previous item
      setEditingId(ids.none);
      Keyboard.set_insert_mode(false);
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
      Keyboard.set_insert_mode(true);
    }
    if (action_name == 'Note' && editingId == ids.none) {
      setEditingId(ids.new_note);
      Keyboard.set_insert_mode(true);
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
