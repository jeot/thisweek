import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CachedIcon from '@mui/icons-material/Cached';
import { getAuxCalendarView } from '../Globals';

export default function YearsHeaderContent(props: any) {
  const aux_cal = getAuxCalendarView();
  return (
    <div>
      {aux_cal &&
        <Tooltip title="Change Calendar">
          <IconButton aria-label="change" size="small" color="secondary"
            onClick={() => { props.onSwitchYearCalendar(); }}
          >
            <CachedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      }

      {props.title}
    </div>
  );
}
