import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { useState, useEffect } from "react";
import { ConfigView } from '../my_types';
import { invoke } from "@tauri-apps/api/tauri";
// import { open } from '@tauri-apps/api/dialog';
import { save } from '@tauri-apps/api/dialog';
import './styles.css'

export default function SettingGeneral(props: any) {
  const config: ConfigView = props.config;
  if (config === undefined) return;

  const [mainCal, setMainCal] = useState('');
  const [mainCalLang, setMainCalLang] = useState('');

  const handleMainCalendarChange = (event: SelectChangeEvent) => {
    // setMainCal(event.target.value as string);
    setMainCal(event.target.value);
  };

  const handleMainCalendarLanguageChange = (event: SelectChangeEvent) => {
    setMainCalLang(event.target.value);
  };

  const handleChangeDatabaseLocation = () => {
    save({
      defaultPath: config.database,
      title: "File for WeeksApp Database",
      filters: [{
        name: 'WeeksApp Database',
        extensions: ['db']
      }]
    }).then((filepath) => {
      if (filepath !== null) {
        console.log("chosen database filepath", filepath);
        invoke("set_database_file", { filepath: filepath }).then((result: any) => {
          console.log("set_database_filepath ", result);
        });
      }
      props.reloadConfig();
    });
  }

  return (
    <div className="setting-content-general">
      <Typography variant="h5">General Settings</Typography>
      <Typography variant="h5">&nbsp;</Typography>
      <Typography variant="h5">Database Location</Typography>
      <Typography variant="body2" color="textSecondary">{config.database}</Typography>
      <button onClick={handleChangeDatabaseLocation}>Change Database Location</button>

      <Typography variant="h5">&nbsp;</Typography>
      <Typography variant="h5">Main Calendar</Typography>
      <FormControl sx={{ m: 1, minWidth: 180 }} size="small">
        <InputLabel id="main-cal-select-label">Main Calendar</InputLabel>
        <Select
          labelId="main-cal-select-label"
          id="main-cal-select"
          value={mainCal}
          label="Main Calendar"
          onChange={handleMainCalendarChange}
        >
          <MenuItem value={0}>Gregorian</MenuItem>
          <MenuItem value={1}>Persian</MenuItem>
          <MenuItem value={2}>Chinese</MenuItem>
          <MenuItem value={3}>Arabic</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, minWidth: 180 }} size="small">
        <InputLabel id="main-cal-lang-select-label">Calendar Language</InputLabel>
        <Select
          labelId="main-cal-lang-select-label"
          id="main-cal-lang-select"
          value={mainCalLang}
          label="Calendar Language"
          onChange={handleMainCalendarLanguageChange}
        >
          <MenuItem value={0}>English</MenuItem>
          <MenuItem value={1}>Farsi</MenuItem>
          <MenuItem value={2}>Chinese</MenuItem>
          <MenuItem value={3}>Arabic</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
