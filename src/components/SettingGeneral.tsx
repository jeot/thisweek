import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { useState } from "react";
import { ConfigView } from '../my_types';
import { invoke } from "@tauri-apps/api/tauri";
import { save } from '@tauri-apps/api/dialog';
import './styles.css'

export default function SettingGeneral(props: any) {
  const config: ConfigView = props.config;
  if (config === undefined) return;

  // const [mainCal, setMainCal] = useState(config.main_calendar_type);
  // const [mainCalLang, setMainCalLang] = useState(config.main_calendar_language);

  const handleMainCalendarChange = (event: SelectChangeEvent) => {
    // setMainCal(event.target.value as string);
    // setMainCal(event.target.value);
  };

  const handleMainCalendarLanguageChange = (event: SelectChangeEvent) => {
    // setMainCalLang(event.target.value);
  };

  const handleMainCalendarStartWeekdayChange = (event: SelectChangeEvent) => {
  };

  const handleChangeDatabaseLocation = () => {
    save({
      defaultPath: config.database,
      title: "Choose a WeeksApp Database or a new Location...",
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
          value={config.main_calendar_type}
          label="Main Calendar"
          onChange={handleMainCalendarChange}
        >
          <MenuItem value="Gregorian">Gregorian</MenuItem>
          <MenuItem value="Persian">Persian</MenuItem>
          <MenuItem value="Chinese">Chinese</MenuItem>
          <MenuItem value="Arabic">Arabic</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, minWidth: 180 }} size="small">
        <InputLabel id="main-cal-lang-select-label">Calendar Language</InputLabel>
        <Select
          labelId="main-cal-lang-select-label" id="main-cal-lang-select"
          value={config.main_calendar_language}
          label="Calendar Language"
          onChange={handleMainCalendarLanguageChange}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="fa">Farsi</MenuItem>
          <MenuItem value="cn">Chinese</MenuItem>
          <MenuItem value="ar">Arabic</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, minWidth: 180 }} size="small">
        <InputLabel id="main-cal-start-weekday-select-label">Start Weekday</InputLabel>
        <Select
          labelId="main-cal-start-weekday-select-label" id="main-cal-start-weekday-select"
          value={config.main_calendar_start_weekday}
          label="Start Weekday"
          onChange={handleMainCalendarStartWeekdayChange}
        >
          <MenuItem value="SAT">SAT</MenuItem>
          <MenuItem value="SUN">SUN</MenuItem>
          <MenuItem value="MON">MON</MenuItem>
          <MenuItem value="TUE">TUE</MenuItem>
          <MenuItem value="WED">WED</MenuItem>
          <MenuItem value="THU">THU</MenuItem>
          <MenuItem value="FRI">FRI</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
