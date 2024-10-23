import WeekHeader from "./WeekHeader.tsx";
import ObjectivesHeader from "./ObjectivesHeader.tsx";
import NewItem from "./NewItem.tsx";
// import BasicSpeedDial from "./BasicSpeedDial.tsx";
import ItemsList from "./ItemsList.tsx";
import SettingsPage from "./SettingsPage.tsx";
import AddIcon from '@mui/icons-material/Add';

import "../prototypes.ts";
import { ID, ItemKind, Page } from "../constants.ts";
import './styles.css'
import { Fab } from "@mui/material";

export default function Content(props: any) {
  const { page, editingId, newItemKind, config, reloadConfig, setMainCalConfig, setSecondaryCalConfig, onNewAction, onNewSubmit, onCancel } = props;
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
      {(page == Page.weeks || page == Page.objectives) &&
        <ItemsList
          items={props.data.items}
          {...props}
        />
      }
      {(page == Page.weeks || page == Page.objectives) && editingId == ID.none &&
        <Fab
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          size="medium" color="primary" aria-label="add"
          onClick={() => { onNewAction(ItemKind.goal); }} >
          <AddIcon />
        </Fab>
      }
      {(page == Page.weeks || page == Page.objectives) && editingId == ID.new_item && <NewItem initKind={newItemKind} onSubmit={onNewSubmit} onCancel={onCancel} />}

      {page == Page.settings && <SettingsPage config={config} reloadConfig={reloadConfig} setMainCalConfig={setMainCalConfig} setSecondaryCalConfig={setSecondaryCalConfig} />}

    </div>
  );
}
