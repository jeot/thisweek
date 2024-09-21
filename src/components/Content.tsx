import WeekHeader from "./WeekHeader.tsx";
import ObjectivesHeader from "./ObjectivesHeader.tsx";
import NewItem from "./NewItem.tsx";
import BasicSpeedDial from "./BasicSpeedDial.tsx";
import ItemsList from "./ItemsList.tsx";

import "../prototypes.ts";
import { ID, Page } from "../constants.ts";
import './styles.css'

export default function Content(props: any) {
  const { page, editingId, newItemKind, onNewAction, onNewSubmit, onEditSubmit, onCancel } = props;
  return (
    <div className="content-section">
      {page == Page.weeks &&
        <WeekHeader
          textNext="Next Week"
          textPrevious="Previous Week"
          {...props}
        />
      }
      {page == Page.objectives &&
        <ObjectivesHeader
          title={props.data.title}
          textNext="Next Year"
          textPrevious="Previous Year"
          {...props}
        />
      }
      <ItemsList
        items={props.data.items}
        {...props}
      />
      {editingId == ID.none && <BasicSpeedDial page={page} onNewAction={onNewAction} />}
      {editingId == ID.new_item && <NewItem initKind={newItemKind} onSubmit={onNewSubmit} onCancel={onCancel} />}
    </div>
  );
}
