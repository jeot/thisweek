import styled from 'styled-components'
import { Calendar2Week as WeekIcon } from '@styled-icons/bootstrap/Calendar2Week'
import { Target as TargetsIcon } from '@styled-icons/fluentui-system-regular/Target'
import { Settings as SettingsIcon } from '@styled-icons/fluentui-system-regular/Settings'

import './styles.css'
import { Page } from '../constants.ts';

type CallbackFunction = (buttonId: number) => void;
interface FullProps { text: string, activePage: number, buttonId: number, onClick: CallbackFunction, children: any }

function SidebarButton(props: FullProps) {
  const { text, activePage, buttonId, onClick } = props;
  const isActive = (buttonId == activePage);
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
const SettingsIconStyled = styled(SettingsIcon)`color: black;`;

interface HalfProps { activePage: number, onClick: CallbackFunction, children?: any }

export default function SidebarNav(props: HalfProps) {

  return (
    <div className="sidebar">
      <SidebarButton text="Weeks" buttonId={Page.weeks} {...props} ><WeekIconStyled className="sidebar-btn-icon week-icon" /></SidebarButton>
      <SidebarButton text="Objectives" buttonId={Page.objectives} {...props} ><TargetsIconStyled className="sidebar-btn-icon" /></SidebarButton>
      <div className="sidebar-spacer">&nbsp;</div>
      <SidebarButton text="Settings" buttonId={Page.settings} {...props} ><SettingsIconStyled className="sidebar-btn-icon" /></SidebarButton>
    </div >
  );

}
