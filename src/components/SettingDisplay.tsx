import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { ConfigView } from '../my_types';
import './styles.css'


export default function SettingDisplay(props: any) {
  const config: ConfigView = props.config;
  if (config === undefined) return;

  const handleItemDisplayDirectionChange = (_event: React.ChangeEvent, value: string) => {
    props.setItemsDisplayDirectionConfig(value);
  }

  return (
    <div className="setting-content-general">
      <Typography variant="h5">Items Display Direction</Typography>

      <div className="form-control-group">
        <FormControl>
          <FormLabel id="items-direction-radio-buttons-group-label">Items (Goals/Notes) Display Direction</FormLabel>
          <RadioGroup
            row
            aria-labelledby="items-direction-radio-buttons-group-label"
            defaultValue="auto"
            value={config.items_display_direction}
            name="items-direction-radio-buttons-group-label"
            onChange={handleItemDisplayDirectionChange}
          >
            <FormControlLabel value="ltr" control={<Radio />} label="Left to Right" />
            <FormControlLabel value="auto" control={<Radio />} label="Auto" />
            <FormControlLabel value="rtl" control={<Radio />} label="Right to Left" />
          </RadioGroup>
        </FormControl>
      </div>

    </div>
  );
}
