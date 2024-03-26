async function sendMessage(channel, data = "") {
    let response = await new Promise(function (resolve, reject) {
        let responseFunc = function (event, packet) {
            ipcRenderer.removeAllListeners(channel + "-response");
            // console.log(`got response on: "${channel}-response":`, packet);
            if (packet.error) {
                console.error("error:", packet);
                reject(packet);
            }
            resolve(packet);
        };
        ipcRenderer.on(channel + "-response", responseFunc);
        // console.log(`sending data on: "${channel}"`, data);
        ipcRenderer.postMessage(channel, data);
    });
    return response;
}

const base64 = 'bXNjaAF4nE2N227CMAyGf9KjhrRpSNznBXqFtBfhCUJjUBEklUkH7NG5oDhppWHH+Rwf/iBDqZA7cyZ8b24/emuc1cHrbcumx9LSpeWuD513WL899MFrvWOxGh/9cPol7v6IJfdX4sZ5S/jqnJQD2ebiBYzPwVni/clfm4MJhPo4uDZJl/NEyX6IrHYmCO8AVvi3RTpQdQWMT6hxlBBKVYlLZ3zMo9mEHKleFDHN0vYiQjxPW6koUQjyNFVKVsSOmiSiOqr5A7myCUlZzcovD0488Q==';
const baseSchematic = "bXNjaAF4nGNgYmBiZmDJS8xNZWBPzs/JL1IwYOBOSS1OLsosKMnMz2NgYGDLSUxKzSlmYIqOZWRgS07MK0ssBgozMoAAHxCbMZAHAG64Ds0=";
let shapes = "bXNjaAF4nGNgYmBiZmDJS8xNZWArzkgsSC1m4E5JLU4uyiwoyczPY2BgYMtJTErNKWZgio5lZGBLTswrSywGCjMygAAfEJv9nP///38FIHb/8P9///8f/3GC+yDiL4TBAAD15EHm";
let arr = [128, 64, 32, 16, 8, 4, 2, 1];
let charArr = new Array(432);
[shapes].forEach(e => {
    return;
    let s = Schematic.decode(e);
    console.log(s);
    // debugger;

    let eight = s.tiles[0].config.reverse().map(e => {
        return (e + 128).toString(2).padStart(8, 0);
    }).join("").split("");
    let counter = 0;
    s.tiles[0].config.forEach(e => {
        for (var i = 0; i < 8; i++) {
            if (arr[i] & e) {
                charArr[counter] = "1";
            } else {
                charArr[counter] = "0";
            }
            counter++;
        }
    });

    charArr = charArr.join("").match(/.{3}/g);
    let chunks = [];
    let chunkSize = 12;
    for (let i = 0; i < charArr.length; i += chunkSize) {
        const chunk = charArr.slice(i, i + chunkSize);
        chunks.push(chunk);
    }
    chunks = chunks.reverse().map(e => e.reverse().join(",")).join("\n");
    console.log("chunks", chunks);
    console.log("encoded", encode(chunks).toString());
});

function encode(data) {
    // console.log("encode", data);
    let array = data.split("\n").map(e => e.replaceAll(",", "").match(/.{3}/g).reverse().join("").split("")).reverse();
    array = (array.flat());
    let compressed = new Array(54);
    let counter = 0;
    for (var i = 0; i < 54; i++) {
        let sum = 0;
        for (var e = 0; e < 8; e++) {
            sum *= 2;
            if (array[counter] === "1") {
                sum += 1;
            }
            counter++;
        }
        if (sum > 127) {
            sum -= 256;
        }
        compressed[i] = sum;
    }
    return compressed.reverse();
}

const COLORS = [
    "#362944", // dark blue
    "#c45d9f", // magenta
    "#e39aac", // pink
    "#f0dab1", // yellow
    "#6461c2", // blue
    "#2ba9b4", // turquoise
    "#93d4b5", // green
    "#f0f6e8", // tan
].map(e => e.substring(1).match(/.{2}/g).map(e => parseInt(e, 16)));

async function findNearestColor(hexArr) {

    // source colors
    let source = hexArr.map(e => parseInt(e, 16));
    let diffs = COLORS.map(c => {
        let [tr, tg, tb] = c;
        let diff = c.map((e, n) => Math.abs(e - source[n]));
        return diff.reduce((a, b) => a + b, 0);
    });
    let targetColor = diffs.indexOf(Math.min(...diffs));
    // console.log("target", targetColor, COLORS[targetColor]);
    return /* "#" + */[...COLORS[targetColor], 255]; //.map(e => e.toString(16)).join("") + "ff";
}

function getBase64(file, resolve, reject) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        resolve(reader.result);
    };
    reader.onerror = function (error) {
        reject(error);
    };
}

let scale = document.getElementById("scale");
document.getElementById("scaleSubtract").onclick = function () {
    if (parseInt(scale.value) > parseInt(scale.min)) {
        scale.value = parseInt(scale.value) - parseInt(scale.step);
    }
    scale.oninput();
}
document.getElementById("scaleAdd").onclick = function () {
    if (parseInt(scale.value) < parseInt(scale.max)) {
        scale.value = parseInt(scale.value) + parseInt(scale.step);
    }
    scale.oninput();
}
let c = 100, s = 0.75;
let hasPreviewed = false;
scale.oninput = _ => {
    hasPreviewed = false;
    document.getElementById("scaleDisplay").innerHTML = scale.value;
    c = 100;
    // previewpt1();
}
scale.oninput();
window.setInterval(_ => c ? (c--, !c ? previewpt1() : 0) : 0, s * 10);
let colors, canvas, width, height;
async function previewpt1() {
    hasPreviewed = false;
    let file = document.querySelector('#input').files[0];
    // let base64 = (await new Promise(function (resolve, reject) {
    //     getBase64(file, resolve, reject);
    // })).split(",");
    // base64.shift();
    // base64 = base64.join(",");
    // console.log("base64", base64);
    // console.log(await sendMessage("msch-from", atob(base64)));
    // return;
    let base64 = await new Promise(function (resolve, reject) {
        getBase64(file, resolve, reject);
    });
    /**
     * @type {HTMLCanvasElement}
     */
    canvas = await new Promise(function (resolve, reject) {
        let scaleSize = (typeof scale.value == "number" ? scale.value : parseInt(scale.value)) / 100;
        let img = new Image();
        img.onload = function () {
            let canvas = document.getElementById("preview");
            width = Math.floor(img.width * scaleSize);
            height = Math.floor(img.height * scaleSize);
            document.getElementById("width").innerHTML = width;
            document.getElementById("height").innerHTML = height;
            document.getElementById("cWidth").innerHTML = Math.ceil(width / 12);
            document.getElementById("cHeight").innerHTML = Math.ceil(height / 12);
            document.getElementById("cTotal").innerHTML = Math.ceil(width / 12) * Math.ceil(height / 12);
            canvas.width = width;
            canvas.height = height;
            let ctx = canvas.getContext("2d");
            ctx.scale(scaleSize, scaleSize);
            ctx.drawImage(img, 0, 0);
            resolve(canvas);
        }
        img.src = base64;
    });
}

async function previewpt2() {
    hasPreviewed = true;
    let ctx = canvas.getContext("2d");
    colors = ctx.getImageData(0, 0, width, height);
    let rows = imageDataToArray(colors);
    let convertedColors = [];
    // rows.map(row => row.map(c => findNearestColor((c.pop(), c)))).flat(Infinity);
    // let x = 0, y = 0;
    for (let x = 0; x < rows.length; x++) {
        convertedColors[x] = [];
        for (let y = 0; y < rows[x].length; y++) {
            rows[x][y].pop();
            convertedColors[x][y] = await findNearestColor(rows[x][y]);
        }
    }
    // console.log(convertedColors);
    colors.data.set(convertedColors.flat(Infinity));
    let output = document.getElementById("output");
    let outputCtx = output.getContext("2d");
    output.height = height;
    output.width = width;
    outputCtx.putImageData(colors, 0, 0);
}

document.querySelector("#runButton").addEventListener("click", () => imageDataToGrid(colors));
document.querySelector("#previewButton").addEventListener("click", previewpt2);
document.querySelector("input[type=file]").addEventListener("change", previewpt1);

function imageDataToArray(imageData) {
    let pixels = [];
    for (let i = 0; i < imageData.data.length; i += 4) {
        pixels.push([...imageData.data.slice(i, i + 4)].map(e => e.toString(16)));
    }
    let rows = [];
    for (let i = 0; i < pixels.length; i += width) {
        rows.push(pixels.slice(i, i + width));
    }
    return rows;
}

function chunk2DArray(array, size) {
    let chunks = [];
    while (array.length % size > 0) {
        array.push([]);
    }
    let maxLength = Math.max(...array.map(e => e.length));
    array.forEach(row => {
        while (row.length % size > 0 || row.length < maxLength) {
            row.push(COLORS[0].map(e => e.toString(16)));
        }
    });
    for (let y = 0; y < array.length; y += size) {
        for (let x = 0; x < array[0].length; x += size) {
            for (let dy = y; dy < y + size; dy++) {
                for (let dx = x; dx < x + size; dx++) {
                    if (!Array.isArray(chunks[y / size])) chunks[y / size] = [];
                    if (!Array.isArray(chunks[y / size][x / size])) chunks[y / size][x / size] = [];
                    chunks[y / size][x / size].push(array[dy][dx]);
                }
            }
            let wrapped = [];
            for (let i = 0; i < chunks[y / size][x / size].length; i += size) {
                wrapped.push(chunks[y / size][x / size].slice(i, i + size));
            }
            chunks[y / size][x / size] = wrapped;
        }
    }
    return chunks;
}

async function imageDataToGrid(imageData) {
    console.log(hasPreviewed);
    if (!hasPreviewed) {
        return;
    }
    let preConversionColorsArr = imageDataToArray(imageData);
    let grid = chunk2DArray(preConversionColorsArr, 12);
    let arrs = await sendMessage("nearest-colors", grid.flat());
    arrs = arrs.map(canvas => encode(canvas.map(row => row.map(color => color.toString(2).padStart(3, 0)).join(",")).join("\n")));

    let width = parseInt(document.getElementById("cWidth").textContent.match(/\d+/g)[0]);
    let height = arrs.length / width;
    await sendMessage("make-schematic", { width, height, arrs });
    await sendMessage("save-file");
}