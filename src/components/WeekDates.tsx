// import Tooltip from '@mui/material/Tooltip';
import { DateView, WeekInfo } from '../my_types';

export default function WeekDates(props: any) {
  if (props.data.week_info_main === undefined || props.today === undefined) return;
  const week_info: WeekInfo = props.data.week_info_main;
  const today: DateView = props.today.main_date_view;
  const aux_week_info: WeekInfo = props.data.week_info_aux;
  const date_view_elements = week_info.dates.map((dw: DateView, i: number) => {
    const dayClass = dw.unix_day == today.unix_day ? "week-header-date-day week-header-date-day-today" : "week-header-date-day";
    const weekdayClass = dw.unix_day == today.unix_day ? "week-header-date-weekday week-header-date-weekday-today" : "week-header-date-weekday";
    const aux_day: string = aux_week_info?.dates[i].day ?? "";
    return (
      <div className="week-header-date"
        key={i}
      >
        <div className={weekdayClass}>{dw.weekday}</div>
        <div className={dayClass}>
          <div className="week-header-main-date-day">{dw.day}</div>
          <div className="week-header-aux-date-day">{aux_day}</div>
        </div>
      </div>
    );
  });

  return (
    <div className="week-header-middle-section">
      <div className="week-header-main-info-top">
      </div>
      <div className="week-header-dates">
        {date_view_elements}
      </div>
      <div className="week-header-info-bottom">
        <div className="week-header-main-info">
          {week_info.month_year_info}
        </div>
        {aux_week_info && <div className="week-header-aux-info">
          {aux_week_info.month_year_info}
        </div>}
      </div>
    </div>
  );
}
