import { CalendarView } from "./my_types";
import { invoke } from "@tauri-apps/api/tauri";

let mainCalendarView: CalendarView;
let auxCalendarView: CalendarView | null;
let calendarViewsInitialized: boolean = false;

function init() {
  console.log("fetching the calendar views...");
  invoke("get_calendar_views").then((result: any) => {
    console.log("calendar views result: ", result);
    mainCalendarView = result[0] as CalendarView;
    auxCalendarView = result[1] as CalendarView;
    mainCalendarView.seasons_names.splice(0, 0, "");
    mainCalendarView.months_names.splice(0, 0, "");
    auxCalendarView.seasons_names.splice(0, 0, "");
    auxCalendarView.months_names.splice(0, 0, "");
  });
}

function getMainCalendarView() {
  return mainCalendarView;
}

function getAuxCalendarView() {
  return auxCalendarView;
}

export { init, getMainCalendarView, getAuxCalendarView };
