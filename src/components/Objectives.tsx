import ItemsList from "./ItemsList.tsx";
import ItemsListNavBar from "./ItemsListNavBar.tsx";
import "../prototypes.ts";

import './styles.css'

export default function Objectives(props: any) {
  return (
    <div className="objectives-section">
      <ItemsListNavBar
        title={props.data.title.toPersianDigits()}
        textNext="Next Year"
        textPrevious="Previous Year"
        {...props}
      />
      <ItemsList
        items={props.data.items}
        {...props}
      />
    </div>
  );
}
