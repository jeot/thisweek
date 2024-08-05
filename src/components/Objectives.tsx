import ItemsList from "./ItemsList.tsx";
import ItemsListNavBar from "./ItemsListNavBar.tsx";
import "../utilities.tsx";

import './styles.css'

export default function Objectives(props) {
  return (
    <div className="objectives-section">
      <ItemsListNavBar
        title={props.objectivesState.title.toPersianDigits()}
        textNext="Next Year"
        textPrevious="Previous Year"
        {...props}
      />
      <ItemsList
        items={props.objectivesState.items}
        {...props}
      />
    </div>
  );
}
