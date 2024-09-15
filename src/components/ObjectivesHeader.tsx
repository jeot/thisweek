import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import CachedIcon from '@mui/icons-material/Cached';
import { getAuxCalendarView } from '../Globals';

export default function ObjectivesHeader(props: any) {
  const { title, textNext, textPrevious, onNext, onPrevious, onSwitchObjectivesCalendar } = props;
  const aux_cal = getAuxCalendarView();
  return (
    <div className="items-list-header">
      <Tooltip title={textPrevious}>
        <IconButton aria-label="previous" size="small" color="primary"
          onClick={() => { onPrevious(); }}
        >
          <NavigateBeforeIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <div>
        {aux_cal &&
          <Tooltip title="Change Calendar">
            <IconButton aria-label="change" size="small" color="secondary"
              onClick={() => { onSwitchObjectivesCalendar(); }}
            >
              <CachedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }

        {title}
      </div>

      <Tooltip title={textNext}>
        <IconButton aria-label="next" size="small" color="primary"
          onClick={() => { onNext(); }}
        >
          <NavigateNextIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </div>
  );
}
