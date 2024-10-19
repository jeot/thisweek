import WeekHeader from "./WeekHeader.tsx";
import ObjectivesHeader from "./ObjectivesHeader.tsx";
import NewItem from "./NewItem.tsx";
// import BasicSpeedDial from "./BasicSpeedDial.tsx";
import ItemsList from "./ItemsList.tsx";
import SettingsPage from "./SettingsPage.tsx";
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

import "../prototypes.ts";
import { ID, ItemKind, Page } from "../constants.ts";
import './styles.css'
import { Button } from "@mui/material";

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
        <button
          className='add-new-btn'
          aria-label='new'
          onClick={() => { onNewAction(ItemKind.goal); }}
        >
          <AddIcon />
        </button>
      }
      {(page == Page.weeks || page == Page.objectives) && editingId == ID.new_item && <NewItem initKind={newItemKind} onSubmit={onNewSubmit} onCancel={onCancel} />}

      {page == Page.settings && <SettingsPage config={config} reloadConfig={reloadConfig} setMainCalConfig={setMainCalConfig} setSecondaryCalConfig={setSecondaryCalConfig} />}

    </div>
  );
}
