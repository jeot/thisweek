import NewItem from "./NewItem.tsx";
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
  return (
    <div className="content-section">
      {props.page == Page.weeks &&
        <WeekYearHeader
          textNext="Next Week"
          textPrevious="Previous Week"
          onNext={props.onNext}
          onPrevious={props.onPrevious}
        >
          <WeekDates {...props} />
        </WeekYearHeader>
      }
      {props.page == Page.objectives &&
        <WeekYearHeader
          textNext="Next Year"
          textPrevious="Previous Year"
          onNext={props.onNext}
          onPrevious={props.onPrevious}
        >
          <YearsHeaderContent title={props.data.title} onSwitchYearCalendar={props.onSwitchYearCalendar} />
        </WeekYearHeader>
      }
      {(props.page == Page.weeks || props.page == Page.objectives) &&
        <ItemsList
          items={props.data.items}
          onDragAndDropEnd={props.onDragAndDropEnd}
          {...props}
        />
      }
      {(props.page == Page.weeks || props.page == Page.objectives) && props.editingId == ID.none &&
        <Fab
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          size="medium" color="primary" aria-label="add"
          onClick={() => { props.onNewAction(ItemKind.goal); }} >
          <AddIcon />
        </Fab>
      }
      {(props.page == Page.weeks || props.page == Page.objectives) && props.editingId == ID.new_item &&
        <NewItem initKind={props.newItemKind} onSubmit={props.onNewSubmit} onCancel={props.onCancel} config={props.config} />
      }

      {props.page == Page.settings &&
        <SettingsPage
          config={props.config}
          reloadConfig={props.reloadConfig}
          setMainCalConfig={props.setMainCalConfig}
          setSecondaryCalConfig={props.setSecondaryCalConfig}
          setItemsDisplayDirectionConfig={props.setItemsDisplayDirectionConfig}
        />}

    </div>
  );
}
