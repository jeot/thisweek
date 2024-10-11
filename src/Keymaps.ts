import { Action } from "./constants";

// N: Normal mode
// I: Insert mode (while typing in a textbox)
// mod: Alt, Shift, Ctrl (or combination of them seperated with comma(,))
// keys: A~Z, Enter, Delete, Space, Escape, ArrowUp, ArrowLeft, ArrowRight, ArrowDown
// keys: sequence of keys (seperated with space)

export const KEYMAPS = [
  { mode: "NI", mod: "Alt", keys: "Enter", action: Action.toggleMaximizeWindow, desc: "Toggle Window Maximum Size" },
  { mode: "NI", mod: "Alt", keys: "Q", action: Action.closeWindow, desc: "Close the Application" },
  { mode: "NI", mod: "", keys: "Escape", action: Action.escapePressed, desc: "Cancel Editing/Selection" },
  { mode: "N", mod: "", keys: "ArrowRight", action: Action.gotoNextTimePeriod, desc: "Goto Next Week/Year" },
  { mode: "N", mod: "", keys: "ArrowLeft", action: Action.gotoPreviousTimePeriod, desc: "Goto Previous Week/Year" },
  { mode: "N", mod: "", keys: "ArrowDown", action: Action.selectNextItem, desc: "Select Next Item" },
  { mode: "N", mod: "", keys: "ArrowUp", action: Action.selectPreviousItem, desc: "Select Previous Item" },
  { mode: "N", mod: "", keys: "W", action: Action.gotoNextWeek, desc: "Goto Next Week" },
  { mode: "N", mod: "Shift", keys: "W", action: Action.gotoPreviousWeek, desc: "Goto Previous Week" },
  { mode: "N", mod: "", keys: "T", action: Action.gotoCurrentTimePeriod, desc: "Goto Today's Week/Year" },
  { mode: "N", mod: "", keys: "O", action: Action.displayObjectivesPage, desc: "Display Objectives" },
  { mode: "N", mod: "", keys: "S", action: Action.switchObjectivesCalendar, desc: "Switch Objectives Calendar Display" },
  { mode: "N", mod: "", keys: "E", action: Action.editSelectedItem, desc: "Edit Selected Item" },
  { mode: "N", mod: "", keys: "Space", action: Action.toggleSelectedItemState, desc: "Toggle Done State of Selected Item" },
  { mode: "N", mod: "", keys: "Delete", action: Action.deleteSelectedItem, desc: "Delete Selected Item" },
  { mode: "N", mod: "Ctrl", keys: "ArrowUp", action: Action.moveUpSelectedItem, desc: "Move Selected Item Up" },
  { mode: "N", mod: "Ctrl", keys: "ArrowDown", action: Action.moveDownSelectedItem, desc: "Move Selected Item Down" },
  { mode: "N", mod: "Ctrl", keys: "ArrowRight", action: Action.moveSelectedItemToNextTimePeriod, desc: "Move Selected Item to Next Week/Year" },
  { mode: "N", mod: "Ctrl", keys: "ArrowLeft", action: Action.moveSelectedItemToPreviousTimePeriod, desc: "Move Selected Item to Previous Week/Year" },
  { mode: "N", mod: "Ctrl", keys: "C", action: Action.copySelectedItemText, desc: "Copy Text of Selected Item" },
  { mode: "N", mod: "", keys: ["N", "G"], action: Action.newGoal, desc: "Create New Goal" },
  { mode: "N", mod: "", keys: ["N", "N"], action: Action.newNote, desc: "Create New Note" },
  { mode: "N", mod: "", keys: ["C", "A"], action: Action.copyAllItems, desc: "Copy Text of all Items" },
  { mode: "N", mod: "", keys: ["C", "B"], action: Action.backupDbFile, desc: "Create Database Backup File" },
  /* vim mode */
  { mode: "N", mod: "", keys: "J", action: Action.selectNextItem, desc: "Select Next Item" },
  { mode: "N", mod: "", keys: "K", action: Action.selectPreviousItem, desc: "Select Previous Item" },
  { mode: "N", mod: "", keys: "L", action: Action.gotoNextTimePeriod, desc: "Goto Next Week/Year" },
  { mode: "N", mod: "", keys: "H", action: Action.gotoPreviousTimePeriod, desc: "Goto Previous Week/Year" },
  { mode: "N", mod: "Ctrl", keys: "J", action: Action.moveDownSelectedItem, desc: "Move Selected Item Down" },
  { mode: "N", mod: "Ctrl", keys: "K", action: Action.moveUpSelectedItem, desc: "Move Selected Item Up" },
  { mode: "N", mod: "Ctrl", keys: "L", action: Action.moveSelectedItemToNextTimePeriod, desc: "Move Selected Item to Next Week/Year" },
  { mode: "N", mod: "Ctrl", keys: "H", action: Action.moveSelectedItemToPreviousTimePeriod, desc: "Move Selected Item to Previous Week/Year" },
]
