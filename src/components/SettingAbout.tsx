import { Typography } from '@mui/material';
import { useState, useEffect } from "react";
import { getWeekAppVersion } from '../Globals';
import './styles.css'

export default function SettingAbout(props) {
  const appVersion = getWeekAppVersion();

  return (
    <div className="setting-content-about">
      <Typography variant="h5">About</Typography>
      <Typography variant="h5">&nbsp;</Typography>
      <Typography variant="h4" align="center"> <em>WeeksApp</em> </Typography>
      <Typography variant="body2" align="center" color="textSecondary">
        v{appVersion} - <a href="to github page">Source Code</a>
      </Typography>
      <Typography variant="h5">&nbsp;</Typography>
      <Typography variant="h5">The Story</Typography>
      <Typography variant="body1" component="p" color="textSecondary" className="story">
        I found myself lost in confusion. Each day felt meaningless, as time slipped by without purpose or direction. I lacked the motivation to do anything, unsure of not only what I should do but also why I should even try. <a href="google.com">Continue reading the story...</a></Typography>

      {/*
      <p>It was August 2022, and I found myself lost in confusion. Each day felt meaningless, as time slipped by without purpose or direction. I lacked the motivation to do anything, unsure of not only what I should do but also why I should even try. This is the story of why did I created WeeksApp. <a href="google.com">Learn More...</a></p>
      */}
    </div >
  );
}
