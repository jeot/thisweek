import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

export default function ItemsListNavBar(props) {
  const { title, textNext, textPrevious, onNext, onPrevious } = props;
  return (
    <div className="week-header">
      <Tooltip title={textNext}>
        <IconButton aria-label="next" size="small" color="text.default"
          onClick={() => { onNext(); }}
        >
          <NavigateNextIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      {title}
      <Tooltip title={textPrevious}>
        <IconButton aria-label="previous" size="small" color="text.default"
          onClick={() => { onPrevious(); }}
        >
          <NavigateBeforeIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </div>
  );
}
