import { useState, useEffect } from "react";
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import './styles.css';

export default function Header({ today_persian_date, today_english_date }) {

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
