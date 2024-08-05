import ItemsList from "./ItemsList.tsx";
import ItemsListNavBar from "./ItemsListNavBar.tsx";
import "../utilities.tsx";

import './styles.css'

export default function Week(props) {
  return (
    <div className="week-section">
      <ItemsListNavBar
        title={props.weekState.week_title.toPersianDigits()}
        textNext="Next Week"
        textPrevious="Previous Week"
        {...props}
      />
      <ItemsList
        items={props.weekState.items}
        {...props}
      />
    </div>
  );
}
