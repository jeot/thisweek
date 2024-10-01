import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import WeekDates from './WeekDates.tsx';

export default function WeekHeader(props: any) {
  const { textNext, textPrevious, onNext, onPrevious } = props;
  return (
    <div className="week-header">
      <Tooltip title={textPrevious}>
        <IconButton aria-label="previous" size="small" color="primary"
          onClick={() => { onPrevious(); }}
        >
          <NavigateBeforeIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <WeekDates {...props} />


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
