# Loop Player Kiosk

A simple DOOH (Digital Out‑of‑Home) loop player that runs Chrome in kiosk (fullscreen) mode. It loads a schedule from `config.json` and loops through images or URLs.

## Features
- Fullscreen kiosk mode (no address bar, no menu)
- Configurable window size via `config.json`
- Supports image and URL items with custom durations
- Graceful shutdown via OS window close (no on‑screen exit button)

## Prerequisites
- Node.js (>= 14)
- npm

## Setup
```bash
# Install dependencies
npm install
```

## Run
```bash
./start.sh   # installs deps if needed and starts the app
```

The app will start a local Express server, launch Chrome in kiosk mode and display the scheduled content.

## Configuration
Edit `config.json` to change window size or schedule items.

## License
MIT (see LICENSE file).