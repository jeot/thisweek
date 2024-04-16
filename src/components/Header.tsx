import { useState, useEffect } from "react";
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

export default function Header({today_persian_date, today_english_date}) {

  const style = {
    fontSize: "0.9em",
    fontWeight: 300,
    backgroundColor: 'black',
    color: 'white',
    px: 1,
    pb: 0.3,
    pt: 0.5,
  };

  return (
  <Stack
    direction="row"
    alignItems="center"
    justifyContent="space-between"
    sx={style}
  >
    <Box dir="auto">
      Today, {today_english_date}
    </Box>
    <Box dir="auto">
      امروز، {today_persian_date.toPersianDigits()}
    </Box>
  </Stack>
  );

}
