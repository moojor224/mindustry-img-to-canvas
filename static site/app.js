const COLORS_1 = [
    ["dark blue", "#362944"],
    ["magenta", "#c45d9f"],
    ["pink", "#e39aac"],
    ["yellow", "#f0dab1"],
    ["blue", "#6461c2"],
    ["turquoise", "#2ba9b4"],
    ["green", "#93d4b5"],
    ["tan", "#f0f6e8"],
];
const nearest = nearestcolor.from(Object.fromEntries(COLORS_1));

function encode(data) {
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

function findNearestColor(hexArr) {
    let source = hexArr.map(e => parseInt(e, 16));
    let diffs = COLORS.map(c => {
        let diff = c.map((e, n) => Math.abs(e - source[n]));
        return diff.reduce((a, b) => a + b, 0);
    });
    let targetColor = diffs.indexOf(Math.min(...diffs));
    return [...COLORS[targetColor], 255];
}

function getBase64(file, resolve, reject) {
    let reader = new FileReader();
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
}
scale.oninput();
window.setInterval(_ => c ? (c--, !c ? previewpt1() : 0) : 0, s * 10);
let colors, canvas, width, height;
let infilename = "";
async function previewpt1() {
    hasPreviewed = false;
    let file = document.querySelector('#input').files[0];
    if (typeof file == "undefined") return;
    infilename = file.name.split(".");
    infilename.pop();
    infilename = infilename.join(".");
    let base64 = await new Promise(function (resolve, reject) {
        getBase64(file, resolve, reject);
    });
    /** @type {HTMLCanvasElement} */
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
            ctx.imageSmootingEnabled = false;
            ctx.scale(scaleSize, scaleSize);
            ctx.drawImage(img, 0, 0);
            resolve(canvas);
        }
        img.src = base64;
    });
}

function previewpt2() {
    hasPreviewed = true;
    let ctx = canvas.getContext("2d");
    colors = ctx.getImageData(0, 0, width, height);
    let rows = imageDataToArray(colors);
    let convertedColors = [];
    for (let x = 0; x < rows.length; x++) {
        convertedColors[x] = [];
        for (let y = 0; y < rows[x].length; y++) {
            rows[x][y].pop();
            convertedColors[x][y] = findNearestColor(rows[x][y]);
        }
    }
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

function nearestColors(grid) {
    let arr = grid.map(row => {
        return row.map(cell => {
            return cell.map(c => {
                let color = nearest("#" + c.map(rgb => rgb.toString(16)).join("").substring(0, 6))
                if (typeof color == "string") { }
                else {
                    color = color.value;
                }
                return COLORS_1.indexOf(COLORS_1.find(e => e[1] == color));
            })
        });
    });
    return arr;
}

let schematicToSave = "";

function saveFile() {
    let filename = infilename + ".msch";
    let data = schematicToSave.toBuffer();
    let file = new Blob([data], { type: "text/plain" });
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(file, filename);
    }
    else {
        let a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }

}
function makeSchematic(packet) {
    let { width, height, arrs } = packet;
    width *= 2;
    height *= 2;
    const mindustryioschem = new mindustryio.Schematic();
    mindustryioschem.resize(height, width);

    for (let y = height - 2; y >= 0; y -= 2) {
        for (let x = 0; x < width; x += 2) {
            let config = arrs.shift();
            mindustryioschem.tile(x, y).setBlock("canvas");
            mindustryioschem.tile(x, y).setConfig(Buffer.from(new Uint8Array(config)));
        }
    }
    mindustryioschem.tags.name = "name";
    schematicToSave = mindustryioschem;
    return {};
};

function imageDataToGrid(imageData) {
    if (!hasPreviewed) {
        return;
    }
    let preConversionColorsArr = imageDataToArray(imageData);
    let grid = chunk2DArray(preConversionColorsArr, 12);
    let arrs = nearestColors(grid.flat());
    arrs = arrs.map(canvas => encode(canvas.map(row => row.map(color => color.toString(2).padStart(3, 0)).join(",")).join("\n")));

    let width = parseInt(document.getElementById("cWidth").textContent.match(/\d+/g)[0]);
    let height = arrs.length / width;
    makeSchematic({ width, height, arrs });
    saveFile();
}