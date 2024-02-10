// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use days_core::{WeekState, WeekStateJs};

#[tauri::command]
fn get_week_state(week: tauri::State<WeekState>) -> WeekStateJs {
    week.week_state_js_object()
}

#[tauri::command]
fn get_week_title(week: tauri::State<WeekState>) -> String {
    week.week_title()
}

#[tauri::command]
fn get_today_title(week: tauri::State<WeekState>) -> String {
    week.today_title()
}

fn main() {
    tauri::Builder::default()
        .manage(WeekState::new())
        .invoke_handler(tauri::generate_handler![get_week_title, get_today_title, get_week_state])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
