import * as React from 'react';
import { useEffect, useState } from "react";
import { Popover, Typography } from "@mui/material";
import './styles.css';
import { CalendarPriorityType, ObjectiveType } from '../constants';
import { getObjectiveTypeFromFields, toPersianDigits } from "../utilities.ts"
import * as Globals from "./../Globals.ts"

export default function ObjectivesPopover(props: any) {

  // console.log("props of ObjectivesPopover:", props);
  const currentObjectiveType = getObjectiveTypeFromFields(props.year, props.season, props.month);
  if (currentObjectiveType == ObjectiveType.none) {
    return (<></>);
  }

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [calInUse, setCalInUse] = useState<number>(CalendarPriorityType.main);

  useEffect(() => {

  }, [calInUse]);



  const seasons_names = calInUse == CalendarPriorityType.main ? Globals.getMainCalendarView().seasons_names : Globals.getAuxCalendarView()?.seasons_names;
  const months_names = calInUse == CalendarPriorityType.main ? Globals.getMainCalendarView().months_names : Globals.getAuxCalendarView()?.months_names;
  const lang = calInUse == CalendarPriorityType.main ? Globals.getMainCalendarView().language : Globals.getAuxCalendarView()?.language;
  const direction = calInUse == CalendarPriorityType.main ? Globals.getMainCalendarView().direction : Globals.getAuxCalendarView()?.direction;
  const main_cal_name = Globals.getMainCalendarView().calendar_name;
  const aux_cal_name = Globals.getAuxCalendarView()?.calendar_name ?? null;

  const getTagStyleText = function(yearIndex: number, seasonIndex: number, monthIndex: number) {
    yearIndex = yearIndex ?? 0;
    seasonIndex = seasonIndex ?? 0;
    monthIndex = monthIndex ?? 0;
    let year: string = yearIndex.toString() ?? "";
    let season: string = seasons_names[seasonIndex];
    let month: string = months_names[monthIndex];
    let text: string = "";
    let style: string = "";
    if (yearIndex && monthIndex) {
      text = `${month}\xa0${year}`;
      style = "objective-tag-btn objective-month-tag"
    } else if (yearIndex && seasonIndex) {
      text = `${season}\xa0${year}`;
      style = "objective-tag-btn objective-season-tag"
    } else if (yearIndex) {
      text = `${year}`;
      style = "objective-tag-btn objective-year-tag"
    } else {
      text = "error!"
    }
    text = toPersianDigits(text);
    return { style, text };
  }

  const handleOnChange = function(year: number, season: number | null, month: number | null) {
    props.onChange(year, season, month);
    setAnchorEl(null);
  }

  const createObjectiveTagsElement = function(string_array: Array<string>, tagStyle: string, year: number, selectedIndex: number, objectiveTypeId: number) {
    return (
      <div className="objective-popover-section">
        {
          string_array.map((name: string, i: number) => {
            if (i == 0) return;
            let classStyle = "";
            if (i == selectedIndex) classStyle = `objective-popover-tag objective-popover-tag-selected ${tagStyle}`;
            else classStyle = `objective-popover-tag ${tagStyle}`;
            const season = objectiveTypeId == ObjectiveType.seasonal ? i : null;
            const month = objectiveTypeId == ObjectiveType.monthly ? i : null;
            return (
              <button
                key={name}
                className={classStyle}
                onClick={() => { handleOnChange(year, season, month); }}>
                <Typography variant="caption">{name}</Typography>
              </button>);
          })
        }
      </div >
    );
  }

  const PopoverContent = function(props: any) {
    let { year, season, month } = props;
    year = year ?? 0;
    season = season ?? 0;
    month = month ?? 0;
    // console.log({ year, season, month });
    let yearStyle = "";
    if (month == 0 && season == 0) yearStyle = "objective-tag-btn objective-year-tag objective-popover-tag objective-popover-tag-selected";
    else yearStyle = "objective-tag-btn objective-year-tag objective-popover-tag";
    return (
      <div className="objective-popover" dir={direction}>
        <div className="objective-popover-section">
          <button
            className={yearStyle}
            onClick={() => { handleOnChange(year, null, null); }}
          >
            <Typography variant="caption">{year}</Typography>
          </button>
        </div>
        {createObjectiveTagsElement(seasons_names, "objective-tag-btn objective-season-tag objective-popover-tag", year, season, ObjectiveType.seasonal)}
        {createObjectiveTagsElement(months_names, "objective-tag-btn objective-month-tag objective-popover-tag flex-break-three-element", year, month, ObjectiveType.monthly)}
      </div>
    );

  }

  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? 'objective-time-period-selection-popover' : undefined;
  const { style, text } = getTagStyleText(props.year, props.season, props.month);

  return (
    <div className="objective-time-period-selection">
      <button className={style} onClick={handleOpenPopover}><Typography variant="caption">{text}</Typography></button>
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
        <button onClick={() => setCalInUse(CalendarPriorityType.main)}>{main_cal_name}</button>
        <button onClick={() => setCalInUse(CalendarPriorityType.secondary)}>{aux_cal_name}</button>
        <PopoverContent {...props} />
      </Popover>
    </div>
  );

}
