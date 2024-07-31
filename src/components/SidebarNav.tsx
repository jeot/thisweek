import { useState, useEffect } from "react";

import './styles.css'
import weekIcon from '../assets/icons/icons8-calendar-week7-96.png';
import yearIcon from '../assets/icons/icons8-event-accepted-96.png';

function SidebarButton(props) {
  const { icon, text, active } = props;
  const classes = (active == true) ? "sidebar-btn active" : "sidebar-btn";
  return (
    <button className={classes}>
      <img className="sidebar-btn-icon" src={icon} alt={text} />
      <p className="sidebar-btn-text">{text}</p>
    </button >
  );
}

export default function SidebarNav(props) {
  // const active = props.activePage;
  return (
    <div className="sidebar">
      <SidebarButton icon={weekIcon} text="My Week" active />
      <SidebarButton icon={yearIcon} text="My Year" />
    </div>
  );

}
