
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

export interface Today {
  calendar: number;
  year: number;
  month: number;
  day: number;
  today_persian_date: string;
  today_english_date: string;
}

export interface ItemsData {
  title: string;
  info: string;
  year: number | null;
  items: Array<any>;
};
