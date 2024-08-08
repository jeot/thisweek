import Box from '@mui/material/Box';
import './styles.css';
import '../utilities.tsx';

export default function Header({ today_persian_date, today_english_date }: { today_persian_date: string, today_english_date: string }) {

  return (
    <div className="header">
      <Box className="" dir="auto">
        Today, {today_english_date}
      </Box>
      <Box className="" dir="auto">
        امروز، {today_persian_date.toPersianDigits()}
      </Box>
    </div>
  );

}
