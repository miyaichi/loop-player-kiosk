# DOOH Loop Player Verification Walkthrough

## Prerequisites
- Node.js installed.
- `npm install` completed (I have already run this).

## Steps to Verify

1.  **Start the System**:
    Run the following command in your terminal:
    ```bash
    npm start
    ```
    Or use the shell script:
    ```bash
    ./start.sh
    ```

2.  **Verify Window**:
    - A Chrome window should open.
    - It should have no address bar (App mode).
    - The size should be 1920x1080 (as defined in `config.json`).

3.  **Verify Playback**:
    - **Image**: You should see a nature landscape image for 5 seconds.
    - **URL**: Then it should switch to Google.com for 10 seconds.
    - **Image**: Then a placeholder image for 5 seconds.
    - **Loop**: The sequence should repeat.

4.  **Verify Exit**:
    - Click the red "EXIT SYSTEM" button in the bottom right corner.
    - The browser window should close.
    - The terminal process should terminate.

## Configuration
You can modify `config.json` to change the window size or the schedule.
