import * as React from 'react';
import { useEffect, useState } from "react";
import { Popover, Typography } from "@mui/material";
import './styles.css';
import { CalendarPriorityType, ObjectiveType } from '../constants';
import { getObjectiveTypeFromFields, toPersianDigits } from "../utilities.ts"
import * as Globals from "./../Globals.ts"

export default function ObjectivesPopover(props: any) {
  // console.log("props of ObjectivesPopover:", props);
  if (props.objective_tag === null || props.objective_tag === undefined)
    return;
  // const currentObjectiveType = getObjectiveTypeFromFields(props.year, props.season, props.month);
  // if (currentObjectiveType == ObjectiveType.none) {
  //   return (<></>);
  // }
  const { onChange, objective_tag } = props;
  const { calendar, text, type, calendar_name, language, year_string, year, season, month } = objective_tag;

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  let calInUse: null | number = null;
  if (calendar == Globals.getMainCalendarView().calendar) calInUse = CalendarPriorityType.main;
  if (calendar == Globals.getAuxCalendarView()?.calendar) calInUse = CalendarPriorityType.secondary;

  const seasons_names = calInUse == CalendarPriorityType.main ? Globals.getMainCalendarView().seasons_names : Globals.getAuxCalendarView()?.seasons_names;
  const months_names = calInUse == CalendarPriorityType.main ? Globals.getMainCalendarView().months_names : Globals.getAuxCalendarView()?.months_names;
  const direction = calInUse == CalendarPriorityType.main ? Globals.getMainCalendarView().direction : Globals.getAuxCalendarView()?.direction;
  console.log(direction);
  // const lang = calInUse == CalendarPriorityType.main ? Globals.getMainCalendarView().language : Globals.getAuxCalendarView()?.language;
  // const direction = calInUse == CalendarPriorityType.main ? Globals.getMainCalendarView().direction : Globals.getAuxCalendarView()?.direction;
  // const main_cal_name = Globals.getMainCalendarView().calendar_name;
  // const aux_cal_name = Globals.getAuxCalendarView()?.calendar_name ?? "Error! NO CAL";
  // const cal_name = calInUse == CalendarPriorityType.main ? main_cal_name : aux_cal_name;

  const handleOnChange = function(year: number, season: number | null, month: number | null) {
    onChange(year, season, month);
    setAnchorEl(null);
  }

  const createObjectiveTagsElement = function(string_array: Array<string>, tagStyle: string, year: number, selectedIndex: number, objectiveTypeId: number) {
    return (
      <div className="objective-popover-section">
        {
          string_array.map((name: string, i: number) => {
            if (i == 0) return;
            let classStyle = tagStyle + " objective-tag-btn objective-popover-tag";
            if (i == selectedIndex) classStyle = classStyle + " objective-popover-tag-selected";
            const season = objectiveTypeId == ObjectiveType.seasonal ? i : null;
            const month = objectiveTypeId == ObjectiveType.monthly ? i : null;
            return (
              <button
                key={name}
                className={classStyle}
                onClick={() => { handleOnChange(year, season, month); }}>
                <Typography variant="caption" noWrap>{name}</Typography>
              </button>);
          })
        }
      </div >
    );
  }

  const PopoverContent = function(props: any) {
    const { calendar, text, type, calendar_name, language, year_string, year, season, month } = props.objective_tag;
    // const direction = language ==  ? "rtl" : "ltr";
    // console.log(year, season, month, calendar, language, direction);
    let yearStyle = "objective-tag-btn objective-year-tag objective-popover-tag";
    const month_index = month ?? 0;
    const season_index = season ?? 0;
    if (month_index == 0 && season_index == 0) yearStyle = yearStyle + " objective-popover-tag-selected";
    return (
      <div className="objective-popover" dir={direction}>
        <div className="objective-popover-section">
          <button
            className={yearStyle}
            onClick={() => { handleOnChange(year, null, null); }}
          >
            <Typography variant="caption" noWrap>{year_string}</Typography>
          </button>
        </div>
        {createObjectiveTagsElement(seasons_names, "objective-season-tag", year, season_index, ObjectiveType.seasonal)}
        {createObjectiveTagsElement(months_names, "objective-month-tag flex-break-three-element", year, month_index, ObjectiveType.monthly)}
      </div>
    );

  }

  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (calInUse === null)
      return;
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  let style: string = "";
  if (type == ObjectiveType.monthly) style = "objective-tag-btn objective-month-tag";
  if (type == ObjectiveType.seasonal) style = "objective-tag-btn objective-season-tag";
  if (type == ObjectiveType.yearly) style = "objective-tag-btn objective-year-tag";

  const open = Boolean(anchorEl);
  const popoverId = open ? 'objective-time-period-selection-popover' : undefined;

  return (
    <div className="objective-time-period-selection">
      <button className={style} onClick={handleOpenPopover}>
        <Typography variant="caption" noWrap>{text}</Typography>
      </button>
      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <div className="objective-popover-calendar-title" dir={direction}>
          <Typography variant="caption">{calendar_name}</Typography>
        </div>
        <PopoverContent objective_tag={objective_tag} />
      </Popover>
    </div>
  );

}
