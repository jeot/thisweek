import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

export default function WeekYearHeader(props: any) {
  const { textNext, textPrevious, onNext, onPrevious } = props;

  return (
    <div className="week-year-header">
      <Tooltip title={textPrevious}>
        <IconButton aria-label={textPrevious} size="small" color="primary" onClick={() => { onPrevious(); }} >
          <NavigateBeforeIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {props.children}

      <Tooltip title={textNext}>
        <IconButton aria-label={textNext} size="small" color="primary" onClick={() => { onNext(); }} >
          <NavigateNextIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </div>
  );
}
