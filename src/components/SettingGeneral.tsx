import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { useState, useEffect } from "react";
import './styles.css'
import React from 'react';

export default function SettingGeneral(props) {
  // todo:
  const db_location: string = "Location filepath...";
  const [mainCal, setMainCal] = useState('');
  const [mainCalLang, setMainCalLang] = useState('');

  const handleMainCalendarChange = (event: SelectChangeEvent) => {
    // setMainCal(event.target.value as string);
    setMainCal(event.target.value);
  };

  const handleMainCalendarLanguageChange = (event: SelectChangeEvent) => {
    setMainCalLang(event.target.value);
  };

  return (
    <div className="setting-content-general">
      <Typography variant="h5">General Settings</Typography>
      <Typography variant="h5">&nbsp;</Typography>
      <Typography variant="h5">Database Location</Typography>
      <Typography variant="body2" color="textSecondary">{db_location}</Typography>
      <button>Change Database Location</button>

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
