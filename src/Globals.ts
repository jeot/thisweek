import { CalendarView } from "./my_types";
import { invoke } from "@tauri-apps/api/core";
import { getVersion } from '@tauri-apps/api/app';

let mainCalendarView: CalendarView;
let auxCalendarView: CalendarView | null;

let weekAppVersion: string = "";
// let weekCoreVersion: string = "";


function init() {
  // console.log("fetching the calendar views...");
  invoke("get_calendar_views").then((result: any) => {
    // console.log("calendar views result: ", result);
    mainCalendarView = result[0] as CalendarView;
    auxCalendarView = result[1] as CalendarView;
    mainCalendarView.seasons_names.splice(0, 0, "");
    mainCalendarView.months_names.splice(0, 0, "");
    auxCalendarView.seasons_names.splice(0, 0, "");
    auxCalendarView.months_names.splice(0, 0, "");
  });

  getVersion().then((result: string) => {
    weekAppVersion = result;
  });
}

function getMainCalendarView() {
  return mainCalendarView;
}

function getAuxCalendarView() {
  return auxCalendarView;
}

function getWeekAppVersion() {
  return weekAppVersion;
}

export { init, getMainCalendarView, getAuxCalendarView, getWeekAppVersion };
