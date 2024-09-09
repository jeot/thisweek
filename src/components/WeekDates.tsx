import Tooltip from '@mui/material/Tooltip';
import { DateView, Today, WeekInfo } from '../my_types';

export default function WeekDates(props: any) {
  const week_info: WeekInfo = props.data.week_info;
  const today: DateView = props.today.date_view;
  if (week_info === undefined || today === undefined) return;
  // console.log(today);
  // console.log(week_info);
  const date_view_elements = week_info.dates.map((dw: DateView, i: number) => {
    const dayClass = dw.unix_day == today.unix_day ? "week-header-date-day week-header-date-day-today" : "week-header-date-day";
    const weekdayClass = dw.unix_day == today.unix_day ? "week-header-date-weekday week-header-date-weekday-today" : "week-header-date-weekday";
    return (
      <div className="week-header-date"
        key={i}
      >
        <div className={weekdayClass}>{dw.weekday}</div>
        <div className={dayClass}>{dw.day}</div>
      </div>
    );
  });

  return (
    <div className="week-header-middle-section">
      <div className="week-header-top-info">
      </div>
      <div className="week-header-dates">
        {date_view_elements}
      </div>
      <div className="week-header-top-info">
        {week_info.month_year_info}
      </div>
    </div>
  );
}
