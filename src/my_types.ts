export interface CalendarView {
  calendar: number;
  calendar_name: string
  language: string;
  direction: string;
  months_names: Array<string>;
  seasons_names: Array<string>;
};

export interface Item {
  id: number;
  calendar: number;
  year: number | null;
  season: number | null;
  month: number | null;
  day: number;
  kind: number;
  fixed_date: boolean;
  all_day: boolean;
  title: string | null;
  note: string | null;
  datetime: string | null;
  duration: number | null;
  status: number | null;
  order_in_week: string | null;
  order_in_resolution: string | null;
  sync: number | null;
  uuid: string | null;
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
  week_info: WeekInfo;
  aux_week_info: WeekInfo | null;
  year: number | null;
  items: Array<any>;
};
