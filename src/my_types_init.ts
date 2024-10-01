import { CalendarView, Date, DateView, ItemsData, ObjectiveTag, Today, WeekInfo } from "./my_types";

export const calendar_view_init: CalendarView = {
  calendar: 0,
  calendar_name: "Gregorian",
  language: "en",
  direction: "ltr",
  months_names: [],
  seasons_names: [],
};

export const objective_tag_init: ObjectiveTag = {
  calendar: 0,
  text: "",
  type: 0,
  calendar_name: "Gregorian",
  language: "en",
  year_string: "2024",
  year: 2024,
  season: null,
  month: null,
}

export const date_init: Date = {
  calendar: "Gregorian",
  weekday: 0,
  day: 0,
  month: 0,
  year: 0,
};

export const date_view_init: DateView = {
  unix_day: 0,
  day: "",
  month: "",
  weekday: "",
  year: "",
};

export const today_init: Today = {
  main_date: date_init,
  main_date_view: date_view_init,
  aux_date_view: null,
};

export const week_info_init: WeekInfo = {
  calendar: "Gregorian",
  language: "en",
  direction: "ltr",
  dates: [],
  month_year_info: "",
};

export const items_data_init: ItemsData = {
  title: "",
  info: "",
  year: "",
  items: [],
  week_info_main: week_info_init,
  week_info_aux: null,
};
