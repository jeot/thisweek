// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::sync::Mutex;
use tauri::State;

use weeks_core::week::{WeekState, WeekStateJs};
use weeks_core::models::Item;

struct ManagedState {
    week: Mutex<WeekState>,
}

#[tauri::command]
fn get_week_state(managed_state: State<ManagedState>) -> WeekStateJs {
    let week = managed_state.week.lock().unwrap();
    week.week_state_js_object()
}

#[tauri::command]
fn get_next_week(managed_state: State<ManagedState>) -> WeekStateJs {
    let mut week = managed_state.week.lock().unwrap();
    week.next();
    week.week_state_js_object()
}

#[tauri::command]
fn get_previous_week(managed_state: State<ManagedState>) -> WeekStateJs {
    let mut week = managed_state.week.lock().unwrap();
    week.previous();
    week.week_state_js_object()
}

#[tauri::command]
fn get_current_week(managed_state: State<ManagedState>) -> WeekStateJs {
    let mut week = managed_state.week.lock().unwrap();
    week.current();
    week.week_state_js_object()
}

// #[tauri::command]
// fn get_item(id: i32, managed_state: State<ManagedState>) -> Option<Element> {
//     let week = managed_state.week.lock().unwrap();
//     week.get_item(id)
// }

#[tauri::command]
fn add_new_goal(text: String, managed_state: State<ManagedState>) -> WeekStateJs {
    let mut week = managed_state.week.lock().unwrap();
    week.add_new_goal(text);
    week.week_state_js_object()
}

#[tauri::command]
fn add_new_note(text: String, managed_state: State<ManagedState>) -> WeekStateJs {
    let mut week = managed_state.week.lock().unwrap();
    week.add_new_note(text);
    week.week_state_js_object()
}

#[tauri::command]
fn delete_item(id: i32, managed_state: State<ManagedState>) -> WeekStateJs {
    let mut week = managed_state.week.lock().unwrap();
    week.delete_item(id);
    week.week_state_js_object()
}

#[tauri::command]
fn update_item(id: i32, text: String, managed_state: State<ManagedState>) -> WeekStateJs {
    let mut week = managed_state.week.lock().unwrap();
    week.update_item(id, text);
    week.week_state_js_object()
}

#[tauri::command]
fn toggle_item_state(id: i32, managed_state: State<ManagedState>) -> WeekStateJs {
    println!("toggle_item_state: id: {id}");
    let mut week = managed_state.week.lock().unwrap();
    week.toggle_item_state(id);
    week.week_state_js_object()
}

fn main() {
    println!("Hello, tauri.");

    tauri::Builder::default()
        .manage(ManagedState {
            week: Mutex::new(WeekState::new()),
        })
        .invoke_handler(tauri::generate_handler![
            get_week_state,
            get_next_week,
            get_previous_week,
            get_current_week,
            // get_item,
            add_new_goal,
            add_new_note,
            delete_item,
            update_item,
            toggle_item_state,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    println!("can not reach this line!!!!");
}
