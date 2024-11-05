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
import WeekYearHeader from "./WeekYearHeader.tsx";
import WeekDates from "./WeekDates.tsx";
import YearsHeaderContent from "./YearsHeaderContent.tsx";

export default function Content(props: any) {
  const { page, editingId, newItemKind, config, reloadConfig, setMainCalConfig, setSecondaryCalConfig, setItemsDisplayDirectionConfig, onNewAction, onNewSubmit, onCancel } = props;
  return (
    <div className="content-section">
      {page == Page.weeks &&
        <WeekYearHeader
          textNext="Next Week"
          textPrevious="Previous Week"
          onNext={props.onNext}
          onPrevious={props.onPrevious}
        >
          <WeekDates {...props} />
        </WeekYearHeader>
      }
      {page == Page.objectives &&
        <WeekYearHeader
          textNext="Next Year"
          textPrevious="Previous Year"
          onNext={props.onNext}
          onPrevious={props.onPrevious}
        >
          <YearsHeaderContent title={props.data.title} onSwitchYearCalendar={props.onSwitchYearCalendar} />
        </WeekYearHeader>
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
      {(page == Page.weeks || page == Page.objectives) && editingId == ID.new_item &&
        <NewItem initKind={newItemKind} onSubmit={onNewSubmit} onCancel={onCancel} config={config} />
      }

      {page == Page.settings &&
        <SettingsPage
          config={config}
          reloadConfig={reloadConfig}
          setMainCalConfig={setMainCalConfig}
          setSecondaryCalConfig={setSecondaryCalConfig}
          setItemsDisplayDirectionConfig={setItemsDisplayDirectionConfig}
        />}

    </div>
  );
}
