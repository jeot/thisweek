import './styles.css';
import '../prototypes.ts';
import { DateView, Today } from '../my_types.ts';
import { Chip } from '@mui/material';
import TodayIcon from '@mui/icons-material/Today';

export default function Header({ today, gotoToday }: { today: Today, gotoToday: VoidFunction }) {
  if (today === undefined) return;
  function build_date_string(dw: DateView | null) {
    if (dw === null) return null;
    else return `${dw.weekday} ${dw.day} ${dw.month} ${dw.year}`;
  }
  const main_date = build_date_string(today.main_date_view);
  const aux_date = build_date_string(today.aux_date_view);
  return (
    <div className="header">
      <Chip
        icon={<TodayIcon />} color="primary" size="small" label={main_date}
        onClick={gotoToday}
      />
      {aux_date &&
        <Chip
          icon={<TodayIcon />} color="secondary" size="small" label={aux_date}
          variant="filled" onClick={gotoToday}
        />
      }
    </div>
  );

}
