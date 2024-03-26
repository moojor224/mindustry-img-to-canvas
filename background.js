const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("node:path");
const fs = require("node:fs");
const process = require("node:process");
const mindustryio = require("mindustryio");
const COLORS = [
    ["dark blue", "#362944"],
    ["magenta", "#c45d9f"],
    ["pink", "#e39aac"],
    ["yellow", "#f0dab1"],
    ["blue", "#6461c2"],
    ["turquoise", "#2ba9b4"],
    ["green", "#93d4b5"],
    ["tan", "#f0f6e8"],
];
const nearest = require('nearest-color').from(Object.fromEntries(COLORS));

/**
 * @type {BrowserWindow}
 */
let mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, "site/preload.js"),
        },
    });
    mainWindow.maximize();
    mainWindow.loadFile("site/index.html");
    mainWindow.webContents.openDevTools();
}

app.whenReady().then(function () {
    createWindow();
    app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

function listen(channel, callback) {
    ipcMain.on(channel, async function (event, packet) {
        // console.log("got message from site on channel", channel);
        let result = await callback(packet);
        // console.log("sending response to channel", channel + "-response");
        event.reply(channel + "-response", result);
    });
}

function logAndReturn(val) {
    console.log(val);
    return val;
}

listen("nearest-colors", async function (grid) {
    let arr = grid.map(row => {
        return row.map(cell => {
            return cell.map(c => {
                let color = nearest("#" + c.map(rgb => rgb.toString(16)).join("").substring(0, 6))
                if (typeof color == "string") { }
                else {
                    color = color.value;
                }
                return COLORS.indexOf(COLORS.find(e => e[1] == color));
            })
        });
    });
    return logAndReturn(arr);
});

let schematicToSave = "";
listen("save-file", async function () {
    try {
        let chosen = path.parse((await dialog.showOpenDialog(mainWindow, {
            properties: ["openFile", "promptToCreate"],
            filters: {
                name: "Mindustry Schematic Files",
                extensions: ["msch"]
            },
        })).filePaths[0]);
        console.log("chosen", chosen);
        let savePath = "";
        if (chosen.ext.length > 0 && chosen.ext == ".msch") {
            savePath = path.join(chosen.dir, chosen.name + chosen.ext);
        } else {
            savePath = path.join(chosen.dir, chosen.name + ".msch");
        }
        if (typeof schematicToSave != "string") {
            schematicToSave.tags.name = path.parse(savePath).name;
            console.log("saving file to", savePath);
            fs.writeFileSync(savePath, schematicToSave.toBuffer());
            return "file saved at: " + savePath;
        }
        return false;
    } catch (err) {
        return err;
    }
});

let shapes = "bXNjaAF4nGNgYmBiZmDJS8xNZWArzkgsSC1m4E5JLU4uyiwoyczPY2BgYMtJTErNKWZgio5lZGBLTswrSywGCjMygAAfEJv9nP///38FIHb/8P9///8f/3GC+yDiL4TBAAD15EHm";
listen("make-schematic", async function (packet) {
    let { width, height, arrs } = packet;
    width *= 2;
    height *= 2;
    // console.log({ width, height });
    const mindustryioschem = new mindustryio.Schematic();
    mindustryioschem.resize(height, width);

    for (let y = height - 2; y >= 0; y -= 2) {
        for (let x = 0; x < width; x += 2) {
            // console.log({ x, y });
            let config = arrs.shift();
            mindustryioschem.tile(x, y).setBlock("canvas");
            mindustryioschem.tile(x, y).setConfig(Buffer.from(new Uint8Array(config)));
        }
    }
    // let save = await sendMessage("get-save-location");
    // console.log(["path", save, path.parse(save)]);
    // let { name, folder } = save;
    mindustryioschem.tags.name = "name";
    // console.log(mindustryioschem);
    // console.log(mindustryioschem.tile(0, 0));
    // console.log(mindustryioschem.tile(0, 0).getConfig());
    schematicToSave = mindustryioschem;
    return {};
});