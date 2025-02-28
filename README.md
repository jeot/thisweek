
<p align="center">
    <img width="200" alt="ThisWeek Logo" src="./src-tauri/icons/icon.png">
</p>

<h1 align="center">ThisWeek - A weekly, multi-calendar, cross-platform, task-management application</h1>

<p align="center">
  <img alt="ThisWeek - A weekly, multi-calendar, cross-platform, task-management application"
       width="700" src="./extra/screenshots/v0.1.0/s1.png">
</p>

# ThisWeek

Weekly task-management desktop app designed to help you organize, track, and achieve your goals and objectives with an intuitive weekly/yearly calendar interface.

## Features

- **Task Management**: Create goals (tasks) for each week, edit, and mark them as complete.
- **Note Taking**: Keep important notes within the week (near your related goals).
- **Calendar View (Weekly)**: Visualize and navigate your goals/notes on a weekly calendar-like interface.
- **Objective View (Yearly)**: Create and manage your objectives for each year/season/month.
- **Multiple Calendar View**: Display dates for two different calendar system.
    - Currently supported calendars: Gregorian, Chinese, Persian, Arabic
- **Ordering**: Use drag-and-drop functionality to reorder items.
- **Keyboard Shortcuts**: Predefined keyboard shortcuts for navigating, ordering, and editing items.

## Installation

Go to the release section to download and install.

## Screenshots

<table>
  <tr>
    <td style="padding: 10px;"><img src="./extra/screenshots/v0.1.0/s2.png" alt="Tile 1" width="400"></td>
    <td style="padding: 10px;"><img src="./extra/screenshots/v0.1.0/s3.png" alt="Tile 2" width="400"></td>
  </tr>
  <tr>
    <td style="padding: 10px;"><img src="./extra/screenshots/v0.1.0/s4.png" alt="Tile 3" width="400"></td>
    <td style="padding: 10px;"><img src="./extra/screenshots/v0.1.0/s5.png" alt="Tile 4" width="400"></td>
  </tr>
  <tr>
    <td style="padding: 10px;"><img src="./extra/screenshots/v0.1.0/s6.png" alt="Tile 5" width="400"></td>
    <td style="padding: 10px;"><img src="./extra/screenshots/v0.1.0/s7.png" alt="Tile 6" width="400"></td>
  </tr>
</table>

## Building in Develpement

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
