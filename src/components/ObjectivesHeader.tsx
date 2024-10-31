import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import CachedIcon from '@mui/icons-material/Cached';
import { getAuxCalendarView } from '../Globals';

export default function ObjectivesHeader(props: any) {
  if (props.config === undefined) return;
  const { title, textNext, textPrevious, onNext, onPrevious, onSwitchObjectivesCalendar, config } = props;
  const onLeft = config.weekdates_display_direction === "ltr" ? onPrevious : onNext;
  const onRight = config.weekdates_display_direction === "ltr" ? onNext : onPrevious;
  const leftText = config.weekdates_display_direction === "ltr" ? textPrevious : textNext;
  const rightText = config.weekdates_display_direction === "ltr" ? textNext : textPrevious;
  const aux_cal = getAuxCalendarView();

  return (
    <div className="items-list-header">
      <Tooltip title={leftText}>
        <IconButton aria-label={leftText} size="small" color="primary"
          onClick={() => { onLeft(); }}
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

      <Tooltip title={rightText}>
        <IconButton aria-label={rightText} size="small" color="primary"
          onClick={() => { onRight(); }}
        >
          <NavigateNextIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </div>
  );
}
