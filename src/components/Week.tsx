import ItemsList from "./ItemsList.tsx";
import ItemsListNavBar from "./ItemsListNavBar.tsx";
import "../utilities.tsx";

import './styles.css'

export default function Week(props: any) {
  return (
    <div className="week-section">
      <ItemsListNavBar
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
