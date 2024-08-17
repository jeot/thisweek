import Box from '@mui/material/Box';
import './styles.css';
import '../utilities.tsx';

export default function Header({ today_persian_date, today_english_date }: { today_persian_date: string, today_english_date: string }) {
  const en_date = today_english_date ?? "undefined en date!";
  let fa_date = today_persian_date?.toPersianDigits();
  fa_date ??= "undefined fa date!";
  // console.log(en_date, fa_date);
  return (
    <div className="header">
      <Box className="" dir="auto">
        Today, {en_date}
      </Box>
      <Box className="" dir="auto">
        امروز، {fa_date}
      </Box>
    </div>
  );

}
