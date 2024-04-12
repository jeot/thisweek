import { useState, useEffect } from "react";

export default function Header({today}) {


  const style =
    {
      fontSize: "0.9em",
      fontWeight: 300,
    };
  return (
    <div dir="auto" style={style}>
      <span>امروز : {today}</span>
    </div>
  );

}
