import * as React from 'react';
import { useState, useEffect, useRef, createRef } from "react";
import useStateRef from 'react-usestateref'
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from '@tauri-apps/api/window'
import Week from "./components/Week.tsx"
import Objectives from "./components/Objectives.tsx"
import BasicSpeedDial from "./components/BasicSpeedDial.tsx"
import Header from "./components/Header.tsx"
import SidebarNav from './components/SidebarNav.tsx';
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
import { Action, ids, itemKind, Page, SideButton } from './constants.ts';

import './components/styles.css';

function App() {

  // interface Item { };
  interface Today {
    today_persian_date: string;
    today_english_date: string;
  }
  interface ItemsData {
    title: string;
    info: string;
    items: Array<any>;
  };

  const today_init: Today = {
    today_persian_date: "",
    today_english_date: "",
  };
  const items_data_init: ItemsData = {
    title: "",
    info: "",
    items: [],
  };

  const [activePage, setActivePage, activePageRef] = useStateRef(Page.weeks);
  const [activeSideButton, setActiveSideButton] = useState(SideButton.week);
  const [editingId, setEditingId] = useState(ids.none);
  const [selectedId, setSelectedId, selectedIdRef] = useStateRef(ids.none);
  const [today, setToday, dataToday] = useStateRef<Today>(today_init);
  const [data, setData, dataRef] = useStateRef<ItemsData>(items_data_init);
  // const [refreshData, setRefreshData] = useState<boolean>(true);
  // const [refreshData, setRefreshData, refreshDataRef] = useStateRef<boolean>(true);

  const itemsCount = (data?.items.length) ?? 0;
  const itemsRefs = useRef<Array<undefined | React.RefObject<unknown>>>(Array(0));

  if (itemsRefs.current.length !== itemsCount) {
    // add or remove refs
    itemsRefs.current = Array(itemsCount) // make an empty slot array with defined length
      .fill(undefined) // fill them all with undefined
      .map((_, i) => itemsRefs.current[i] || createRef());
  }

  useEffect(() => {
    refreshData();
  }, [activePage]);

  useEffect(() => {
    Keyboard.init();
    Keyboard.listen(keyboard_action_callback);


    invoke("get_today").then((result) => {
      // console.log("today result: ", result);
      setToday(result as Today);
    });

    refreshData();
  }, []
  );

  const refreshData = function() {
    if (activePageRef.current == Page.weeks) {
      invoke("get_week").then((result) => {
        setData(result as ItemsData);
      });
    }
    if (activePageRef.current == Page.objectives) {
      invoke("get_year").then((result) => {
        setData(result as ItemsData);
      });
    }
  }

  const keyboard_action_callback = (action: number) => {
    // console.log("this is keyboard_callback in App! new action: ", action);
    switch (action) {
      case Action.toggleMaximizeWindow: appWindow.toggleMaximize(); break;
      case Action.closeWindow: appWindow.close(); break;
      case Action.gotoNextTimePeriod: gotoNextTimePeriod(); break;
      case Action.gotoPreviousTimePeriod: gotoPreviousTimePeriod(); break;
      case Action.gotoCurrentTimePeriod: gotoCurrentTimePeriod(); break;
      case Action.escapePressed: handleOnCancel(); break;
      case Action.selectNextItem: selectNextItem(); break;
      case Action.selectPreviousItem: selectPreviousItem(); break;
      case Action.newGoal:
        setEditingId(ids.new_goal);
        Keyboard.set_insert_mode(true);
        break;
      case Action.newNote:
        setEditingId(ids.new_note);
        Keyboard.set_insert_mode(true);
        break;
      case Action.editSelectedItem: handleOnEdit(selectedIdRef.current); break;
      case Action.deleteSelectedItem: handleOnDelete(selectedIdRef.current); break;
      case Action.copySelectedItemText: handleOnCopyText(selectedIdRef.current); break;
      case Action.toggleSelectedItemState: handleOnToggle(selectedIdRef.current); break;
      case Action.moveUpSelectedItem: moveUpSelectedItem(); break;
      case Action.moveDownSelectedItem: moveDownSelectedItem(); break;
      case Action.moveSelectedItemToNextWeek: moveSelectedItemToNextWeek(); break;
      case Action.moveSelectedItemToPreviousWeek: moveSelectedItemToPreviousWeek(); break;
      case Action.copyAllItems: copyAllWeekItemsToClipboard(); break;
      case Action.backupDbFile: backupDbFile(); break;
      default:
        console.log("Warning! @keyboard_action_callback() invalid action number callback: ", action);
    }
  }

  const getItemIdFromItemIndex = function(index: number) {
    if (index == null) return null;
    const length = dataRef.current.items.length;
    if (index < 0 || index >= length) return null
    const id = dataRef.current.items[index].id;
    return id;
  }

  const getItemIndexFromItemId = function(id: number) {
    const index = dataRef.current.items.findIndex(item => item.id == id);
    return index;
  }

  const handleOnCancel = function() {
    setEditingId(ids.none);
    setSelectedId(ids.none);
    Keyboard.set_insert_mode(false);
    // refreshData();
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
    setSelectedId(id);
  }

  const invoke_tauri_command_and_refresh_data = function(command: string, object: any) {
    invoke(command, object).then((result) => {
      const log = `command: ${command} -> ${result ? "success" : "failed"}`;
      console.log(log);
      refreshData();
    });
  }

  const handleOnToggle = function(id: number) {
    if (id < 0) return;
    invoke_tauri_command_and_refresh_data("toggle_item_state", { id: id });
  }

  const handleOnFocusLeave = function({ id, text }: { id: number, text: string }) {
    // disable text field if it's for new goal/note input and is empty
    if (text != "") return;
    if (id == ids.new_goal || id == ids.new_note) {
      handleOnCancel();
    }
  }

  const gotoNextTimePeriod = function() {
    setSelectedId(ids.none);
    invoke_tauri_command_and_refresh_data("next_time_period", { page: activePageRef.current });
  }

  const gotoPreviousTimePeriod = function() {
    setSelectedId(ids.none);
    invoke_tauri_command_and_refresh_data("previous_time_period", { page: activePageRef.current });
  }

  const gotoCurrentTimePeriod = function() {
    setSelectedId(ids.none);
    invoke_tauri_command_and_refresh_data("current_time_period", { page: activePageRef.current });
  }

  const selectNextItem = function() {
    const arrLen = dataRef.current.items.length;
    if (arrLen == 0) setSelectedId(ids.none);
    else if (selectedIdRef.current == ids.none) setSelectedId(getItemIdFromItemIndex(0));
    else {
      const index = getItemIndexFromItemId(selectedIdRef.current);
      if ((index + 1) < arrLen) setSelectedId(getItemIdFromItemIndex(index + 1));
    }
  }

  const selectPreviousItem = function() {
    const arrLen = dataRef.current.items.length;
    if (arrLen == 0) setSelectedId(ids.none);
    else if (selectedIdRef.current == ids.none) setSelectedId(getItemIdFromItemIndex(arrLen - 1));
    else {
      const index = getItemIndexFromItemId(selectedIdRef.current);
      if (index > 0) setSelectedId(getItemIdFromItemIndex(index - 1));
    }
  }

  const copyAllWeekItemsToClipboard = () => {
    const currentData: ItemsData = dataRef.current;
    console.log("copying all items...");
    let text: string = "";
    text = currentData.title;
    text = text + "\n\n";
    currentData.items.forEach((item) => {
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

  const backupDbFile = () => {
    invoke("backup_database_file").then((result /* boolean */) => {
      if (result) {
        console.log("backup database file successful.");
      } else {
        console.log("Error backing up db file.");
      }
    });
  }

  const handleOnCopyText = function(id: number) {
    const item = dataRef.current.items.find((item) => { return (item.id == id); });
    if (item.kind === itemKind.goal)
      navigator.clipboard.writeText(item.title);
    if (item.kind === itemKind.note)
      navigator.clipboard.writeText(item.note);
  }
  const moveUpSelectedItem = function() {
    if (selectedIdRef.current < 0) return;
    invoke("move_up_selected_item", { id: selectedIdRef.current }).then((result) => {
      setData(result as ItemsData);
    });
  }

  const moveDownSelectedItem = function() {
    if (selectedIdRef.current < 0) return;
    invoke("move_down_selected_item", { id: selectedIdRef.current }).then((result) => {
      setData(result as ItemsData);
    });
  }

  const moveSelectedItemToNextWeek = function() {
    if (selectedIdRef.current < 0) return;
    invoke("move_selected_item_to_next_week", { id: selectedIdRef.current }).then((result) => {
      setData(result as ItemsData);
    });
  }

  const moveSelectedItemToPreviousWeek = function() {
    if (selectedIdRef.current < 0) return;
    invoke("move_selected_item_to_previous_week", { id: selectedIdRef.current }).then((result) => {
      setData(result as ItemsData);
    });
  }

  const handleOnSubmit = function({ id, text, keyboard_submit }: { id: number, text: string, keyboard_submit: boolean }) {
    if (id === undefined || text === undefined) return;
    if (id == ids.new_goal) {
      invoke_tauri_command_and_refresh_data("add_new_item", { page: activePageRef.current, kind: itemKind.goal, text: text });
      // to continue adding new goals or not?
      if (keyboard_submit === undefined) {
        setEditingId(ids.none);
        Keyboard.set_insert_mode(false);
      } else {
        setEditingId(ids.new_goal);
      }
    } else if (id == ids.new_note) {
      // comment if you want to continue new note section
      setEditingId(ids.none);
      Keyboard.set_insert_mode(false);
      invoke_tauri_command_and_refresh_data("add_new_item", { page: activePageRef.current, kind: itemKind.note, text: text });
    } else if (editingId == id) { // submiting an edit on previous item
      setEditingId(ids.none);
      Keyboard.set_insert_mode(false);
      invoke_tauri_command_and_refresh_data("update_item", { id: id, text: text });
    } else { }
  }

  const handleOnDelete = function(id: number) {
    let nextId: number;
    invoke("get_near_items_id", { id: selectedIdRef.current, page: activePageRef.current }).then((result) => {
      const two_ids = result as Array<any>;
      nextId = two_ids[1];
      invoke("delete_item", { id: id }).then((result) => {
        refreshData();
        if (nextId != null) {
          setSelectedId(nextId);
        } else {
          setSelectedId(ids.none);
        }
      });
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

  const handleSideBarNavButtonOnClick = function(buttonId: number) {
    setActiveSideButton(buttonId);
    if (buttonId == SideButton.week) {
      console.log("displaying weeks page...");
      setActivePage(Page.weeks);
    } else if (buttonId == SideButton.objective) {
      setActivePage(Page.objectives);
      console.log("displaying objectives page...");
    } else if (buttonId == SideButton.setting) {
      // setActivePage(Page.settings);
      console.log("displaying settings page...");
    } else {
      console.log("other click. ignored.");
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
          <div className="application" >
            <Header
              // fix: get from today
              today_persian_date={today.today_persian_date}
              today_english_date={today.today_english_date}
            />
            <div className="main" >
              <SidebarNav onClick={handleSideBarNavButtonOnClick} activeSideButton={activeSideButton} />
              {activePage == Page.weeks ?
                <Week
                  itemsRefs={itemsRefs}
                  data={data}
                  editingId={editingId}
                  selectedId={selectedId}
                  onNext={gotoNextTimePeriod}
                  onPrevious={gotoPreviousTimePeriod}
                  onSubmit={handleOnSubmit}
                  onEdit={handleOnEdit}
                  onSelect={handleOnSelect}
                  onDelete={handleOnDelete}
                  onCancel={handleOnCancel}
                  onToggle={handleOnToggle}
                  onCopyText={handleOnCopyText}
                  onFocusLeave={handleOnFocusLeave}
                />
                : activePage == Page.objectives ? (
                  <Objectives
                    itemsRefs={itemsRefs}
                    data={data}
                    editingId={editingId}
                    selectedId={selectedId}
                    onNext={gotoNextTimePeriod}
                    onPrevious={gotoPreviousTimePeriod}
                    onSubmit={handleOnSubmit}
                    onEdit={handleOnEdit}
                    onSelect={handleOnSelect}
                    onDelete={handleOnDelete}
                    onCancel={handleOnCancel}
                    onToggle={handleOnToggle}
                    onCopyText={handleOnCopyText}
                    onFocusLeave={handleOnFocusLeave}
                  />
                ) : (<></>)}
              {editingId == ids.none && <BasicSpeedDial onClick={onSpeedDialClick} />}
            </div>
          </div>
        </CssBaseline>
      </ThemeProvider>
    </React.Fragment >

  );
}

export default App;
