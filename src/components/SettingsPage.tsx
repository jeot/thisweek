import { Typography } from '@mui/material';
import { useState, useEffect } from "react";
import './styles.css'
import { SettingSection } from '../constants';
import SettingGeneral from './SettingGeneral';
import SettingAbout from './SettingAbout';
import { getWeekAppVersion } from '../Globals';

export default function SettingsPage(props: any) {

  const [section, setSettingSection] = useState<number>(SettingSection.General);
  const [version, setVersion] = useState<string>("");

  useEffect(() => {
    setVersion(getWeekAppVersion());
  }, []);

  return (
    <div className="settings-section">
      <div className="settings-navbar">
        <Typography variant="caption" align="center">SETTINGS</Typography>
        <button className="settings-navbar-btn" onClick={() => setSettingSection(SettingSection.General)}>General</button>
        <button className="settings-navbar-btn" onClick={() => setSettingSection(SettingSection.About)}>About</button>
        <div className="settings-navbar-spacer"></div>
        <Typography variant="caption" align="center">WeeksApp v{version}</Typography>
      </div>
      <div className="settings-content">
        {section == SettingSection.General && <SettingGeneral {...props} />}
        {section == SettingSection.About && <SettingAbout {...props} />}
      </div>
    </div>
  );
}
