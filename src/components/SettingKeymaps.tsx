import { Typography } from '@mui/material';
import './styles.css'

export default function SettingAbout() {

  return (
    <div className="setting-content-about">
      <Typography variant="h5">Keyboard Mappings</Typography>
      <Typography variant="h5">&nbsp;</Typography>
      <Typography variant="h6">Alt + Enter: Toggle Full Screen</Typography>
      <Typography variant="body1" component="p" color="textSecondary">???</Typography>
    </div >
  );
}
