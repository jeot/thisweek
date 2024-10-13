import { Button, Typography } from '@mui/material';
import { getWeekAppVersion } from '../Globals';
import { open } from '@tauri-apps/api/shell';
import './styles.css'

const openLandingPage = () => {
  open("https://www.google.com/")
}
const openGithubPage = () => {
  open("https://www.github.com/")
}

export default function SettingAbout() {
  const appVersion = getWeekAppVersion();

  return (
    <div className="settings-content-about">
      <Typography variant="h5">&nbsp;</Typography>
      <Typography variant="h4" align="center"> <em>New Week</em> </Typography>
      <Typography variant="body2" align="center" color="textSecondary">
        v{appVersion} -
        <Button variant='text' color='info' onClick={() => openGithubPage()} >Source Code</Button>
      </Typography>
      <Typography variant="h5">&nbsp;</Typography>
      <Typography variant="body1" align="center" textAlign='left' component="p" color='gray'>
        The story starts with you. It ends with you.<br />
        You take the steps that need to be taken.<br />
        Some days, it flows; other days, you stumble.<br />
        But every time you fall, you rise again.<br />
        And with each new week, you begin again — stronger.<br />
      </Typography>
      <Typography variant="h5">&nbsp;</Typography>
      <Button variant='text' color='info' onClick={() => openLandingPage()} >Go to the website</Button>
    </div >
  );
}
