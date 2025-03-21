const { app, BrowserWindow } = require("electron");
const path = require("path");
const waitOn = require("wait-on");

let mainWindow;

async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 400,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            spellcheck: false,
        },

    });
    

    // Detect the correct Vite port dynamically
    const devServerPort = process.env.VITE_PORT || 5173;
    const devServerURL = `http://localhost:${devServerPort}/`;
    const prodFilePath = `file://${path.join(__dirname, "dist/index.html")}`;

    if (app.isPackaged) {
        console.log("Running in Production Mode");
        mainWindow.loadURL(prodFilePath);
    } else {
        console.log(`Waiting for Vite dev server at ${devServerURL}...`);
        try {
            await waitOn({ resources: [devServerURL], timeout: 30000 }); // Wait for Vite
            console.log("Vite is ready. Loading Electron app...");
            mainWindow.loadURL(devServerURL);
            mainWindow.webContents.openDevTools();
        } catch (error) {
            console.error("Failed to connect to Vite dev server:", error);
        }
    }

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
