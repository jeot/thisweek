// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::sync::Mutex;
use tauri::State;

use weeks_core::week::{WeekState, WeekStateJs, Element};

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

#[tauri::command]
fn get_goal(id: String, managed_state: State<ManagedState>) -> Option<Element> {
    let mut week = managed_state.week.lock().unwrap();
    week.get_goal(id)
}

#[tauri::command]
fn get_item(id: String, managed_state: State<ManagedState>) -> Option<Element> {
    let mut week = managed_state.week.lock().unwrap();
    week.get_item(id)
}

#[tauri::command]
fn add_new_goal(goal_text: String, managed_state: State<ManagedState>) -> WeekStateJs {
    let mut week = managed_state.week.lock().unwrap();
    week.add_new_goal(goal_text);
    week.week_state_js_object()
}

#[tauri::command]
fn delete_goal(id: String, managed_state: State<ManagedState>) -> WeekStateJs {
    let mut week = managed_state.week.lock().unwrap();
    week.delete_goal(id);
    week.week_state_js_object()
}

#[tauri::command]
fn edit_goal(id: String, text: String, managed_state: State<ManagedState>) -> WeekStateJs {
    let mut week = managed_state.week.lock().unwrap();
    week.edit_goal(id, text);
    week.week_state_js_object()
}

#[tauri::command]
fn goal_checkbox_changed(id: String, managed_state: State<ManagedState>) -> bool {
    let mut week = managed_state.week.lock().unwrap();
    week.toggle_goal_state(id)
}

fn main() {
    println!("Hello, tauri.");

    tauri::Builder::default()
        .manage(ManagedState { week: Mutex::new(WeekState::new()) })
        .invoke_handler(tauri::generate_handler![
            get_week_state,
            get_next_week,
            get_previous_week,
            get_current_week,
            get_goal,
            get_item,
            add_new_goal,
            delete_goal,
            edit_goal,
            goal_checkbox_changed,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    println!("can not reach this line!!!!");
}
