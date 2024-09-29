import { Typography } from '@mui/material';
import { useState, useEffect } from "react";
import './styles.css'
import { SettingSection } from '../constants';
import SettingGeneral from './SettingGeneral';
import SettingAbout from './SettingAbout';
import { getWeekAppVersion } from '../Globals';
import { invoke } from "@tauri-apps/api/tauri";
import { ConfigView } from '../my_types';

export default function SettingsPage(props: any) {

  const [section, setSettingSection] = useState<number>(SettingSection.General);
  const [version, setVersion] = useState<string>("");
  const [config, setConfig] = useState<ConfigView>();

  const reloadConfig = () => {
    invoke("get_config").then((result: any) => {
      console.log("get config: ", result);
      setConfig(result);
    });
  }

  useEffect(() => {
    setVersion(getWeekAppVersion());
    reloadConfig();
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
        {section == SettingSection.General && <SettingGeneral config={config} reloadConfig={reloadConfig} />}
        {section == SettingSection.About && <SettingAbout {...props} />}
      </div>
    </div>
  );
}
