import { Typography } from '@mui/material';
import './styles.css'
import { KEYMAPS } from '../Keymaps';

export default function SettingAbout() {

  return (
    <div className="setting-content-about">
      <Typography variant="h5">Keyboard Mappings</Typography>
      <Typography variant="h5">&nbsp;</Typography>
      {
        KEYMAPS.map((item) => {
          const key = item.keys;
          const mod = item.mod;
          const left_str = `${mod} ${mod ? '+' : ''} ${key} : `
          const right_str = `${item.desc}`;
          return (
            <div>
              <Typography variant="body1" component="span" color="InfoText">{left_str}</Typography>
              <Typography variant="body1" component="span" color="textSecondary">{right_str}</Typography>
            </div>
          );
        })
      }
    </div >
  );
}
