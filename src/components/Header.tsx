import { useState, useEffect } from "react";

export default function Header({today}) {

  return (
    <div dir="auto">
      <span>امروز : {today}</span>
    </div>
  );

}
