import { Button, Typography } from '@mui/material';
import { useState, useEffect } from "react";
import './styles.css'
import { SettingSection } from '../constants';
import SettingGeneral from './SettingGeneral';
import SettingKeymaps from './SettingKeymaps';
import SettingAbout from './SettingAbout';
import { getWeekAppVersion } from '../Globals';

export default function SettingsPage(props: any) {

  const [section, setSettingSection] = useState<number>(SettingSection.General);
  const [version, setVersion] = useState<string>("");

  useEffect(() => {
    setVersion(getWeekAppVersion());
  }, []);

  const btnSx = { m: '4px' };

  return (
    <div className="settings-section">
      <div className="settings-navbar">
        <Typography variant="caption" align="center">SETTINGS</Typography>
        <Button
          sx={btnSx}
          variant={section === SettingSection.General ? "contained" : "outlined"}
          className="settings-navbar-btn"
          onClick={() => setSettingSection(SettingSection.General)}>
          General
        </Button>
        <Button
          sx={btnSx}
          variant={section === SettingSection.Keymaps ? "contained" : "outlined"}
          className="settings-navbar-btn"
          onClick={() => setSettingSection(SettingSection.Keymaps)}>
          Keymaps
        </Button>
        <Button
          sx={btnSx}
          variant={section === SettingSection.About ? "contained" : "outlined"}
          className="settings-navbar-btn"
          onClick={() => setSettingSection(SettingSection.About)}>
          About
        </Button>

        <div className="settings-navbar-spacer"></div>
        <Typography variant="caption" align="center">WeeksApp v{version}</Typography>
      </div>
      <div className="settings-content">
        {section == SettingSection.General && <SettingGeneral {...props} />}
        {section == SettingSection.Keymaps && <SettingKeymaps {...props} />}
        {section == SettingSection.About && <SettingAbout {...props} />}
      </div>
    </div >
  );
}
