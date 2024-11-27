import './styles.css';
import '../prototypes.ts';
import { Today } from '../my_types.ts';
import { Chip } from '@mui/material';
import TodayIcon from '@mui/icons-material/Today';

export default function Header({ today, gotoToday }: { today: Today, gotoToday: VoidFunction }) {
  if (today === undefined) return;
  const main_date = today.main_date_view.full_format;
  const aux_date = today.aux_date_view?.full_format;
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
