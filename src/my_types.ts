export interface CalendarView {
  calendar: number;
  calendar_name: string
  language: string;
  direction: string;
  months_names: Array<string>;
  seasons_names: Array<string>;
};

export interface ItemView {
  id: number,
  calendar: number,
  kind: number,
  text: string,
  status: boolean,
  fixed_day_tag: string | null,
  objective_tag: any | null,
  uuid: string | null,
};

export interface Date {
  calendar: any,
  weekday: number,
  day: number,
  month: number,
  year: number,
};

export interface DateView {
  unix_day: number;
  day: string;
  month: string;
  weekday: string;
  year: string;
};

export interface Today {
  main_date: Date,
  main_date_view: DateView,
  aux_date_view: DateView | null,
};

export interface WeekInfo {
  calendar: any;
  language: any;
  direction: string;
  dates: Array<DateView>;
  month_year_info: string;
};

export interface ItemsData {
  title: string;
  info: string;
  week_info_main: WeekInfo;
  week_info_aux: WeekInfo | null;
  year: string;
  items: Array<any>;
};
