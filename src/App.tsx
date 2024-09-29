import * as React from 'react';
import { useState, useEffect, useRef, createRef } from "react";
import useStateRef from 'react-usestateref'
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from '@tauri-apps/api/window'

import { listen } from "@tauri-apps/api/event";

import Header from "./components/Header.tsx"
import SidebarNav from './components/SidebarNav.tsx';
import Content from './components/Content.tsx';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material';

import ShabnamThin from './assets/fonts/Shabnam-Thin.woff';
import ShabnamLight from './assets/fonts/Shabnam-Light.woff';
import ShabnamNormal from './assets/fonts/Shabnam.woff';
import ShabnamMedium from './assets/fonts/Shabnam-Medium.woff';
import ShabnamBold from './assets/fonts/Shabnam-Bold.woff';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { Action, ID, ItemKind, ObjectiveType, Page, ItemStatus } from './constants.ts';
import * as Keyboard from "./Keyboard.ts"
import * as Globals from "./Globals.ts"
import './components/styles.css';
import type { Today, ItemView, ItemsData } from "./my_types.ts"
import { getName, getVersion } from '@tauri-apps/api/app';

// same type as payload
type EventPayload = {
  command: string;
  message: string;
};

function App() {

  const today_init: Today = undefined;

  const item_init: ItemView = {
    id: ID.none,
    calendar: 0,
    kind: ItemKind.goal,
    text: "",
    status: false,
    fixed_day_tag: null,
    objective_tag: null,
    uuid: null,
  }

  const items_data_init: ItemsData = {
    title: "",
    info: "",
    year: "",
    items: [],
  };

  const [activePage, setActivePage, activePageRef] = useStateRef<number>(Page.weeks);
  const [editingId, setEditingId] = useState<number>(ID.none);
  const [selectedId, setSelectedId, selectedIdRef] = useStateRef<number>(ID.none);
  const [today, setToday, _todayRef] = useStateRef<Today>(today_init);
  const [data, setData, dataRef] = useStateRef<ItemsData>(items_data_init);
  const [appName, setAppName] = useState<string>("");
  const [appVersion, setAppVersion] = useState<string>("");
  const [newItemKind, setNewItemKind] = useState<number>(ItemKind.goal);

  getName().then((result: string) => {
    setAppName(result);
  });

  getVersion().then((result: string) => {
    setAppVersion(result);
  });

  // const itemsCount = (data?.items.length) ?? 0;
  // const itemsRefs = useRef<Array<undefined | React.RefObject<unknown>>>(Array(0));
  // console.log(itemsCount);
  // if (itemsRefs.current.length != itemsCount) {
  //   // add or remove refs
  //   itemsRefs.current = Array(itemsCount) // make an empty slot array with defined length
  //     .fill(undefined) // fill them all with undefined
  //     .map((_, i) => itemsRefs.current[i] || createRef());
  // }

  async function startBackendEventListenning() {
    const unlisten = await listen<EventPayload>('ConfigChanged', (event) => {
      // console.log("config file changed.");
      // console.log(event.payload);
      refreshData();
    });
    return unlisten;
  }

  // first time only
  useEffect(() => {
    Globals.init();

    Keyboard.init();
    Keyboard.listen(keyboard_action_callback);

    // console.log("backend event listening started!");
    const unlisten_promiss = startBackendEventListenning();

    refreshData();

    // clean up
    return () => {
      unlisten_promiss.then((unlisten_func) => unlisten_func());
    };
  }, []
  );

  useEffect(() => {
    refreshData();
  }, [activePage]);


  const refreshData = function() {
    invoke("get_today").then((result) => {
      // console.log("today");
      // console.log("today result: ", result);
      setToday(result as Today);
    });

    if (activePageRef.current == Page.weeks) {
      invoke("get_week").then((result) => {
        // console.log("week");
        // console.log("week result: ", result);
        // console.log(result.week_info);
        // console.log(result.aux_week_info);
        // console.log(result.items);
        setData(result as ItemsData);
      });
    }
    if (activePageRef.current == Page.objectives) {
      invoke("get_year").then((result) => {
        // console.log("year items:", result.items);
        // console.log("get year:", result);
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
      case Action.gotoNextWeek: gotoNextWeek(); break;
      case Action.gotoPreviousWeek: gotoPreviousWeek(); break;
      case Action.gotoNextYear: gotoNextYear(); break;
      case Action.gotoPreviousYear: gotoPreviousYear(); break;
      case Action.escapePressed: cancelEditingOrSelectionOrNewItem(); break;
      case Action.selectNextItem: selectNextItem(); break;
      case Action.selectPreviousItem: selectPreviousItem(); break;
      case Action.newGoal:
        startCreatingNewItem(ItemKind.goal);
        break;
      case Action.newNote:
        startCreatingNewItem(ItemKind.note);
        break;
      case Action.editSelectedItem: handleOnEdit(selectedIdRef.current); break;
      case Action.deleteSelectedItem: deleteSelectedItem(); break;
      case Action.copySelectedItemText: handleOnCopyText(selectedIdRef.current); break;
      case Action.toggleSelectedItemState: handleOnToggle(selectedIdRef.current); break;
      case Action.moveUpSelectedItem: moveUpSelectedItem(); break;
      case Action.moveDownSelectedItem: moveDownSelectedItem(); break;
      case Action.moveSelectedItemToNextTimePeriod: moveSelectedItemToNextTimePeriod(); break;
      case Action.moveSelectedItemToPreviousTimePeriod: moveSelectedItemToPreviousTimePeriod(); break;
      case Action.displayWeeksPage: displayPage(Page.weeks); break;
      case Action.displayObjectivesPage: displayPage(Page.objectives); break;
      case Action.switchObjectivesCalendar: switchObjectivesCalendar(); break;
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

  const cancelEditingOrSelectionOrNewItem = function() {
    setEditingId(ID.none);
    setSelectedId(ID.none);
    Keyboard.set_insert_mode(false);
  }

  const handleOnEdit = function(id: number) {
    if (id < 0) return;
    // console.log(`new onEdit(${id})`);
    if (editingId != ID.none) {
      console.log("error: editingId is already set.");
    }
    setEditingId(id);
    Keyboard.set_insert_mode(true);
  }

  const handleOnSelect = function(id: number) {
    if (id < 0) return;
    setSelectedId(id);
  }

  const invoke_tauri_command_and_refresh_data = function(command: string, object: any) {
    invoke(command, object).then((result) => {
      const log = `command: ${command} -> ${result ? "success" : "failed"}`;
      // console.log(log);
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
    if (id == ID.new_item) {
      cancelEditingOrSelectionOrNewItem();
    }
  }

  const handleOnObjectiveTypeChanged = function(id: number, year: number, season: number | null, month: number | null) {
    // console.log("changing the objective type...");
    // console.log(id, year, season, month);
    invoke_tauri_command_and_refresh_data("change_item_objective_period", { id: id, year: year, season: season, month: month });
  }

  const gotoNextTimePeriod = function() {
    setSelectedId(ID.none);
    invoke_tauri_command_and_refresh_data("next_time_period", { page: activePageRef.current });
  }

  const gotoPreviousTimePeriod = function() {
    setSelectedId(ID.none);
    invoke_tauri_command_and_refresh_data("previous_time_period", { page: activePageRef.current });
  }

  const gotoCurrentTimePeriod = function() {
    setSelectedId(ID.none);
    invoke_tauri_command_and_refresh_data("current_time_period", { page: activePageRef.current });
  }

  const switchObjectivesCalendar = function() {
    if (activePageRef.current != Page.objectives) return;
    setSelectedId(ID.none);
    invoke_tauri_command_and_refresh_data("switch_objectives_calendar", { page: activePageRef.current });
  }

  const gotoNextWeek = function() {
    if (activePageRef.current == Page.weeks) gotoNextTimePeriod();
    else {
      setActivePage(Page.weeks);
      invoke_tauri_command_and_refresh_data("current_time_period", { page: activePageRef.current });
    }
  }

  const gotoPreviousWeek = function() {
    if (activePageRef.current == Page.weeks) gotoPreviousTimePeriod();
    else {
      setActivePage(Page.weeks);
      invoke_tauri_command_and_refresh_data("current_time_period", { page: activePageRef.current });
    }
  }

  const gotoNextYear = function() {
    if (activePageRef.current == Page.objectives) gotoNextTimePeriod();
    else {
      setActivePage(Page.objectives);
      invoke_tauri_command_and_refresh_data("current_time_period", { page: activePageRef.current });
    }
  }

  const gotoPreviousYear = function() {
    if (activePageRef.current == Page.objectives) gotoPreviousTimePeriod();
    else {
      setActivePage(Page.objectives);
      invoke_tauri_command_and_refresh_data("current_time_period", { page: activePageRef.current });
    }
  }

  const selectNextItem = function() {
    const arrLen = dataRef.current.items.length;
    if (arrLen == 0) {
      setSelectedId(ID.none);
    } else if (selectedIdRef.current == ID.none) {
      setSelectedId(getItemIdFromItemIndex(0));
    } else {
      const index = getItemIndexFromItemId(selectedIdRef.current);
      if ((index + 1) < arrLen) setSelectedId(getItemIdFromItemIndex(index + 1));
    }
  }

  const selectPreviousItem = function() {
    const arrLen = dataRef.current.items.length;
    if (arrLen == 0) setSelectedId(ID.none);
    else if (selectedIdRef.current == ID.none) setSelectedId(getItemIdFromItemIndex(arrLen - 1));
    else {
      const index = getItemIndexFromItemId(selectedIdRef.current);
      if (index > 0) setSelectedId(getItemIdFromItemIndex(index - 1));
    }
  }

  const copyAllWeekItemsToClipboard = () => {
    const currentData: ItemsData = dataRef.current;
    // console.log("copying all items...");
    let text: string = "";
    text = currentData.title;
    text = text + "\n\n";
    currentData.items.forEach((item) => {
      if (item.kind === ItemKind.goal)
        text = text + item.title + "\n";
      if (item.kind === ItemKind.note)
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
    if (item.kind === ItemKind.goal)
      navigator.clipboard.writeText(item.title);
    if (item.kind === ItemKind.note)
      navigator.clipboard.writeText(item.note);
  }

  const moveUpSelectedItem = function() {
    if (selectedIdRef.current < 0) return;
    invoke_tauri_command_and_refresh_data("move_up_selected_item", { page: activePageRef.current, id: selectedIdRef.current });
  }

  const moveDownSelectedItem = function() {
    if (selectedIdRef.current < 0) return;
    invoke_tauri_command_and_refresh_data("move_down_selected_item", { page: activePageRef.current, id: selectedIdRef.current });
  }

  const moveSelectedItemToNextTimePeriod = function() {
    if (selectedIdRef.current < 0) return;
    invoke_tauri_command_and_refresh_data("move_item_to_other_time_period_offset", { page: activePageRef.current, id: selectedIdRef.current, offset: 1 });
    invoke_tauri_command_and_refresh_data("next_time_period", { page: activePageRef.current });
  }

  const moveSelectedItemToPreviousTimePeriod = function() {
    if (selectedIdRef.current < 0) return;
    invoke_tauri_command_and_refresh_data("move_item_to_other_time_period_offset", { page: activePageRef.current, id: selectedIdRef.current, offset: -1 });
    invoke_tauri_command_and_refresh_data("previous_time_period", { page: activePageRef.current });
  }

  const handleOnNewSubmit = function(kind: number, text: string, keyboard_submit: boolean) {
    // console.log("handleOnNewSubmit: ", kind, text);
    if (kind == ItemKind.goal) {
      invoke_tauri_command_and_refresh_data("add_new_item", { page: activePageRef.current, kind: kind, text: text });
      if (!keyboard_submit) {
        cancelEditingOrSelectionOrNewItem();
      }
    } else if (kind == ItemKind.note) {
      invoke_tauri_command_and_refresh_data("add_new_item", { page: activePageRef.current, kind: kind, text: text });
      cancelEditingOrSelectionOrNewItem();
    } else { }
  }

  const handleOnEditSubmit = function(id: number, text: string) {
    // console.log("handleOnEditSubmit: ", id, text);
    if (editingId == id) {
      invoke_tauri_command_and_refresh_data("edit_item_text", { id: id, text: text });
      cancelEditingOrSelectionOrNewItem();
    } else { }
  }

  const deleteSelectedItem = function() {
    if (selectedIdRef.current < 0) return;
    let nextId: number | null = null;
    invoke("get_near_items_id", { id: selectedIdRef.current, page: activePageRef.current }).then((result) => {
      const two_ids = result as Array<any>;
      nextId = two_ids[1];
      handleOnDelete(selectedIdRef.current);
      if (nextId != null) {
        setSelectedId(nextId);
      } else {
        setSelectedId(ID.none);
      }
    });
  }

  const handleOnDelete = function(id: number) {
    if (id < 0) return;
    invoke_tauri_command_and_refresh_data("delete_item", { id: id });
  }

  const startCreatingNewItem = function(itemKind: number) {
    if (editingId != ID.none) return;
    setSelectedId(ID.none);
    setEditingId(ID.new_item);
    setNewItemKind(itemKind);
    Keyboard.set_insert_mode(true);
  }

  const displayPage = function(page: number) {
    if (page == Page.weeks) {
      setActivePage(Page.weeks);
      invoke_tauri_command_and_refresh_data("current_time_period", { page: activePageRef.current });
    } else if (page == Page.objectives) {
      setActivePage(Page.objectives);
      invoke_tauri_command_and_refresh_data("current_time_period", { page: activePageRef.current });
    } else if (page == Page.settings) {
      console.log("displaying settings page...");
      setActivePage(Page.settings);
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
              today={today}
            />
            <div className="main" >
              <SidebarNav onClick={displayPage} activePage={activePage} />
              <Content
                page={activePage}
                data={data}
                today={today}
                editingId={editingId}
                selectedId={selectedId}
                newItemKind={newItemKind}
                onNext={gotoNextTimePeriod}
                onPrevious={gotoPreviousTimePeriod}
                onSwitchObjectivesCalendar={switchObjectivesCalendar}
                onNewSubmit={handleOnNewSubmit}
                onEditSubmit={handleOnEditSubmit}
                onEdit={handleOnEdit}
                onSelect={handleOnSelect}
                onDelete={handleOnDelete}
                onCancel={cancelEditingOrSelectionOrNewItem}
                onToggle={handleOnToggle}
                onCopyText={handleOnCopyText}
                onFocusLeave={handleOnFocusLeave}
                onObjectiveTypeChanged={handleOnObjectiveTypeChanged}
                onNewAction={startCreatingNewItem}
              />
            </div>
            {/* <div className="app-info">{appName}&nbsp;{appVersion}</div> */}
          </div>
        </CssBaseline>
      </ThemeProvider>
    </React.Fragment >

  );
}

export default App;
