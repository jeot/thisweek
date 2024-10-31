import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import WeekDates from './WeekDates.tsx';

export default function WeekHeader(props: any) {
  if (props.config === undefined) return;
  const { textNext, textPrevious, onNext, onPrevious, config } = props;
  const onLeft = config.weekdates_display_direction === "ltr" ? onPrevious : onNext;
  const onRight = config.weekdates_display_direction === "ltr" ? onNext : onPrevious;
  const leftText = config.weekdates_display_direction === "ltr" ? textPrevious : textNext;
  const rightText = config.weekdates_display_direction === "ltr" ? textNext : textPrevious;

  return (
    <div className="week-header">
      <Tooltip title={leftText}>
        <IconButton aria-label={leftText} size="small" color="primary"
          onClick={() => { onLeft(); }}
        >
          <NavigateBeforeIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <WeekDates {...props} />


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
