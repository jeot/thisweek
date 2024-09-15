import ItemsList from "./ItemsList.tsx";
import ObjectivesHeader from "./ObjectivesHeader.tsx";
import "../prototypes.ts";

import './styles.css'

export default function Objectives(props: any) {
  return (
    <div className="objectives-section">
      <ObjectivesHeader
        title={props.data.title}
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
