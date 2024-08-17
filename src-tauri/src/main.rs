// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::sync::Mutex;
use tauri::State;

use weeks_core::db_sqlite;
use weeks_core::models::ItemsList;
use weeks_core::models::*;
use weeks_core::ordering::Ordering;
use weeks_core::today::Today;
use weeks_core::week::Week;
use weeks_core::year::Year;

struct MyAppState {
    today: Mutex<Today>,
    week: Mutex<Week>,
    year: Mutex<Year>,
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
fn add_new_item(page: i32, kind: i32, text: String, state: State<MyAppState>) -> bool {
    if page == LIST_TYPE_WEEKS {
        let mut week = state.week.lock().unwrap();
        if kind == ITEM_KIND_GOAL {
            return week.add_new_goal(text).is_ok();
        }
        if kind == ITEM_KIND_NOTE {
            return week.add_new_note(text).is_ok();
        }
    }
    if page == LIST_TYPE_OBJECTIVES {
        let mut year = state.year.lock().unwrap();
        if kind == ITEM_KIND_GOAL {
            return year.add_new_goal(text).is_ok();
        }
        if kind == ITEM_KIND_NOTE {
            return year.add_new_note(text).is_ok();
        }
    }
    false
}

#[tauri::command]
fn delete_item(id: i32, state: State<MyAppState>) -> bool {
    let result = db_sqlite::remove_item(id);
    let _ = state.week.lock().unwrap().update();
    let _ = state.year.lock().unwrap().update();
    result.is_ok()
}

#[tauri::command]
fn update_item(id: i32, text: String, state: State<MyAppState>) -> bool {
    let result = db_sqlite::update_item_text(id, text);
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
fn move_up_selected_item_in_week(id: i32, state: State<MyAppState>) -> bool {
    let mut week = state.week.lock().unwrap();
    if let Ok(key) = week.generate_key_for_move_up_with_id(id) {
        db_sqlite::update_item_week_ordering_key(id, key).is_ok()
    } else {
        false
    }
}

#[tauri::command]
fn move_down_selected_item_in_week(id: i32, state: State<MyAppState>) -> bool {
    let mut week = state.week.lock().unwrap();
    if let Ok(key) = week.generate_key_for_move_down_with_id(id) {
        db_sqlite::update_item_week_ordering_key(id, key).is_ok()
    } else {
        false
    }
}

#[tauri::command]
fn move_up_selected_item_in_year(id: i32, state: State<MyAppState>) -> bool {
    let mut year = state.year.lock().unwrap();
    if let Ok(key) = year.generate_key_for_move_up_with_id(id) {
        db_sqlite::update_item_year_ordering_key(id, key).is_ok()
    } else {
        false
    }
}

#[tauri::command]
fn move_down_selected_item_in_year(id: i32, state: State<MyAppState>) -> bool {
    let mut year = state.year.lock().unwrap();
    if let Ok(key) = year.generate_key_for_move_down_with_id(id) {
        db_sqlite::update_item_year_ordering_key(id, key).is_ok()
    } else {
        false
    }
}

#[tauri::command]
fn move_selected_item_to_next_week(id: i32, state: State<MyAppState>) -> bool {
    let mut week = state.week.lock().unwrap();
    week.move_selected_item_to_next_week(id).is_ok()
}

#[tauri::command]
fn move_selected_item_to_previous_week(id: i32, state: State<MyAppState>) -> bool {
    let mut week = state.week.lock().unwrap();
    week.move_selected_item_to_previous_week(id).is_ok()
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
        })
        .invoke_handler(tauri::generate_handler![
            get_today,
            // week stuff
            get_week,
            move_up_selected_item_in_week,
            move_selected_item_to_next_week,
            move_selected_item_to_previous_week,
            // year stuff
            get_year,
            move_up_selected_item_in_year,
            // todo: move_selected_item_to_next_year,
            // todo: move_selected_item_to_previous_year,
            // common
            current_time_period,
            next_time_period,
            previous_time_period,
            add_new_item,
            delete_item,
            update_item,
            toggle_item_state,
            backup_database_file,
            get_near_items_id,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    println!("can not reach this line!!!!");
}
