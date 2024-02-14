import { useState } from "react";
import "./Header.css";

export default function Header({today}) {

  return (
    <div className="header">
      <span dir="auto">امروز : {today}</span>
    </div>
  );

}
