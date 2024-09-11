// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use once_cell::sync::OnceCell;
use std::path::Path;
use std::sync::Mutex;
use tauri::{AppHandle, Manager, State};
use weeks_core::calendar::Calendar;
use weeks_core::calendar::CalendarView;
use weeks_core::language::Language;

#[derive(Clone, serde::Serialize, Default)]
struct EventPayload {
    command: String,
    message: String,
}

static GLOBAL_APP_HANDLE: OnceCell<AppHandle> = OnceCell::new();

// this execute on my other script
pub fn send_event_to_frontend(name: &str, payload: &EventPayload) {
    if let Some(app_handle) = GLOBAL_APP_HANDLE.get() {
        app_handle.emit_all(name, payload.clone()).unwrap();
    }
}

fn config_changed_callback() {
    println!("config file changed!");
    // we need to triger the config to be reloaded
    config::init_config();
    // we need to reload the backend data
    refresh_data();
    // send command to front to be reloaded!
    send_event_to_frontend("ConfigChanged", &EventPayload::default());
}

fn refresh_data() {
    if let Some(app) = GLOBAL_APP_HANDLE.get() {
        let state = app.state::<MyAppState>();
        let _ = state.today.lock().unwrap().update();
        let _ = state.week.lock().unwrap().update();
        let _ = state.year.lock().unwrap().update();
    }
}

use weeks_core::config;
use weeks_core::db_sqlite;
use weeks_core::models::ItemsList;
use weeks_core::models::*;
use weeks_core::notify::Notify;
use weeks_core::ordering::Ordering;
use weeks_core::today::Today;
use weeks_core::week::Week;
use weeks_core::year::Year;

struct MyAppState {
    today: Mutex<Today>,
    week: Mutex<Week>,
    year: Mutex<Year>,
    notify: Mutex<Notify>,
}

#[tauri::command]
fn get_today(state: State<MyAppState>) -> Today {
    state.today.lock().unwrap().clone()
}

#[tauri::command]
fn get_week(state: State<MyAppState>) -> Week {
    state.week.lock().unwrap().clone()
}

#[tauri::command]
fn get_year(state: State<MyAppState>) -> Year {
    state.year.lock().unwrap().clone()
}

#[tauri::command]
fn get_calendar_views() -> (CalendarView, Option<CalendarView>) {
    let main_cal: Calendar = config::get_config().main_calendar_type.into();
    let main_lang: Language = config::get_config().main_calendar_language.into();
    let main_cal_view: CalendarView = main_cal.get_calendar_view(&main_lang);
    let aux_cal: Option<Calendar> = config::get_config()
        .secondary_calendar_type
        .map(Calendar::from);
    let aux_cal_view: Option<CalendarView> = aux_cal.map(|cal| {
        let aux_lang: Language = config::get_config()
            .secondary_calendar_language
            .unwrap_or_default()
            .into();
        cal.get_calendar_view(&aux_lang)
    });
    (main_cal_view, aux_cal_view)
}

#[tauri::command]
fn previous_time_period(page: i32, state: State<MyAppState>) -> bool {
    if page == LIST_TYPE_WEEKS {
        let mut week = state.week.lock().unwrap();
        week.previous().is_ok()
    } else if page == LIST_TYPE_OBJECTIVES {
        let mut year = state.year.lock().unwrap();
        year.previous().is_ok()
    } else {
        false
    }
}

#[tauri::command]
fn current_time_period(page: i32, state: State<MyAppState>) -> bool {
    if page == LIST_TYPE_WEEKS {
        let mut week = state.week.lock().unwrap();
        week.current().is_ok()
    } else if page == LIST_TYPE_OBJECTIVES {
        let mut year = state.year.lock().unwrap();
        year.current().is_ok()
    } else {
        false
    }
}

#[tauri::command]
fn next_time_period(page: i32, state: State<MyAppState>) -> bool {
    if page == LIST_TYPE_WEEKS {
        let mut week = state.week.lock().unwrap();
        week.next().is_ok()
    } else if page == LIST_TYPE_OBJECTIVES {
        let mut year = state.year.lock().unwrap();
        year.next().is_ok()
    } else {
        false
    }
}

// related to item manipulations
#[tauri::command]
fn add_new_item(mut item: Item, state: State<MyAppState>) -> bool {
    let main_cal: Calendar = config::get_config().main_calendar_type.into();
    item.calendar = main_cal.into();
    if item.year.is_none() && item.season.is_none() && item.month.is_none() {
        let mut week = state.week.lock().unwrap();
        item.order_in_week = Some(week.get_new_ordering_key());
        item.day = week.middle_day;
        // todo: the tauri is only an interface
        // all the logic (like creating a new item and saving) should be in the core
        let result = db_sqlite::create_item(&NewItem::from(&item));
        let _ = week.update();
        result.is_ok()
    } else {
        let mut year = state.year.lock().unwrap();
        item.order_in_resolution = Some(year.get_new_ordering_key());
        item.day = 0;
        let result = db_sqlite::create_item(&NewItem::from(&item));
        let _ = year.update();
        result.is_ok()
    }
}

#[tauri::command]
fn delete_item(id: i32, state: State<MyAppState>) -> bool {
    let result = db_sqlite::remove_item(id);
    let _ = state.week.lock().unwrap().update();
    let _ = state.year.lock().unwrap().update();
    result.is_ok()
}

#[tauri::command]
fn update_item(item: Item, state: State<MyAppState>) -> bool {
    let result = db_sqlite::update_item(&item);
    let _ = state.week.lock().unwrap().update();
    let _ = state.year.lock().unwrap().update();
    result.is_ok()
}

#[tauri::command]
fn toggle_item_state(id: i32, state: State<MyAppState>) -> bool {
    let result = db_sqlite::toggle_item_state(id);
    let _ = state.week.lock().unwrap().update();
    let _ = state.year.lock().unwrap().update();
    result.is_ok()
}

#[tauri::command]
fn change_item_objective_period(
    id: i32,
    year: Option<i32>,
    season: Option<i32>,
    month: Option<i32>,
    state: State<MyAppState>,
) -> bool {
    let result = db_sqlite::update_item_objective_period(id, year, season, month);
    let _ = state.week.lock().unwrap().update();
    let _ = state.year.lock().unwrap().update();
    result.is_ok()
}

#[tauri::command]
fn get_near_items_id(id: i32, page: i32, state: State<MyAppState>) -> (Option<i32>, Option<i32>) {
    if page == LIST_TYPE_WEEKS {
        let week = state.week.lock().unwrap();
        week.items.get_near_items_id(id)
    } else if page == LIST_TYPE_OBJECTIVES {
        let year = state.year.lock().unwrap();
        year.items.get_near_items_id(id)
    } else {
        (None, None)
    }
}

#[tauri::command]
fn move_up_selected_item(page: i32, id: i32, state: State<MyAppState>) -> bool {
    let mut result = false;
    if page == LIST_TYPE_WEEKS {
        let mut week = state.week.lock().unwrap();
        if let Ok(key) = week.generate_key_for_move_up_with_id(id) {
            result = db_sqlite::update_item_week_ordering_key(id, key).is_ok()
        }
        let _ = week.update();
    } else if page == LIST_TYPE_OBJECTIVES {
        let mut year = state.year.lock().unwrap();
        if let Ok(key) = year.generate_key_for_move_up_with_id(id) {
            result = db_sqlite::update_item_year_ordering_key(id, key).is_ok()
        }
        let _ = year.update();
    }
    result
}

#[tauri::command]
fn move_down_selected_item(page: i32, id: i32, state: State<MyAppState>) -> bool {
    let mut result = false;
    if page == LIST_TYPE_WEEKS {
        let mut week = state.week.lock().unwrap();
        if let Ok(key) = week.generate_key_for_move_down_with_id(id) {
            result = db_sqlite::update_item_week_ordering_key(id, key).is_ok()
        }
        let _ = week.update();
    } else if page == LIST_TYPE_OBJECTIVES {
        let mut year = state.year.lock().unwrap();
        if let Ok(key) = year.generate_key_for_move_down_with_id(id) {
            result = db_sqlite::update_item_year_ordering_key(id, key).is_ok()
        }
        let _ = year.update();
    }
    result
}

#[tauri::command]
fn move_item_to_other_time_period_offset(
    page: i32,
    id: i32,
    offset: i32,
    state: State<MyAppState>,
) -> bool {
    let mut result = false;
    if page == LIST_TYPE_WEEKS {
        let mut week = state.week.lock().unwrap();
        result = week
            .move_item_to_other_time_period_offset(id, offset)
            .is_ok()
    } else if page == LIST_TYPE_OBJECTIVES {
        let mut year = state.year.lock().unwrap();
        result = year
            .move_item_to_other_time_period_offset(id, offset)
            .is_ok()
    }
    result
}

#[tauri::command]
fn backup_database_file(state: State<MyAppState>) -> bool {
    let week = state.week.lock().unwrap();
    week.backup_database_file().is_ok()
}

fn main() {
    println!("Hello, tauri.");

    tauri::Builder::default()
        .manage(MyAppState {
            today: Mutex::new(Today::new()),
            week: Mutex::new(Week::new()),
            year: Mutex::new(Year::new()),
            notify: Mutex::new(Notify::new(
                &config::default_config_path(),
                config_changed_callback,
            )),
        })
        .invoke_handler(tauri::generate_handler![
            get_today,
            get_week,
            get_year,
            get_calendar_views,
            // common stuff
            move_up_selected_item,
            move_down_selected_item,
            move_item_to_other_time_period_offset,
            current_time_period,
            next_time_period,
            previous_time_period,
            add_new_item,
            delete_item,
            update_item,
            toggle_item_state,
            change_item_objective_period,
            backup_database_file,
            get_near_items_id,
        ])
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|_app_handle, event| match event {
            tauri::RunEvent::Ready => {
                println!("Window loaded");
                GLOBAL_APP_HANDLE
                    .set(_app_handle.clone())
                    .expect("Failed to set global app handle");
            }
            _ => {}
        });

    println!("can not reach this line!!!!");
}
