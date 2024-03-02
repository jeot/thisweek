// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::sync::Mutex;
use tauri::State;

use weeks_core::week::{WeekState, WeekStateJs};

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
fn add_new_goal(goal_text: String, managed_state: State<ManagedState>) -> WeekStateJs {
    let mut week = managed_state.week.lock().unwrap();
    week.add_new_goal(goal_text);
    week.week_state_js_object()
}

#[tauri::command]
fn goal_checkbox_changed(text: String, checked: bool, managed_state: State<ManagedState>) -> String {
    // let mut week = managed_state.week.lock().unwrap();
    // week.add_new_goal(goal_text);
    // week.week_state_js_object()
    println!("processing checkbox: {text}, {checked}");
    return String::from("gotcha!");
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
            add_new_goal,
            goal_checkbox_changed,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    println!("can not reach this line!!!!");
}
