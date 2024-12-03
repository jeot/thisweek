# ThisWeek

**ThisWeek** is a weekly task-management desktop app designed to help you organize, track, and achieve your weekly goals with an intuitive weekly/yearly calendar interface.

## Features
- **Task Management**: Create goals (tasks) for each week, edit, and mark them as complete.
- **Note Taking**: Keep important notes within the week (near your related goals).
- **Calendar View (Weekly)**: Visualize and navigate tasks and goals on a weekly calendar-like interface.
- **Objective View (Yearly)**: Create and manage your objectives for each year/season/month.
- **Multiple Calendar View**: Display dates for two different calendar system.
    - Currently supported calendars: Gregorian, Chinese, Persian, Arabic

## Installation

**ThisWeek** desktop app is built with Tauri (Rust + React + Typescript)

### Prerequisites
- [Node.js](https://nodejs.org/) (for building the front-end)
- [Rust](https://www.rust-lang.org/) (for Tauri back-end)
- [Tauri CLI](https://v1.tauri.app/v1/guides/) (to build the app)

### Steps
1. Clone the repository:
   - `git clone https://github.com/jeot/thisweek.git`
   - `cd thisweek`

2. Install dependencies for the front-end:
   - `npm install`

3. Build and run the app in development mode:
   - `cargo tauri dev`

## Building for Production

To create a production-ready version of the app:
   - `cargo tauri build`

This will generate the packaged app (installer binary) for your operating system.

## Contributing

Feel free to fork this project, submit issues, or open pull requests. Contributions are welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Recommended IDE Setup

Recommended by Tauri, not me: [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

I am a hardcore Neovim user! [Neovim](https://neovim.io/) + [rustaceanvim](https://github.com/mrcjkb/rustaceanvim)
