import { useState, useEffect } from "react";


import styled from 'styled-components'
import { Calendar2Week as WeekIcon } from '@styled-icons/bootstrap/Calendar2Week'
import { Target as TargetsIcon } from '@styled-icons/fluentui-system-regular/Target'

import './styles.css'
import { SideButton } from '../constants.ts';

function SidebarButton(props) {
  const { text, activeSideButton, buttonId, onClick } = props;
  const isActive = (buttonId == activeSideButton);
  const classes = isActive ? "sidebar-btn active" : "sidebar-btn";
  return (
    <button className={classes} onClick={() => { onClick(buttonId); }}>
      {props.children}
      <p className="sidebar-btn-text" >{text}</p>
    </button >
  );
}

const WeekIconStyled = styled(WeekIcon)`color: black;`;
const TargetsIconStyled = styled(TargetsIcon)`color: black;`;

export default function SidebarNav(props) {

  return (
    <div className="sidebar">
      <SidebarButton text="This Week" buttonId={SideButton.week} {...props} ><WeekIconStyled className="sidebar-btn-icon week-icon" /></SidebarButton>
      <SidebarButton text="My Targets" buttonId={SideButton.target} {...props} ><TargetsIconStyled className="sidebar-btn-icon" /></SidebarButton>
    </div >
  );

}
