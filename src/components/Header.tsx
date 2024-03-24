import { useState } from "react";

export default function Header({today}) {

  return (
    <div dir="auto" className="header">
      <span>امروز : {today}</span>
    </div>
  );

}
