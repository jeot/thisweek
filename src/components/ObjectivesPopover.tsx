import * as React from 'react';
import { useState } from "react";
import { Popover, Typography } from "@mui/material";
import './styles.css';
import { ObjectiveType } from '../constants';
import { toPersianDigits } from "../utilities.ts"

export default function ObjectivesPopover(props: { year: number, month: number, season: number, onChange: any }) {

  const currentObjectiveType = props.month ? ObjectiveType.monthly
    : props.season ? ObjectiveType.seasonal
      : props.year ? ObjectiveType.yearly : ObjectiveType.none;
  if (currentObjectiveType == ObjectiveType.none) {
    return (<></>);
  }

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const seasons_names = ["", "بهار", "تابستان", "پاییز", "زمستان"];
  const months_names = ["", "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];

  const getTagStyleText = function(yearIndex: number, seasonIndex: number, monthIndex: number) {
    yearIndex = yearIndex ?? 0;
    seasonIndex = seasonIndex ?? 0;
    monthIndex = monthIndex ?? 0;
    let year: string = yearIndex.toString() ?? "";
    // const seasons = ["", "بهار", "تابستان", "پاییز", "زمستان"];
    // const months = ["", "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
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
      <div className="objective-popover" dir="rtl">
        <div className="objective-popover-section">
          <button
            className={yearStyle}
            onClick={() => { handleOnChange(year, null, null); }}
          >
            <Typography variant="caption">{toPersianDigits(year.toString())}</Typography>
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
        <PopoverContent {...props} />
      </Popover>
    </div>
  );

}
