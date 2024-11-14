import { Button, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, Stack, Typography } from '@mui/material';
import { ConfigView } from '../my_types';
import { invoke } from "@tauri-apps/api/tauri";
import { save } from '@tauri-apps/api/dialog';
import './styles.css'


// https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes
const languages = {
  en: { code: 'en', name: 'English', abbr: 'en' },
  fa: { code: 'fa', name: 'Farsi (فارسی)', abbr: 'fa' },
  zh: { code: 'zh', name: 'Chinese (中文)', abbr: 'zh' },
  ar: { code: 'ar', name: 'Arabic (العربية)', abbr: 'ar' },
};

const calendars = [
  { id: 'Gregorian', name: 'Gregorian', defaultDir: 'ltr', defaultStartWeekDay: 'MON', defaultLang: languages.en, allowedLang: [languages.en, languages.fa, languages.zh, languages.ar] },
  { id: 'Persian', name: 'Persian (هجری شمسی)', defaultDir: 'rtl', defaultStartWeekDay: 'SAT', defaultLang: languages.fa, allowedLang: [languages.en, languages.fa] },
  { id: 'Chinese', name: 'Chinese (中国农历)', defaultDir: 'ltr', defaultStartWeekDay: 'MON', defaultLang: languages.zh, allowedLang: [languages.en, languages.zh] },
  { id: 'Arabic', name: 'Arabic (الهجري القمري)', defaultDir: 'rtl', defaultStartWeekDay: 'SUN', defaultLang: languages.ar, allowedLang: [languages.en, languages.ar] },
];


export default function SettingGeneral(props: any) {
  const config: ConfigView = props.config;
  if (config === undefined) return;


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

  const handleMainCalendarChange = (event: SelectChangeEvent) => {
    const mainCal = event.target.value;
    const mainCalLang = calendars.find((cal) => { return (cal.id === mainCal); })?.defaultLang.code;
    const mainCalStartWeekDay = calendars.find((cal) => { return (cal.id === mainCal); })?.defaultStartWeekDay;
    const weekdatesDisplayDir = calendars.find((cal) => { return (cal.id === mainCal); })?.defaultDir;
    props.setMainCalConfig(mainCal, mainCalLang, mainCalStartWeekDay, weekdatesDisplayDir);
  };

  const handleMainCalendarLanguageChange = (event: SelectChangeEvent) => {
    const mainCalLang = event.target.value;
    props.setMainCalConfig(config.main_calendar_type, mainCalLang, config.main_calendar_start_weekday, config.weekdates_display_direction);
  };

  const handleMainCalendarStartWeekdayChange = (event: SelectChangeEvent) => {
    const mainCalStartWeekDay = event.target.value;
    props.setMainCalConfig(config.main_calendar_type, config.main_calendar_language, mainCalStartWeekDay, config.weekdates_display_direction);
  };

  const handleWeekdateDisplayDirectionChange = (_event: React.ChangeEvent, value: string) => {
    // console.log(event, value);
    const weekdatesDisplayDir = value;
    props.setMainCalConfig(config.main_calendar_type, config.main_calendar_language, config.main_calendar_start_weekday, weekdatesDisplayDir);
  }

  const handleSecondaryCalendarChange = (event: SelectChangeEvent) => {
    const secondaryCal = event.target.value == "OFF" ? null : event.target.value;
    const secondaryCalLang = calendars.find((cal) => { return (cal.id === secondaryCal); })?.defaultLang.code;
    props.setSecondaryCalConfig(secondaryCal, secondaryCalLang);
  }

  const handleSecondaryCalendarLanguageChange = (event: SelectChangeEvent) => {
    const secondaryCalLang = event.target.value;
    props.setSecondaryCalConfig(config.secondary_calendar_type, secondaryCalLang);
  }

  return (
    <div className="setting-content-general">
      <Typography variant="h5">Database Location</Typography>
      <Typography variant="body2" color="textSecondary">{config.database}</Typography>
      <Button variant="outlined" size='small' onClick={handleChangeDatabaseLocation}>Switch Database or Change Location</Button>

      <Typography variant="h5">&nbsp;</Typography>
      <Typography variant="h5">Main Calendar</Typography>

      <div className="form-control-group">
        <Stack>
          <FormControl size="small" sx={{ m: 1, minWidth: 180 }}>
            <InputLabel id="main-cal-select-label">Calendar</InputLabel>
            <Select
              labelId="main-cal-select-label"
              id="main-cal-select"
              value={config.main_calendar_type}
              label="Calendar"
              onChange={handleMainCalendarChange}
            >
              {calendars.map((value) => {
                return (<MenuItem key={value.id} value={value.id}>{value.name}</MenuItem>);
              })}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ m: 1, minWidth: 180 }}>
            <InputLabel id="main-cal-lang-select-label">Calendar Language</InputLabel>
            <Select
              labelId="main-cal-lang-select-label" id="main-cal-lang-select"
              value={config.main_calendar_language}
              label="Calendar Language"
              onChange={handleMainCalendarLanguageChange}
            >
              {
                calendars.find((cal) => { return (cal.id == config.main_calendar_type); })?.allowedLang.map((value, _i) => {
                  return (<MenuItem key={value.code} value={value.code}>{value.name}</MenuItem>);
                })
              }
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ m: 1, minWidth: 180 }}>
            <InputLabel id="main-cal-start-weekday-select-label">Start Weekday</InputLabel>
            <Select
              labelId="main-cal-start-weekday-select-label" id="main-cal-start-weekday-select"
              value={config.main_calendar_start_weekday}
              label="Start Weekday"
              onChange={handleMainCalendarStartWeekdayChange}
            >
              <MenuItem value="SAT">Saturday</MenuItem>
              <MenuItem value="SUN">Sunday</MenuItem>
              <MenuItem value="MON">Monday</MenuItem>
              <MenuItem value="TUE">Tuesday</MenuItem>
              <MenuItem value="WED">Wednesday</MenuItem>
              <MenuItem value="THU">Thursday</MenuItem>
              <MenuItem value="FRI">Friday</MenuItem>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel id="weekdatesdirection-radio-buttons-group-label">Week Dates Display Direction</FormLabel>
            <RadioGroup
              row
              aria-labelledby="weekdatesdirection-radio-buttons-group-label"
              defaultValue="ltr"
              value={config.weekdates_display_direction}
              name="weekdatesdirection-radio-buttons-group"
              onChange={handleWeekdateDisplayDirectionChange}
            >
              <FormControlLabel value="ltr" control={<Radio />} label="Left to Right" />
              <FormControlLabel value="rtl" control={<Radio />} label="Right to Left" />
            </RadioGroup>
          </FormControl>
        </Stack>
      </div>

      <Typography variant="h5">&nbsp;</Typography>
      <Typography variant="h5">Secondary Calendar</Typography>

      <div className="form-control-group">
        <FormControl size="small" sx={{ m: 1, minWidth: 180 }}>
          <InputLabel id="secondary-cal-select-label">Calendar</InputLabel>
          <Select
            labelId="secondary-cal-select-label"
            id="secondary-cal-select"
            value={config.secondary_calendar_type ?? "OFF"}
            label="Calendar"
            onChange={handleSecondaryCalendarChange}
          >
            <MenuItem key="OFF" value="OFF">OFF</MenuItem>
            {calendars.map((value) => {
              return (<MenuItem key={value.id} value={value.id}>{value.name}</MenuItem>);
            })}
          </Select>
        </FormControl>

        {config.secondary_calendar_type &&
          <FormControl size="small" sx={{ m: 1, minWidth: 180 }}>
            <InputLabel id="secondary-cal-lang-select-label">Calendar Language</InputLabel>
            <Select
              labelId="secondary-cal-lang-select-label" id="secondary-cal-lang-select"
              value={config.secondary_calendar_language ?? "en"}
              label="Calendar Language"
              onChange={handleSecondaryCalendarLanguageChange}
            >
              {
                calendars.find((cal) => { return (cal.id == config.secondary_calendar_type); })?.allowedLang.map((value, _i) => {
                  return (<MenuItem key={value.code} value={value.code}>{value.name}</MenuItem>);
                })
              }
            </Select>
          </FormControl>
        }
      </div>
    </div>
  );
}
