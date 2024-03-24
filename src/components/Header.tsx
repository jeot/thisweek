import { useState } from "react";

export default function Header({today}) {

  return (
    <div className="header">
      <span dir="auto">امروز : {today}</span>
    </div>
  );

}
