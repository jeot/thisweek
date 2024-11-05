import { Button, Typography } from '@mui/material';
import { useState, useEffect } from "react";
import './styles.css'
import { SettingSection } from '../constants';
import SettingGeneral from './SettingGeneral';
import SettingDisplay from './SettingDisplay';
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
          sx={btnSx} disableElevation disableRipple
          variant={section === SettingSection.General ? "contained" : "outlined"}
          className="settings-navbar-btn"
          onClick={() => setSettingSection(SettingSection.General)}>
          General
        </Button>
        <Button
          sx={btnSx} disableElevation disableRipple
          variant={section === SettingSection.Display ? "contained" : "outlined"}
          className="settings-navbar-btn"
          onClick={() => setSettingSection(SettingSection.Display)}>
          Display
        </Button>
        <Button
          sx={btnSx} disableElevation disableRipple
          variant={section === SettingSection.Keymaps ? "contained" : "outlined"}
          className="settings-navbar-btn"
          onClick={() => setSettingSection(SettingSection.Keymaps)}>
          Keymaps
        </Button>
        <Button
          sx={btnSx} disableElevation disableRipple
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
        {section == SettingSection.Display && <SettingDisplay {...props} />}
        {section == SettingSection.Keymaps && <SettingKeymaps {...props} />}
        {section == SettingSection.About && <SettingAbout {...props} />}
      </div>
    </div >
  );
}
