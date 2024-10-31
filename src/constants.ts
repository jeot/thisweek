// constants file: matched with rust backend implementation
export enum ID {
  none = -1,
  new_item = -2,
};

export enum ItemKind {
  goal = 1,
  note,
  event,
};

export enum ItemStatus {
  undone = 0,
  done,
};

export enum Page {
  weeks = 1,
  objectives,
  settings,
};

export enum ObjectiveType {
  none = 0,
  monthly,
  seasonal,
  yearly,
};

export enum CalendarPriorityType {
  main = 0,
  secondary,
};

export enum Calendar {
  Gregorian = 0,
  Persian = 1,
};

export enum SettingSection {
  General = 0,
  Display,
  Keymaps,
  About,
}

export enum Action {
  none = 0,
  dummy,
  toggleMaximizeWindow,
  closeWindow,
  escapePressed,
  gotoNextTimePeriod,
  gotoPreviousTimePeriod,
  gotoCurrentTimePeriod,
  gotoNextWeek,
  gotoPreviousWeek,
  gotoNextYear,
  gotoPreviousYear,
  selectNextItem,
  selectPreviousItem,
  copyAllItems,
  newGoal,
  newNote,
  editSelectedItem,
  deleteSelectedItem,
  copySelectedItemText,
  toggleSelectedItemState,
  moveUpSelectedItem,
  moveDownSelectedItem,
  moveSelectedItemToNextTimePeriod,
  moveSelectedItemToPreviousTimePeriod,
  displayWeeksPage,
  displayObjectivesPage,
  switchObjectivesCalendar,
  backupDbFile,
};

// export const ID_NONE = -1;
// export const ID_NEW_GOAL = -2;
// export const ID_NEW_NOTE = -3;
// export const ID_NEW_EVENT = -4;
//
// export const ITEM_KIND_GOAL = 1;
// export const ITEM_KIND_NOTE = 2;
// export const ITEM_KIND_EVENT = 3;
//
// export const STATUS_UNDONE = 0;
// export const STATUS_DONE = 1;

