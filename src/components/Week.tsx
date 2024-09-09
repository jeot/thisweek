import ItemsList from "./ItemsList.tsx";
// import ItemsListNavBar from "./ItemsListNavBar.tsx";
import WeekHeader from "./WeekHeader.tsx";
import "../prototypes.ts";

import './styles.css'

export default function Week(props: any) {
  return (
    <div className="week-section">
      <WeekHeader
        title={props.data.title.toPersianDigits()}
        textNext="Next Week"
        textPrevious="Previous Week"
        {...props}
      />
      <ItemsList
        items={props.data.items}
        {...props}
      />
    </div>
  );
}
