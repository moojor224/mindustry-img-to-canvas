// import { devlog } from "./dev-helper.js";

/**
 * accepts a css selector and a callback function\
 * waits for an element that matches the css selector to load, then calls the callback
 * @param {String} query css selector to wait for
 * @param {Function} callback callback function to run when the element is found
 * @param {Boolean} stopAfterFound whether to stop looking after the element is found
 * @param {Element} [element = document] parent element to look within -  defaults to document
 */
function waitForKeyElements(query, callback, stopAfterFound, element) {
    let o, r;

    (o = void 0 === element ? $(query) : $(element).contents().find(query)) &&
        o.length > 0
        ? ((r = !0),
            o.each(function () {
                let e = $(this);
                e.data("alreadyFound") ||
                    false ||
                    (callback(e) ? (r = false) : e.data("alreadyFound", true));
            }))
        : (r = false);
    let l = waitForKeyElements.controlObj || {},
        i = query.replace(/[^\w]/g, "_"),
        c = l[i];
    r && stopAfterFound && c
        ? (clearInterval(c), delete l[i])
        : c ||
        ((c = setInterval(function () {
            waitForKeyElements(query, callback, stopAfterFound, element);
        }, 1000)),
            (l[i] = c));
    waitForKeyElements.controlObj = l;
} //wait for key elements

/*
 * takes in a string and object, and returns an HTMLElement with tag "tag" and properties defined by data\
 * OR\
 * takes in an object and merges the properties from data into it
 * @param {(string|object)} tag html tag name, or object to apply properties to
 * @param {object} data object with properties to be applied
 * @returns {HTMLElement}
 * @example
 * createElement("div", {
 *      innerHTML: "Text Here",
 *      style: {
 *          color: red,
 *          fontSize: "20px",
 *          padding: "3px"
 *      },
 *      dataset: {
 *          title: "title"
 *      }
 * });// <div style="color: red; font-size: 20px; padding: 3px;" data-title="title">Text Here</div>
 */

function createElement(tag, data = {}) {
        if (typeof tag === "string" && tag.match(/[^a-zA-Z0-9]/g)) { // if tag is a string and string includes non alphanumeric characters, parse as emmet string
            let div = createElement("div"); // create temporary parent node
            if (expandAbbreviation && typeof expandAbbreviation == "function") { // if expandAbbreviation is defined
                div.innerHTML = expandAbbreviation(tag); // expand abbreviation
            } else if (emmet && emmet.expandAbbreviation && typeof emmet.expandAbbreviation == "function") { // if emmet.expandAbbreviation is defined
                div.innerHTML = emmet.expandAbbreviation(tag); // expand abbreviation
            }
            /**
             * @type {HTMLElement[]}
             */
            let arr = Array.from(div.children);
            return arr.length == 1 ? arr[0] : arr; // if only 1 top-level element was generated, return it, else return whole array
        }
        tag = typeof tag === "string" ? document.createElement(tag) : tag; // convert string to HTMLElement
        Object.keys(data).forEach((e) => { // loop through object properties
            if (typeof data[e] === "object") { // if value is object, recurse
                createElement(tag[e] || (tag[e] = {}), data[e]);
            } else {
                if (tag instanceof window.Element) { // if tag is an html element
                    if (e.substring(0, 2) == "on" && typeof data[e] == "function") { // if property is an event listener
                        tag.addEventListener(e.substring(2), data[e]); // add event listener
                    } else {
                        tag[e] = data[e]; // else, set property
                    }
                } else {
                    tag[e] = data[e]; // else, set property
                }
            }
        });
        return tag; // return result
    }


/**
 * appends any number of objects to an HTMLElement
 * @param  {...Element} args an array of objects to be added to the parent element
 * @returns {this}
 * @memberof Element
 * @function external:Element#add
 * @example
 * createElement("table").add(
 *      createElement("tr").add(
 *          createElement("td", {innerHTML: "col 1"}),
 *          createElement("td", {innerHTML: "col 2"}),
 *          createElement("td", {innerHTML: "col 3"})
 *      )
 * );
 * // results in:
 * <table>
 *     <tr>
 *         <td>col 1</td>
 *         <td>col 2</td>
 *         <td>col 3</td>
 *     </tr>
 * </table>
 */
function add(...args) {
    args.forEach(elem => {
        this.append(elem);
    });
    return this;
};
if (window.Element.prototype.add === undefined) {
    window.Element.prototype.add = add;
}

// loop through all HTML...Element prototypes and add the add function
Object.getOwnPropertyNames(window).filter(e => e.startsWith("HTML") && e.endsWith("Element")).forEach(e => {
    if (window[e].prototype.add !== add) {
        window[e].prototype.add = add
    }
});

// window.HTMLSelectElement.prototype.add = add;

// /**
//  * appends an &lt;error> element to {this}
//  * @param {String} text error message
//  */
// window.Element.prototype.error = function (text = "!") {
//     this.clearError(); // remove error element if it exists
//     this.add(createElement("error", { innerHTML: text })); // add error element
// }

// /**
//  * clears the error message from {this}
//  * @returns {Boolean} whether an element was cleared or not
//  */
// window.Element.prototype.clearError = function () {
//     // this.querySelector("error")?.remove();
//     for (let e of this.childNodes) { // loop through child nodes
//         if (e.tagName.toLowerCase() == "error") { // if element is an error element
//             e.remove(); // remove
//             return true; // success
//         }
//     }
//     return false; // fail
// }

// /**
//  * adds a warning message to the specified elements
//  * @param {String} str message to display
//  * @param  {...any} selectors elements to add warning message to
//  */
// export function warn(str, ...selectors) {
//     clearWarn(...selectors);
//     let w = createElement("warn", {
//         innerHTML: str
//     });
//     selectors.forEach(s => {
//         let el = s;
//         if (typeof s === "string") {
//             el = document.querySelector(s);
//         }
//         el.append(w.cloneNode(true));
//     });
// }

// /**
//  * removes the warning message from the given elements
//  * @param  {...any} selectors elements to remove the warning message from
//  */
// export function clearWarn(...selectors) {
//     selectors.forEach(s => {
//         let el = s;
//         if (typeof s === "string") {
//             el = document.querySelector(s);
//         }
//         for (let e of el.children) {
//             if (e.tagName.toLowerCase() == "warn") { // only remove warning messages that are children of this element
//                 e.remove();
//             }
//         }
//     });
// }

// /**
//  * adds an error message to the specified elements
//  * @param {String} str message to display
//  * @param  {...any} selectors elements to add error message to
//  */
// export function error(str, ...selectors) {
//     clearWarn(...selectors);
//     let w = createElement("error", {
//         innerHTML: str
//     });
//     selectors.forEach(s => {
//         let el = s;
//         if (typeof s === "string") {
//             el = document.querySelector(s);
//         }
//         el.append(w.cloneNode(true));
//     });
// }

// /**
//  * removes the error message from the given elements
//  * @param  {...any} selectors elements to remove the error message from
//  */
// export function clearError(...selectors) {
//     selectors.forEach(s => {
//         let el = s;
//         if (typeof s === "string") {
//             el = document.querySelector(s);
//         }
//         for (let e of el.children) {
//             if (e.tagName.toLowerCase() == "error") { // only remove error messages that are children of this element
//                 e.remove();
//             }
//         }
//     });
// }


// /**
//  * hides the given elements
//  * @param  {...(String|Element)} selectors list of css selectors or elements
//  */
// export function hide(...selectors) {
//     for (let s of selectors) (typeof s == "string" ? document.querySelector(s) : s).classList.add("hidden"); // loop through given elements/selectors and add the hidden class
// }

// /**
//  * shows the given elements
//  * @param  {...(String|Element)} selectors list of css selectors or elements
//  */
// export function show(...selectors) {
//     for (let s of selectors) (typeof s == "string" ? document.querySelector(s) : s).classList.remove("hidden"); // loop through given elements/selectors and remove the hidden class
// }

// /**
//  * clears the given elements
//  * @param  {...(String|Element)} selectors list of css selectors or elements
//  */
// export function clear(...selectors) {
//     for (let s of selectors) {
//         s = typeof s == "string" ? document.querySelector(s) : s; // convert string to queried element
//         let arr = flattenChildNodes(s); // get all descendant nodes in order
//         if (arr.includes(s)) { // remove element from list if it exists (won't ever run, ideally)
//             arr.splice(arr.indexOf(s), 1);
//         }
//         while (arr.length > 0) { // remove individual elements to deep purge event listeners
//             let el = arr.pop(); // get element from end of list
//             if (el.remove) { // if element is removeable (not a text node)
//                 el.remove(); // remove it
//             }
//         }
//         s.innerHTML = ""; // clear out any remaining text nodes
//     }
// }

// /**
//  * disables the given elements
//  * @param {String} message message to show
//  * @param  {...(String|Element)} selectors list of css selectors or elements
//  */
// export function disable(message, ...selectors) {
//     for (let s of selectors) (typeof s == "string" ? document.querySelector(s) : s).setAttribute("disabled", message);
// }

// /**
//  * reenables the given elements
//  * @param  {...(String|Element)} selectors list of css selectors or elements
//  */
// export function enable(...selectors) {
//     for (let s of selectors) (typeof s == "string" ? document.querySelector(s) : s).removeAttribute("disabled");
// }

// /**
//  * sets the tab's favicon to a square with the specified color
//  * @param {string} color color of the square
//  */
// export function tabColor(color) {
//     function isValidCSSColor(color2) { // checks if string is valid css color
//         if (["unset", "initial", "inherit"].includes(color2)) { // valid css colors that should return false
//             return false;
//         }
//         const s = document.createElement("div").style; // get style property of temp element
//         s.color = color2; // set color property
//         return s.color !== ""; // check if color property is still there
//     }
//     if (!isValidCSSColor(color)) { // check if provided color is valid
//         return;
//     }
//     let c = document.createElement("canvas"); // create dummy canvas
//     c.width = 1; // set favicon dimensions
//     c.height = 1; // 1x1 is fine since it's a solid color
//     let ctx = c.getContext("2d");
//     ctx.fillStyle = color;
//     ctx.fillRect(0, 0, 128, 128);
//     let link = document.querySelector("link[rel=icon]") || document.createElement("link");
//     link.href = c.toDataURL();
//     link.rel = "icon";
//     document.head.append(link);
// }

// /**
//  * parses cookies into a hashmap
//  * @param {string} [cookies=document.cookie] cookies to parse
//  * @returns {Map} hashmap of all cookies
//  */
// export function parseCookies(cookies = document.cookie) {
//     console.log(cookies);
//     let reading = !1;
//     let escaped = !1;
//     let quoted = NaN;
//     let key = "";
//     let value = "";
//     let map = new Map();
//     cookies.trim().split("").forEach((e) => {
//         if (escaped) {
//             value += e;
//             escaped = false;
//         } else if (reading) {
//             if (quoted == NaN) {
//                 quoted = e == '"';
//                 if (!quoted) {
//                     value += e;
//                 }
//             } else if ((e == '"' && quoted) || (e == ";" && !quoted)) {
//                 quoted = NaN;
//                 map.set(key.trim(), value);
//                 reading = false;
//                 value = "";
//                 key = "";
//             } else {
//                 value += e;
//             }
//         } else if (e == "=") {
//             reading = true;
//         } else {
//             key += e;
//         }
//     });
//     if (key != "") {
//         map.set(key.trim(), value);
//     }
//     return map;
// }

// /**
//  * generates a array sort function that sorts an array of objects by a specified property name
//  * @param {string} prop name of the property to sort by
//  * @returns {function} the sort function
//  * @example 
//  * ```javascript
//  * let People = [
//  *     {Name: "Name", Surname: "Surname"},
//  *     {Name:"AAA", Surname:"ZZZ"},
//  *     {Name: "Name", Surname: "AAA"}
//  * ];
//  * People.sort(dynamicSort("Name"));
//  * People.sort(dynamicSort("Surname"));
//  * People.sort(dynamicSort("-Surname"));
//  * ```
//  */
// export function dynamicSort(prop) {
//     let sortOrder = 1;
//     if (typeof prop === "string" && prop[0] === "-") {
//         sortOrder = -1;
//         prop = prop.substring(1);
//     }
//     return function (a, b) {
//         let result = a[prop] < b[prop] ? -1 : a[prop] > b[prop] ? 1 : 0;
//         return result * sortOrder;
//     };
// }

// /**
//  * returns css rgb string based off of a percent value of a gradient
//  * @param {number} p number in range from 0-100
//  * @param {Object[]} colors array of rgb colors
//  * @returns {string}
//  */
// export function rgbGradient(
//     p,
//     colors = [
//         { r: 0xff, g: 0, b: 0 }, // 0% red
//         { r: 0xff, g: 0x7f, b: 0 }, // 20% orange
//         { r: 0xff, g: 0xff, b: 0 }, // 40% yellow
//         { r: 0, g: 0xff, b: 0 }, // 60% green
//         { r: 0, g: 0, b: 0xff }, // 80% blue
//         { r: 0xff, g: 0, b: 0xff }, // 100% purple
//     ]
// ) {
//     p = typeof p === "string" ? parseInt(p) : p;
//     let numChunks = colors.length - 1;
//     let chunkSize = 100 / numChunks;
//     for (let i = 1; i <= numChunks; i++) {
//         if (p <= chunkSize * i) {
//             let percent = ((p + (1 - i) * chunkSize) * numChunks) / 100;
//             let color1 = colors[i], color2 = colors[i - 1];
//             let result = [];

//             Object.keys(colors[0]).forEach((e) => {
//                 result.push(Math.floor((color1[e] * percent + color2[e] * (1 - percent)) * 100) / 100);
//             });
//             return "rgb(" + result.join(",") + ")";
//         }
//     }
// }

// /**
//  * proportionately maps a number from an input range to an output range
//  * @param {Number} x value
//  * @param {Number} inmin input range lower bound
//  * @param {Number} inmax input range upper bound
//  * @param {Number} outmin output range lower bound
//  * @param {Number} outmax output range upper bound
//  * @param {Boolean} cmp whether to clamp the input value to the input range
//  * @returns {Number}
//  */
// export function map(x, inmin, inmax, outmin, outmax, cmp = false) {
//     return ((cmp ? clamp(x, inmin, inmax) : x) - inmin) * (outmax - outmin) / (inmax - inmin) + outmin;
// }

// /**
//  * generates a gradient of colors from the specified array
//  * @param {Number} count number of colors to generate
//  * @param {Object[]} colors array of colors in gradient
//  * @returns {String[]} array of colors generated
//  */
// export function gradient(count, colors = [
//     { r: 0xff, g: 0, b: 0 }, // 0% red
//     { r: 0xff, g: 0x7f, b: 0 }, // 20% orange
//     { r: 0xff, g: 0xff, b: 0 }, // 40% yellow
//     { r: 0, g: 0xff, b: 0 }, // 60% green
//     { r: 0, g: 0, b: 0xff }, // 80% blue
//     { r: 0xff, g: 0, b: 0xff }, // 100% purple
// ]) {
//     if (count == 1) {
//         let { r, g, b } = colors[0];
//         return [`rgb(${r},${g},${b})`];
//     }
//     let arr = new Array(count).fill("");
//     arr = arr.map((e, n) => rgbGradient(map(n, 0, count - 1, 0, 100), colors));
//     return arr;
// }

// /**
//  * interleaves arrays
//  * @param {Boolean} fill whther to fill arrays with null to match longest array's length
//  * @param  {...any} arrays arrays to interleave
//  * @returns {any[]} interleaved arrays
//  */
// export function interleaveArrays(fill, ...arrays) {
//     let max = Math.max(...arrays.map(e => e.length));
//     if (fill) arrays = arrays.map(arr => [...arr, ...new Array(max - arr.length).fill(null)]);
//     let change = true;
//     let result = [];
//     let count = 0;
//     while (change && count < 100) {
//         count++;
//         change = false;
//         arrays.forEach(arr => {
//             if (arr.length > 0) {
//                 change = true;
//                 result.push(arr.shift());
//             }
//         });
//     }
//     return result;
// }

// /**
//  * sets `console.everything` to an array of the console's history\
//  * run this before using any console logging functions in order to capture everything
//  */
// export function captureConsole() {
//     // if (console.everything === undefined) {
//     //     console.everything = [];
//     //     ["log", "warn", "error", "debug"].forEach(e => {
//     //         let d = "default" + e.split("")[0].toUpperCase() + e.substring(1);
//     //         console[d] = console[e].bind(console);
//     //         console[e] = function (...args) {
//     //             console.everything.push({
//     //                 type: e,
//     //                 datetime: Date().toLocaleString(),
//     //                 value: args
//     //             });
//     //             console[d].apply(console, args);
//     //         }
//     //     });
//     // }
//     if (console.everything === undefined) {
//         console.everything = [];
//         function TS() {
//             return (new Date).toLocaleString("sv", { timeZone: 'UTC' }) + "Z"
//         }
//         window.onerror = function (error, url, line) {
//             console.everything.push({
//                 type: "exception",
//                 timeStamp: TS(),
//                 value: { error, url, line }
//             })
//             return false;
//         }
//         window.onunhandledrejection = function (e) {
//             console.everything.push({
//                 type: "promiseRejection",
//                 timeStamp: TS(),
//                 value: e.reason
//             })
//         }
//         window.onun

//         function hookLogType(logType) {
//             const original = console[logType].bind(console)
//             return function () {
//                 console.everything.push({
//                     type: logType,
//                     timeStamp: TS(),
//                     value: Array.from(arguments)
//                 })
//                 original.apply(console, arguments)
//             }
//         }

//         ['log', 'error', 'warn', 'debug'].forEach(logType => {
//             console[logType] = hookLogType(logType)
//         })
//     }
// }

// /**
//  * takes in an object and returns a flattened array of all it's children
//  * @param {object} arr object to flatten
//  * @returns {object[]} array of all children
//  */
// export function flattenChildren(arr) {
//     return [arr, ...(arr.children?.flatMap((e) => flattenChildren(e)) || [])];
// }

// /**
//  * takes in an HTMLElement and returns an array of all it's descendants
//  * @param {HTMLElement} el element to flatten
//  * @returns {HTMLElement[]} array of all children
//  */
// export function flattenChildNodes(el) {
//     return [el, ...([...el.childNodes].flatMap((e) => flattenChildNodes(e)) || [])];
// }

// /**
//  * internally-used function to convert local times to UTC
//  * @param {Date} b 
//  * @returns {string}
//  */
// function convertTime(b) {
//     b.setHours(b.getHours() + new Date().getTimezoneOffset() / 60);
//     return b.toISOString();
// }

// /**
//  * returns the value of the given css variable name
//  * @param {string} varname css variable name
//  * @returns {string} value of css variable
//  */
// export function getColor(varname, ...append) {
//     let color = getComputedStyle(document.querySelector(":root")).getPropertyValue(varname);
//     if (color.match(/^#[a-zA-Z0-9]{3}$/g)) {
//         color = "#" + color.substring(1).split("").map(e => e.padStart(e, 2)).join("") + append.join("");
//     }
//     return color + append.join("");
// }

// /**
//  * 
//  * @param {Function} val function to call
//  * @param  {...any} args arguments to pass to function
//  * @returns returns an object whose value will automatically 
//  */
// export function lockValue(val, ...args) {
//     return class {
//         constructor() { }
//         static valueOf() {
//             return val(...args);
//         }
//     }
// }

// /**
//  * logs all colors on the page to console, grouped by text color and background color
//  * 
//  * show each individual element in each group
//  */
// export function listAllColorsOnPage() {
//     function hexToRgb(color) {
//         if (color.match(/#?([a-zA-Z0-9]{8}|[a-zA-Z0-9]{6}|[a-zA-Z0-9]{3,4})/g)?.at(0) === color) {
//             color = color.replace("#", "");
//             let split, a;
//             switch (color.length) {
//                 case 4:
//                     a = true;
//                 case 3:
//                     split = color.split("");
//                     break;
//                 case 8:
//                     a = true;
//                 case 6:
//                     split = color.match(/.{1,2}/g);
//                     break;
//             }
//             return `rgb${a ? "a" : ""}(${split.map((e, n) => parseInt(e.padStart(2, e), 16) / (n == 3 ? 255 : 1)).join(", ")})`;
//         }
//     }

//     function rgbToHex(rgb) {
//         return "#" + rgb.replaceAll(/[^0-9\.,]/g, "").split(",").map((e, n) => parseInt(e * (n == 3 ? 255 : 1)).toString(16).padStart(2, e)).join("");
//     }
//     rgbToHex("rgba(255, 255, 255, 0.5)");

//     function flattenChildren(item) {
//         return [item, ...([...item.children]?.flatMap((e) => flattenChildren(e)) || [])];
//     }

//     function getColor(rgb) {
//         let [r, g, b] = rgb.replaceAll(/[^0-9 ]/g, "").split(" ");
//         return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#FFFFFF';
//     }

//     let colorProps = ["backgroundColor", "color"];

//     function displayResults(array) {
//         array.forEach(e => {
//             console.groupCollapsed(`%c${rgbToHex(e.value)} (${(e.varName)})`, `
//     color: ${getColor(e.value)};
//     background-color: ${e.value};
//     padding: 20px;
//     line-height: 60px;
//     font-size: 20px;
//     `);
//             colorProps.forEach(prop => {
//                 if (e[prop].length > 0) {
//                     console.groupCollapsed("%c " + prop, "font-size: 20px;");
//                     e[prop].forEach(v => {
//                         console.log(v[0]);
//                     });
//                     console.groupEnd();
//                 }
//             })
//             console.groupEnd();
//         });
//     }

//     let arr = [...new Array(106).fill(0).map((e, n) => "--color" + (n + 1)), ...new Array(10).fill(1).map((e, n) => "--transparent" + (n + 1))];
//     let root = getComputedStyle(document.querySelector(":root"));
//     let els = flattenChildren(document.body).map(e => [e, getComputedStyle(e)]);
//     arr = arr.map(c => {
//         let color = root.getPropertyValue(c);
//         color = hexToRgb(color);
//         let obj = {
//             value: color,
//             varName: c
//         };
//         colorProps.forEach(e => {
//             obj[e] = els.filter(r => r[1][e] === color);
//         });
//         //     console.log(obj);
//         return obj;
//     }).filter(e => colorProps.map(p => e[p].length > 0).includes(true));

//     console.log(arr);
//     displayResults(arr);
// }

// /**
//  * clamps a number to a range\
//  * \
//  * if the number is outside the range, move it to the\
//  * closest position inside the range, else do nothing
//  * @param {Number} val value
//  * @param {Number} min minimum of range
//  * @param {Number} max maximum of range
//  * @returns {Number} number clamped to range
//  */
// export function clamp(val, min, max) {
//     return (((min > max) ? ([min, max] = [max, min]) : 0), (val < min ? min : val > max ? max : val));
// }

// /**
//  * @param {any | undefined} val 
//  * @param {any} def 
//  * @returns {any | undefined}
//  */
// export function getValueOrDefault(val, def) {
//     if (val === undefined || val === null) {
//         return def;
//     }
//     return val;
// }

// /**
//  * puts the properties from source onto target
//  * @param {Object} target 
//  * @param {Object} source 
//  */
// function extend(target, source) {
//     Object.keys(source).forEach(key => {
//         target[key] = source[key];
//     });
//     return target;
// }

// /**
//  * converts a number stored in string format from into a different base
//  * @param {String} str string containing to number to convert
//  * @param {Number} fromBase base of the passed string
//  * @param {Number} toBase base to convert to
//  * @returns {String} string containing the converted number
//  */
// function convertBase(str, fromBase, toBase) {
//     const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
//     function add(x, y, base) {
//         let z = [];
//         const n = Math.max(x.length, y.length);
//         let carry = 0;
//         let i = 0;
//         while (i < n || carry) {
//             const xi = i < x.length ? x[i] : 0;
//             const yi = i < y.length ? y[i] : 0;
//             const zi = carry + xi + yi;
//             z.push(zi % base);
//             carry = Math.floor(zi / base);
//             i++;
//         }
//         return z;
//     }

//     function multiplyByNumber(num, x, base) {
//         if (num < 0) return null;
//         if (num == 0) return [];

//         let result = [];
//         let power = x;
//         while (true) {
//             num & 1 && (result = add(result, power, base));
//             num = num >> 1;
//             if (num === 0) break;
//             power = add(power, power, base);
//         }

//         return result;
//     }

//     function parseToDigitsArray(str, base) {
//         const digits = str.split('');
//         let arr = [];
//         for (let i = digits.length - 1; i >= 0; i--) {
//             const n = DIGITS.indexOf(digits[i])
//             if (n == -1) return null;
//             arr.push(n);
//         }
//         return arr;
//     }

//     const digits = parseToDigitsArray(str, fromBase);
//     if (digits === null) return null;

//     let outArray = [];
//     let power = [1];
//     for (let i = 0; i < digits.length; i++) {
//         digits[i] && (outArray = add(outArray, multiplyByNumber(digits[i], power, toBase), toBase));
//         power = multiplyByNumber(fromBase, power, toBase);
//     }

//     let out = '';
//     for (let i = outArray.length - 1; i >= 0; i--)
//         out += DIGITS[outArray[i]];

//     return out;
// }

// // get settings not loading settings

// let Settings = window.Settings;
// if (Settings === undefined) {
//     Settings = class extends EventTarget {
//         config = {
//             name: "settings"
//         };
//         sections = [];
//         /**
//          * creates a new Settings object
//          * @param {Object} config config options
//          * @param {Section[]} sections array of sections to add to the settings
//          */
//         constructor(config = {}, sections) {
//             super(); // initialize EventTarget object
//             extend(this.config, config); // apply config to this
//             if (!Array.isArray(sections)) { // turn sections into array if it isn't already
//                 sections = [sections];
//             }
//             this.sections = sections.filter(e => e instanceof Section); // filter all non-Section elements out of sections array
//             sections.forEach(section => {
//                 section.settings_obj = this; // set parent object of each section
//             });
//         }

//         render() {
//             //devlog("render settings");
//             let div = createElement("div", { // main settings div
//                 classList: "settings"
//             }).add(
//                 createElement("h2", { innerHTML: this.config.name })
//             );
//             div.add(...this.sections.map(s => s.render())); // render all subsections and add them to the settings div
//             return div;
//         }

//         /**
//          * 
//          * @param {String} id
//          * @returns {Section}
//          */
//         getSection(id) { // returns the section object with the given id
//             return this.sections.find(e => e.config.id == id);
//         }

//         /**
//          * converts the settings object to a stringified JSON object cabable of being imported through the Settings.fromJson() method
//          * @returns {String}
//          */
//         export() {
//             let data = JSON.parse(JSON.stringify(this, function (key, value) {
//                 if (key.includes("_obj")) { // exclude parent objects to avoid recursion
//                     return undefined;
//                 }
//                 return value;
//             }));
//             data.sections.forEach(sec => {
//                 sec.options.forEach(e => delete e.input)
//             });
//             console.log(data);
//             return JSON.stringify(data);
//         }

//         /**
//          * dispatches an event on the Settings object
//          * @param {Event} event event
//          */
//         dispatchEvent(event) {
//             let originalDispatch = EventTarget.prototype.dispatchEvent.bind(this); // get copy of original dispatchEvent function
//             originalDispatch.apply(this, [event]) // call original dispatchEvent function
//             return !event.defaultPrevented || !event.cancelable;
//         }

//         /**
//          * listens for an event\
//          * wrapper function for addEventListener
//          * @param {String} type type of event
//          * @param {Function} callback callback function
//          */
//         on(type, callback) {
//             // console.log("on", this.#listeners);
//             this.addEventListener(type, callback);
//         }

//         /**
//          * stops the specified callback from listening for the specified event\
//          * wrapper function for removeEventListener
//          * @param {String} type type of event
//          * @param {Function} callback callback function
//          */
//         off(type, callback) {
//             // console.log("off", this.#listeners);
//             this.removeEventListener(type, callback);
//         }

//         /**
//          * converts stringified json data into a settings object\
//          * json data can be generated from the export method
//          * @static
//          * @param {String} jsontext stringified json data
//          * @returns {Settings}
//          */
//         static fromJson(jsontext) {
//             if (jsontext.length == 0) {
//                 return null;
//             }
//             try {
//                 let json = JSON.parse(jsontext);
//                 let validate = Joi.object({ // validate object to make sure it's in the correct format
//                     config: Joi.object({
//                         name: Joi.string().required()
//                     }).required(),
//                     sections: Joi.array().items(Joi.object({
//                         config: Joi.object({
//                             name: Joi.string().required(),
//                             id: Joi.string().required()
//                         }),
//                         options: Joi.array().items(Joi.object({
//                             config: Joi.object({
//                                 name: Joi.string().required(),
//                                 id: Joi.string().required(),
//                                 type: Joi.string().required(),
//                                 value: Joi.any(),
//                                 values: Joi.array()
//                             }).required()
//                         })).required()
//                     })).required()
//                 }).validate(json);
//                 if (validate.error) { // object isn't in the correct format
//                     console.error("invalid json data");
//                     throw new Error(validate.error);
//                 }
//                 return new Settings(json.config, json.sections.map(sec => { // parse object into settings, sections, and options
//                     return new Section(sec.config, sec.options.map(opt => {
//                         return new Option(opt.config);
//                     }));
//                 }));
//             } catch (err) {
//                 console.error(err);
//                 return err;
//             }
//         }

//         replaceWith(settings) {
//             //devlog("replacing", Object.assign({}, this), "with", Object.assign({}, settings));
//             // replaces this settings object with another one by overriding sections array and config.
//             // because this object was exported, it can't be assigned in other modules,
//             // so a custom function had to be made
//             if (!(settings instanceof Settings)) { // only override if provided object is a Setting object
//                 //devlog("settings object is not an instance of the Settings class", settings);
//                 return;
//             }
//             this.config = settings.config; // override config
//             this.sections = settings.sections; // override sections
//         }
//     }
// }

// let Section = window.Section;
// if (Section === undefined) {
//     Section = class extends EventTarget {
//         /**
//          * @type {Settings}
//          */
//         settings_obj = null;
//         config = {
//             name: "section"
//         }
//         options = [];

//         /**
//          * makes a new Section object
//          * @param {Object} config config options
//          * @param {Options[]} options array of Options to add to the section
//          */
//         constructor(config, options) {
//             super(); // initialize EventTarget
//             extend(this.config, config); // apply config to this
//             if (!Array.isArray(options)) { // turn options into array if it isn't one already
//                 options = [options];
//             }
//             this.options = options.filter(e => e instanceof Option); // remove all non-Option items from array
//             options.forEach(option => {
//                 option.section_obj = this; // set parent object for each option
//             });
//         }

//         /**
//          * 
//          * @param {String} name
//          * @returns {Option}
//          */
//         getOption(name) { // returns the section object with the given id
//             return this.options.find(e => e.config.id == name);
//         }

//         /**
//          * renders the section object as HTML
//          * @returns {HTMLElement}
//          */
//         render() {
//             //devlog("render section");
//             let section = createElement("section").add(
//                 createElement("h2", { innerHTML: this.config.name }) // section title
//             );
//             section.add(...this.options.map(o => o.render())); // render all options in this section
//             return section;
//         }

//         /**
//          * dispatches an event on the Section object
//          * @param {String} type event type
//          * @param {Object} config event options/data
//          */
//         dispatchEvent(event) {
//             this.settings_obj.dispatchEvent(event); // bubble event to parent element
//             let originalDispatch = EventTarget.prototype.dispatchEvent.bind(this); // get copy of original dispatchEvent function
//             originalDispatch.apply(this, [event]); // call original dispatchEvent function
//             return !event.defaultPrevented || !event.cancelable;
//         }

//         /**
//          * listens for an event\
//          * wrapper for addEventListener
//          * @param {String} type type of event
//          * @param {Function} callback callback function
//          */
//         on(type, callback) {
//             // console.log("on", this.#listeners);
//             this.addEventListener(type, callback);
//         }

//         /**
//          * stops the specified callback from listening for the specified event\
//          * wrapper for removeEventListener
//          * @param {String} type type of event
//          * @param {Function} callback callback function
//          */
//         off(type, callback) {
//             // console.log("off", this.#listeners);
//             this.removeEventListener(type, callback);
//         }
//     }
// }

// let Option = window.Options;
// if (Option === undefined) {
//     Option = class extends EventTarget {
//         /**
//          * @type {HTMLElement}
//          */
//         input = null;

//         /**
//          * @type {Section}
//          */
//         section_obj = null;
//         config = {
//             name: "option",
//             type: "toggle",
//             value: false
//         }

//         /**
//          * creates a new Option object
//          * @param {Object} config Option options
//          */
//         constructor(config) {
//             super(); // initialize EventTarget object
//             extend(this.config, config); // apply config to this
//             if (config.value == undefined && config.values) { // if value is not specified, set value to first value in values
//                 this.config.value = config.values[0];
//             }
//         }

//         get value() {
//             return this.config.value;
//         }

//         set value(val) {
//             //devlog("set value to", val);
//             show("#loadingModal"); // show the loading modal
//             let option = this;
//             let previousVal = this.config.value;
//             this.config.value = val;
//             fetch("/Reports/Report/SaveSettings", { // fetch request to server to save user settings
//                 method: "POST",
//                 body: this.section_obj.settings_obj.export(),
//                 headers: {
//                     "X-CSRF-TOKEN": Cookies.get("CSRF-TOKEN") // auth token
//                 }
//             }).then(e => {
//                 e.text().then(t => {
//                     if (t.includes("error")) { // settings could not save
//                         //devlog("error saving settings");
//                         this.config.value = previousVal; // revert option change in config object
//                         if (this.input.checked != undefined) { // revert option change in input element
//                             this.input.checked = previousVal;
//                         } else {
//                             this.input = previousVal;
//                         }
//                     } else {
//                         //devlog("successfully saved settings");
//                     }
//                     option.dispatchEvent(new Event("change")); // forward event from html element to option object
//                     hide("#loadingModal"); // hide the loading modal
//                 });
//             });
//         }

//         /**
//          * renders the option object as HTML
//          * @returns {HTMLLabelElement}
//          */
//         render() {
//             //devlog("render option");
//             let label = createElement("label");
//             let span = createElement("span", {
//                 innerHTML: this.config.name
//             });
//             let input = this.createInput();
//             label.add(span, input); // clicking a label will activate the first <input> inside it, so the 'for' attribute isn't required
//             return label;
//         }

//         /**
//          * creates the input method specified by the option config
//          * @returns {HTMLSelectElement|HTMLInputElement}
//          */
//         createInput() {
//             let input; // initialize variable
//             let option = this; // save reference to this
//             if (this.config.type == "toggle") { // standard on/off toggle
//                 input = createElement("input", {
//                     type: "checkbox",
//                     classList: "slider", // pure css toggle switch
//                     checked: option.config.value
//                 });
//             } else if (this.config.type == "dropdown") {
//                 input = createElement("select");
//                 let values = [];
//                 if (this.config.values || (!["undefined", "null"].includes(typeof this.config.values))) { // if list of values is defined
//                     if (!Array.isArray(this.config.values)) { // if values is not an array, make it one
//                         this.config.values = [this.config.values];
//                     }
//                     values.push(...this.config.values); // add defined values to list
//                 }
//                 values = Array.from(new Set(values)); // remove duplicates
//                 input.add(...values.map(v => createElement("option", {
//                     innerHTML: v
//                 })));
//                 // if specified value is not in the list of predefined values, add it as a placeholder
//                 if (this.config.value && !this.config.values.includes(this.config.value)) {
//                     input.insertAdjacentElement("afterBegin", createElement("option", { // insert option element at beginning of select list
//                         innerHTML: this.config.value,
//                         value: this.config.value,
//                         hidden: true, // visually hide placeholder from dropdown
//                         disabled: true // prevent user from selecting it
//                     }));
//                 }
//                 input.value = this.config.value || this.config.values[0];
//             }
//             input.addEventListener("input", function () { // when setting is changed, dispatch change event on the potions object
//                 if (input.checked != undefined) {
//                     option.value = input.checked;
//                 } else {
//                     option.value = input.value;
//                 }
//             });
//             return input;
//         }

//         /**
//          * dispatches an event on the Option object
//          * @param {String} type event type
//          * @param {Object} config event options/data
//          */
//         dispatchEvent(event) {
//             this.section_obj.dispatchEvent(event); // bubble event to parent section
//             let originalDispatch = EventTarget.prototype.dispatchEvent.bind(this); // save copy of original dispatchEvent function
//             originalDispatch.apply(this, [event]); // call original dispatchEvent function
//             return !event.defaultPrevented || !event.cancelable;
//         }

//         /**
//          * listens for an event\
//          * wrapper function for addEventListener
//          * @param {String} type type of event
//          * @param {Function} callback callback function
//          */
//         on(type, callback) {
//             // console.log("option on", this.#listeners);
//             this.addEventListener(type, callback);
//         }

//         /**
//          * stops the specified callback from listening for the specified event\
//          * wrapper function for removeEventListener
//          * @param {String} type type of event
//          * @param {Function} callback callback function
//          */
//         off(type, callback) {
//             // console.log("option off", this.#listeners);
//             this.removeEventListener(type, callback);
//         }
//     }
// }

// export { Settings, Section, Option };


// export let settings = new Settings({
//     name: "Settings"
// }, [
//     new Section({
//         name: "Billing Report",
//         id: "Sites_PlayerSummariesListNew"
//     }, [
//         new Option({
//             name: "Graph Type",
//             id: "graph_type",
//             type: "dropdown",
//             values: ["bar", "line"]
//         }),
//         new Option({
//             name: "Show Composite Graph",
//             id: "composite_graph",
//             type: "toggle",
//             value: false
//         }),
//         new Option({
//             name: "Show Individual Graphs",
//             id: "individual_graph",
//             type: "toggle",
//             value: false
//         })
//     ]),
//     new Section({
//         name: "Online Game Report",
//         id: "SereneOnlineGameReport"
//     }, [
//         new Option({
//             name: "Graph Type",
//             id: "graph_type",
//             type: "dropdown",
//             values: ["bar", "line"]
//         })
//     ]),
//     new Section({
//         name: "Recent Player Count",
//         id: "SereneRecentPlayerCount"
//     }, [
//         new Option({
//             name: "Graph Type",
//             id: "graph_type",
//             type: "dropdown",
//             values: ["bar", "line",
//                 "cal"
//             ]
//         })
//     ])
// ]);

// /**
//  * uses JSON.stringify and JSON.parse to copy an object and return the copy\
//  * WARNING: do not use on objects that contain recursive references, or an error will be thrown
//  * @param {Object} obj object to copy
//  * @returns {Object}
//  * @example
//  * let obj1 = {
//  *     a: 1,
//  *     b: 2,
//  *     c: 3
//  * }
//  * let obj2 = copyObject(obj1) // {a: 1, b: 2, c: 3}
//  * obj1.a = 4;
//  * // obj1 == {a: 4, b: 2, c: 3}
//  * // obj2 == {a: 1, b: 2, c: 3}
//  */
// export function copyObject(obj) {
//     return clone(obj);
//     return JSON.parse(JSON.stringify(obj));
// }

// function clone(obj) {
//     let result = obj;
//     var type = {}.toString.call(obj).slice(8, -1);
//     if (type == 'Set') {
//         return new Set([...obj].map(value => clone(value)));
//     }
//     if (type == 'Map') {
//         return new Map([...obj].map(kv => [clone(kv[0]), clone(kv[1])]));
//     }
//     if (type == 'Date') {
//         return new Date(obj.getTime());
//     }
//     if (type == 'RegExp') {
//         return RegExp(obj.source, getRegExpFlags(obj));
//     }
//     if (type == 'Array' || type == 'Object') {
//         result = Array.isArray(obj) ? [] : {};
//         for (var key in obj) {
//             result[key] = clone(obj[key]);
//         }
//     }
//     // primitives and non-supported objects (e.g. functions) land here
//     return result;
// }

// function getRegExpFlags(regExp) {
//     if (typeof regExp.source.flags == 'string') {
//         return regExp.source.flags;
//     } else {
//         var flags = [];
//         regExp.global && flags.push('g');
//         regExp.ignoreCase && flags.push('i');
//         regExp.multiline && flags.push('m');
//         regExp.sticky && flags.push('y');
//         regExp.unicode && flags.push('u');
//         return flags.join('');
//     }
// }

// /**
//  * parses a stack trace string into an array of objects
//  * @param {String} trace stack trace
//  * @returns {Object[]}
//  */
// export function parseTrace(trace) {
//     let paths = trace.trim().split("\n").map(p => {
//         const a = p.split("@");
//         const locs = a.pop().split(":");
//         return {
//             func: a.join("@"),
//             char: parseInt(locs.pop()),
//             line: parseInt(locs.pop()),
//             location: locs.join(":"),
//         }
//     });
//     return paths;
// }

// /**
//  * converts an entire string to html entities
//  * @param {String} str string to convert
//  * @returns {String} convertet string
//  */
// function toHTMLEntities(str) {
//     return [...str].split("").map(e => `&#${e.charCodeAt(0)};`).join("");
// }

// let svgToDataUri = (function () {
//     const shorterNames = {
//         aqua: /#00ffff(ff)?(?!\w)|#0ff(f)?(?!\w)/gi,
//         azure: /#f0ffff(ff)?(?!\w)/gi,
//         beige: /#f5f5dc(ff)?(?!\w)/gi,
//         bisque: /#ffe4c4(ff)?(?!\w)/gi,
//         black: /#000000(ff)?(?!\w)|#000(f)?(?!\w)/gi,
//         blue: /#0000ff(ff)?(?!\w)|#00f(f)?(?!\w)/gi,
//         brown: /#a52a2a(ff)?(?!\w)/gi,
//         coral: /#ff7f50(ff)?(?!\w)/gi,
//         cornsilk: /#fff8dc(ff)?(?!\w)/gi,
//         crimson: /#dc143c(ff)?(?!\w)/gi,
//         cyan: /#00ffff(ff)?(?!\w)|#0ff(f)?(?!\w)/gi,
//         darkblue: /#00008b(ff)?(?!\w)/gi,
//         darkcyan: /#008b8b(ff)?(?!\w)/gi,
//         darkgrey: /#a9a9a9(ff)?(?!\w)/gi,
//         darkred: /#8b0000(ff)?(?!\w)/gi,
//         deeppink: /#ff1493(ff)?(?!\w)/gi,
//         dimgrey: /#696969(ff)?(?!\w)/gi,
//         gold: /#ffd700(ff)?(?!\w)/gi,
//         green: /#008000(ff)?(?!\w)/gi,
//         grey: /#808080(ff)?(?!\w)/gi,
//         honeydew: /#f0fff0(ff)?(?!\w)/gi,
//         hotpink: /#ff69b4(ff)?(?!\w)/gi,
//         indigo: /#4b0082(ff)?(?!\w)/gi,
//         ivory: /#fffff0(ff)?(?!\w)/gi,
//         khaki: /#f0e68c(ff)?(?!\w)/gi,
//         lavender: /#e6e6fa(ff)?(?!\w)/gi,
//         lime: /#00ff00(ff)?(?!\w)|#0f0(f)?(?!\w)/gi,
//         linen: /#faf0e6(ff)?(?!\w)/gi,
//         maroon: /#800000(ff)?(?!\w)/gi,
//         moccasin: /#ffe4b5(ff)?(?!\w)/gi,
//         navy: /#000080(ff)?(?!\w)/gi,
//         oldlace: /#fdf5e6(ff)?(?!\w)/gi,
//         olive: /#808000(ff)?(?!\w)/gi,
//         orange: /#ffa500(ff)?(?!\w)/gi,
//         orchid: /#da70d6(ff)?(?!\w)/gi,
//         peru: /#cd853f(ff)?(?!\w)/gi,
//         pink: /#ffc0cb(ff)?(?!\w)/gi,
//         plum: /#dda0dd(ff)?(?!\w)/gi,
//         purple: /#800080(ff)?(?!\w)/gi,
//         red: /#ff0000(ff)?(?!\w)|#f00(f)?(?!\w)/gi,
//         salmon: /#fa8072(ff)?(?!\w)/gi,
//         seagreen: /#2e8b57(ff)?(?!\w)/gi,
//         seashell: /#fff5ee(ff)?(?!\w)/gi,
//         sienna: /#a0522d(ff)?(?!\w)/gi,
//         silver: /#c0c0c0(ff)?(?!\w)/gi,
//         skyblue: /#87ceeb(ff)?(?!\w)/gi,
//         snow: /#fffafa(ff)?(?!\w)/gi,
//         tan: /#d2b48c(ff)?(?!\w)/gi,
//         teal: /#008080(ff)?(?!\w)/gi,
//         thistle: /#d8bfd8(ff)?(?!\w)/gi,
//         tomato: /#ff6347(ff)?(?!\w)/gi,
//         violet: /#ee82ee(ff)?(?!\w)/gi,
//         wheat: /#f5deb3(ff)?(?!\w)/gi,
//         white: /#ffffff(ff)?(?!\w)|#fff(f)?(?!\w)/gi,
//     };
//     const REGEX = {
//         whitespace: /\s+/g,
//         urlHexPairs: /%[\dA-F]{2}/g,
//         quotes: /"/g,
//     }

//     function collapseWhitespace(str) {
//         return str.trim().replace(REGEX.whitespace, ' ');
//     }

//     function dataURIPayload(string) {
//         return encodeURIComponent(string)
//             .replace(REGEX.urlHexPairs, specialHexEncode);
//     }

//     // `#` gets converted to `%23`, so quite a few CSS named colors are shorter than
//     // their equivalent URL-encoded hex codes.
//     function colorCodeToShorterNames(string) {
//         Object.keys(shorterNames).forEach(function (key) {
//             if (shorterNames[key].test(string)) {
//                 string = string.replace(shorterNames[key], key);
//             }
//         });

//         return string;
//     }

//     function specialHexEncode(match) {
//         switch (match) { // Browsers tolerate these characters, and they're frequent
//             case '%20': return ' ';
//             case '%3D': return '=';
//             case '%3A': return ':';
//             case '%2F': return '/';
//             default: return match.toLowerCase(); // compresses better
//         }
//     }

//     function svgToTinyDataUri(svgString) {
//         if (typeof svgString !== 'string') {
//             throw new TypeError('Expected a string, but received ' + typeof svgString);
//         }
//         // Strip the Byte-Order Mark if the SVG has one
//         if (svgString.charCodeAt(0) === 0xfeff) { svgString = svgString.slice(1) }

//         var body = colorCodeToShorterNames(collapseWhitespace(svgString))
//             .replace(REGEX.quotes, "'");
//         return 'data:image/svg+xml,' + dataURIPayload(body);
//     }

//     svgToTinyDataUri.toSrcset = function toSrcset(svgString) {
//         return svgToTinyDataUri(svgString).replace(/ /g, '%20');
//     }
//     return svgToTinyDataUri.toSrcset;
// })();

// import { Prism } from "./prism.js";
// import { js_beautify } from "./beautify.js";




// /**
//  * stringifies and syntax highlights almost any javascript object and logs it to the console
//  * @param {HTMLElement|String} element element or HTML string to log
//  * @param {Boolean} raw whether to return the raw result or just console.log it
//  * @returns {Object[]}
//  */
// export function logFormatted(object, options = {}) {
//     let { embedObjects, raw, collapsed, maxDepth, label } = (function () {
//         let defaults = {
//             embedObjects: false, // embed the objects within the console message
//             raw: false, // return the raw result without logging it to the console
//             collapsed: false, // log the message inside a collapsed console group  (increases performace for larger objects)
//             maxDepth: Infinity, // maximum depth to stringify
//             label: "formatted log", // label for collapsed console group
//         }
//         let opt = extend(defaults, options); // replace the default values with user-specified options
//         return opt;
//     })();
//     let objects = []; // array that holds list of all objects
//     let indentAmount = 1; // number of spaces to indent the stringified object by
//     let depth = 0; // current depth
//     let embedIndex = 0; // how many characters have been stringified
//     let indexes = []; // array of indexes where objects should be embedded
//     /**
//      * alternative to JSON.stringify that auto-formats the result and supports functions
//      * @param {any} obj object to stringify
//      * @returns {String}
//      */
//     function stringify(obj) {
//         if (depth > maxDepth) { // prevent stringifying objects deeper than the max depth
//             let str = "'<max depth reached>'";
//             embedIndex += str.length
//             return str;
//         }
//         const type = typeof obj; // store type of object
//         let pad = " ".repeat(indentAmount * 4); // calulate number of spaces to indent
//         if (type == "number" || type == "boolean") { // primitives
//             let str = "" + obj; // convert to string
//             embedIndex += str.length; // add string length to total characters stringified
//             return obj;
//         } else if (type == "function") {
//             objects.push(obj); // add to list of objects
//             let beautified = js_beautify(obj.toString().replaceAll("\r", "")); // beautify function to make tabs equal
//             let splitFunc = beautified.split("\n"); // split formatted function by lines
//             while (splitFunc[1].length == 0) {
//                 splitFunc.splice(1, 1);// remove first line of function body if it's blank (optional)
//             }
//             let padded = splitFunc.map((e, n) => (n > 0 ? pad.substring(4) + e : e + " ")); // indent all lines after first to match current indent amount and add space to end of first line
//             embedIndex += padded[0].length; // length of first line
//             indexes.push(embedIndex);
//             embedIndex += (padded.slice(1).join("\n").length + 1); // length of all lines after first line + newline between 1st and 2nd line
//             return padded.join("\n"); // rejoin function lines and return
//         } else if (type == "string") {
//             let quote;
//             if (!obj.includes('"')) {
//                 quote = '"';
//             } else {
//                 quote = "'";
//             }
//             [
//                 ["\n", "\\n"],
//                 ["\r", "\\r"],
//                 ["\t", "\\t"],
//                 (quote == '"') ? ['"', '\\"'] : ["'", "\\'"],
//             ].forEach(e => {
//                 obj = obj.replaceAll(e[0], e[1]); // double-escape double-quotes and all escape characters
//             });
//             let str = `${quote}${obj}${quote}`; // wrap string with quotes
//             embedIndex += str.length; // add to stringified character count
//             return str;
//         } else if (type == "object") {
//             if (objects.includes(obj)) { // prevent recursion by checking objects that have already been stringified
//                 let str = "<already stringified (recursion prevention)>"; // return plain string
//                 embedIndex += str.length; // add to character count
//                 indexes.push(embedIndex); // save index
//                 return str;
//             }
//             objects.push(obj); // add to list of objects
//             let arr = []; // make array that stores all of this object's properties
//             indentAmount++; // increment indent amount
//             depth++; // increment depth

//             embedIndex += 2; // opening brace/bracket+space
//             indexes.push(embedIndex); // embed object after opening brace/bracket
//             embedIndex += (1 + // newline after opening brace/bracket
//                 pad.length); // first line pad

//             if (Array.isArray(obj)) { // object is an array
//                 obj.forEach((item, index) => { // loop through array items
//                     let str = stringify(item);
//                     arr.push(str);
//                     if (index < obj.length - 1) {
//                         embedIndex += 2 + // comma+newline
//                             pad.length; // next line pad
//                     }
//                 });
//                 indentAmount--; // decrement indent amount
//                 depth--; // decrement depth
//                 embedIndex += (1 + // newline before closing bracket
//                     (pad.length - 4) + // end pad
//                     1); // closing bracket
//                 return `[ \n${pad + arr.join(",\n" + pad)}\n${pad.substring(4)}]`;
//             } else {
//                 if (!obj) { // typeof null === "object"
//                     embedIndex += 4;
//                     return "null";
//                 }
//                 let entries = Object.entries(obj);
//                 entries.forEach(function (kvp, index) {
//                     let [key, value] = kvp;
//                     embedIndex += key.length + // key length
//                         2; // colon+space
//                     let str = stringify(value);
//                     str = `${key}: ${str}`;
//                     arr.push(str);
//                     if (index < entries.length - 1) {
//                         embedIndex += 2 + // comma+newline
//                             pad.length; // next line pad
//                     }
//                 });
//                 indentAmount--; // decrement indent amount
//                 depth--; // decrement depth
//                 let returnVal = `{ \n${pad + arr.join(",\n" + pad)}\n${pad.substring(4)}}`;
//                 embedIndex += 1 + // newline before closing brace
//                     (pad.length - 4) +  // end pad
//                     1; // closing brace
//                 return returnVal;
//             }
//         } else {
//             let str = "" + obj; // convert to string
//             embedIndex += str.length; // add string length to character count
//             return str;
//         }
//     }

//     let element = createElement("div", {
//         innerHTML: Prism.highlight(stringify(object), Prism.languages.javascript).replaceAll("%", "%%")
//     });

//     const regex = /(?<!%)(%%)*%[co]/g;
//     const PRISM_CLASSES = [
//         [["cdata", "comment", "doctype", "prolog"], "#6a9955"],
//         [["boolean", "constant", "number", "property", "symbol", "tag"], "#4fc1ff"],
//         [["attr-name", "builtin", "char", "inserted", "selector", "string"], "#ce9178"],
//         [["entity", "url", "variable"], "#f4b73d"],
//         [["atrule", "attr-value", "keyword"], "#569cd6"],
//         [["important", "regex"], "#ee9900"],
//         [["deleted"], "#ff0000"],
//         [["function"], "#dcdcaa"],
//         [["parameter"], "#9cdcfe"],
//         [["template-punctuation"], "#ce9178"],
//         [["interpolation-punctuation"], "#ff8800"],
//         [["class-name"], "#4ec9b0"]
//     ];

//     function calcStyle(element) {
//         if (!element.style) return;
//         let classList = [...element.classList];
//         classList.forEach(clss => {
//             PRISM_CLASSES.forEach(pclass => {
//                 if (pclass[0].includes(clss)) {
//                     element.style.color = pclass[1];
//                 }
//             });
//         });
//     }

//     let logs = [];
//     let styles = [];
//     const flattened = flattenChildNodes(element);
//     flattened.forEach(calcStyle);
//     if (embedObjects) {
//         let index = 0;
//         let lastPercent = false;
//         function count(node) {
//             let text = "";
//             node.textContent.split("").forEach(function (char) {
//                 if (char == "\r") return;
//                 if (index == indexes[0]) {
//                     indexes.shift();
//                     text += "%o";
//                 }
//                 if (char == "%" && !lastPercent) {
//                     lastPercent = true;
//                     text += "%";
//                 } else if (lastPercent) {
//                     lastPercent = false;
//                     text += char;
//                     index++;
//                 } else {
//                     text += char;
//                     index++;
//                 }
//             });
//             node.textContent = text;
//         }
//         flattened.forEach(e => {
//             if (e.nodeName.includes("text")) {
//                 count(e);
//             }
//         });
//     }

//     flattened.forEach(e => {
//         if (e.nodeName != "#text") return;
//         logs.push(`%c${e.textContent}`);
//         let color = "";
//         if (e.parentNode.style.color) color = `color:${e.parentNode.style.color};`;
//         styles.push(color);
//     });
//     logs = logs.join("");

//     function regexSplit(string) {
//         let str = [], reg = [], match, lastindex = 0, index;
//         while (match = regex.exec(string)) {
//             index = match.index;
//             let kind = match[0], mod = 0;
//             if (kind.length > 2) {
//                 str[str.length - 1] += kind.substring(0, kind.length - 2);
//                 mod = kind.length - 2;
//                 kind = kind.substring(kind.length - 2);
//             }
//             str.push(string.substring(((lastindex + 2) > index ? index : (lastindex + 2)), index));
//             lastindex = index + mod;
//             reg.push(kind);
//         }
//         str.push(string.substring(lastindex + 2));
//         return {
//             split: str,
//             matches: reg,
//         };
//     }

//     let { matches, split } = regexSplit(logs), final = [], finalStyles = [];
//     while (matches.length > 0) {
//         let type = matches.shift();
//         final.push(split.shift() || "");
//         final.push(type);
//         if (type == "%o") {
//             finalStyles.push(objects.shift() || "");
//         } else {
//             finalStyles.push(styles.shift() || "");
//         }
//     }
//     while (split.length > 0) final.push(split.shift());
//     while (objects.length > 0 && embedObjects) finalStyles.push(objects.shift());
//     while (styles.length > 0) finalStyles.push(styles.shift());

//     final = final.join("");

//     if (raw) {
//         return { logs: final, styles: finalStyles, html: element.outerHTML }
//     } else {
//         if (collapsed) {
//             console.groupCollapsed(label);
//             console.log(final, ...finalStyles);
//             console.groupEnd();
//         } else {
//             console.log(final, ...finalStyles);
//         }
//     }
// }

// window.logFormatted = logFormatted;

// // JSFuck
// // library that converts javascript to code that only uses the following characters: []()!+

// (function () {
//     const MIN = 32, MAX = 126;

//     const SIMPLE = {
//         'false': '![]',
//         'true': '!![]',
//         'undefined': '[][[]]',
//         'NaN': '+[![]]',
//         'Infinity': '+(+!+[]+(!+[]+[])[!+[]+!+[]+!+[]]+[+!+[]]+[+[]]+[+[]]+[+[]])' // +"1e1000"
//     };

//     const CONSTRUCTORS = {
//         'Array': '[]',
//         'Number': '(+[])',
//         'String': '([]+[])',
//         'Boolean': '(![])',
//         'Function': '[]["flat"]',
//         'RegExp': 'Function("return/"+false+"/")()',
//         'Object': '[]["entries"]()'
//     };

//     const MAPPING = {
//         'a': '(false+"")[1]',
//         'b': '([]["entries"]()+"")[2]',
//         'c': '([]["flat"]+"")[3]',
//         'd': '(undefined+"")[2]',
//         'e': '(true+"")[3]',
//         'f': '(false+"")[0]',
//         'g': '(false+[0]+String)[20]',
//         'h': '(+(101))["to"+String["name"]](21)[1]',
//         'i': '([false]+undefined)[10]',
//         'j': '([]["entries"]()+"")[3]',
//         'k': '(+(20))["to"+String["name"]](21)',
//         'l': '(false+"")[2]',
//         'm': '(Number+"")[11]',
//         'n': '(undefined+"")[1]',
//         'o': '(true+[]["flat"])[10]',
//         'p': '(+(211))["to"+String["name"]](31)[1]',
//         'q': '("")["fontcolor"]([0]+false+")[20]',
//         'r': '(true+"")[1]',
//         's': '(false+"")[3]',
//         't': '(true+"")[0]',
//         'u': '(undefined+"")[0]',
//         'v': '(+(31))["to"+String["name"]](32)',
//         'w': '(+(32))["to"+String["name"]](33)',
//         'x': '(+(101))["to"+String["name"]](34)[1]',
//         'y': '(NaN+[Infinity])[10]',
//         'z': '(+(35))["to"+String["name"]](36)',
//         'A': '(NaN+[]["entries"]())[11]',
//         'B': '(+[]+Boolean)[10]',
//         'C': 'Function("return escape")()(("")["italics"]())[2]',
//         'D': 'Function("return escape")()([]["flat"])["slice"]("-1")',
//         'E': '(RegExp+"")[12]',
//         'F': '(+[]+Function)[10]',
//         'G': '(false+Function("return Date")()())[30]',
//         'H': null,
//         'I': '(Infinity+"")[0]',
//         'J': null,
//         'K': null,
//         'L': null,
//         'M': '(true+Function("return Date")()())[30]',
//         'N': '(NaN+"")[0]',
//         'O': '(+[]+Object)[10]',
//         'P': null,
//         'Q': null,
//         'R': '(+[]+RegExp)[10]',
//         'S': '(+[]+String)[10]',
//         'T': '(NaN+Function("return Date")()())[30]',
//         'U': '(NaN+Object()["to"+String["name"]]["call"]())[11]',
//         'V': null,
//         'W': null,
//         'X': null,
//         'Y': null,
//         'Z': null,
//         ' ': '(NaN+[]["flat"])[11]',
//         '!': null,
//         '"': '("")["fontcolor"]()[12]',
//         '#': null,
//         '$': null,
//         '%': 'Function("return escape")()([]["flat"])[21]',
//         '&': '("")["fontcolor"](")[13]',
//         '\'': null,
//         '(': '([]["flat"]+"")[13]',
//         ')': '([0]+false+[]["flat"])[20]',
//         '*': null,
//         '+': '(+(+!+[]+(!+[]+[])[!+[]+!+[]+!+[]]+[+!+[]]+[+[]]+[+[]])+[])[2]',
//         ',': '[[]]["concat"]([[]])+""',
//         '-': '(+(.+[0000001])+"")[2]',
//         '.': '(+(+!+[]+[+!+[]]+(!![]+[])[!+[]+!+[]+!+[]]+[!+[]+!+[]]+[+[]])+[])[+!+[]]',
//         '/': '(false+[0])["italics"]()[10]',
//         ':': '(RegExp()+"")[3]',
//         ';': '("")["fontcolor"](NaN+")[21]',
//         '<': '("")["italics"]()[0]',
//         '=': '("")["fontcolor"]()[11]',
//         '>': '("")["italics"]()[2]',
//         '?': '(RegExp()+"")[2]',
//         '@': null,
//         '[': '([]["entries"]()+"")[0]',
//         '\\': '(RegExp("/")+"")[1]',
//         ']': '([]["entries"]()+"")[22]',
//         '^': null,
//         '_': null,
//         '`': null,
//         '{': '(true+[]["flat"])[20]',
//         '|': null,
//         '}': '([]["flat"]+"")["slice"]("-1")',
//         '~': null
//     };

//     const GLOBAL = 'Function("return this")()';

//     function fillMissingDigits() {
//         let output;
//         for (let number = 0; number < 10; number++) {
//             output = "+[]";
//             if (number > 0) { output = "+!" + output; }
//             for (let i = 1; i < number; i++) { output = "+!+[]" + output; }
//             if (number > 1) { output = output.substring(1); }
//             MAPPING[number] = "[" + output + "]";
//         }
//     }

//     function replaceMap() {
//         let character = "", value, i, key;

//         function replace(pattern, replacement) {
//             value = value.replace(
//                 new RegExp(pattern, "gi"),
//                 replacement
//             );
//         }

//         function digitReplacer(_, x) { return MAPPING[x]; }

//         function numberReplacer(_, y) {
//             let values = y.split("");
//             let head = +(values.shift());
//             let output = "+[]";

//             if (head > 0) { output = "+!" + output; }
//             for (i = 1; i < head; i++) { output = "+!+[]" + output; }
//             if (head > 1) { output = output.substring(1); }

//             return [output].concat(values).join("+").replace(/(\d)/g, digitReplacer);
//         }

//         for (i = MIN; i <= MAX; i++) {
//             character = String.fromCharCode(i);
//             value = MAPPING[character];
//             if (!value) { continue; }

//             for (key in CONSTRUCTORS) {
//                 replace("\\b" + key, CONSTRUCTORS[key] + '["constructor"]');
//             }

//             for (key in SIMPLE) {
//                 replace(key, SIMPLE[key]);
//             }

//             replace('(\\d\\d+)', numberReplacer);
//             replace('\\((\\d)\\)', digitReplacer);
//             replace('\\[(\\d)\\]', digitReplacer);

//             replace("GLOBAL", GLOBAL);
//             replace('\\+""', "+[]");
//             replace('""', "[]+[]");

//             MAPPING[character] = value;
//         }
//     }

//     function replaceStrings() {
//         let regEx = /[^\[\]\(\)\!\+]{1}/g,
//             all, value, missing,
//             count = MAX - MIN;

//         function findMissing() {
//             let all, value, done = false;

//             missing = {};

//             for (all in MAPPING) {

//                 value = MAPPING[all];

//                 if (value && value.match(regEx)) {
//                     missing[all] = value;
//                     done = true;
//                 }
//             }

//             return done;
//         }

//         function mappingReplacer(a, b) {
//             return b.split("").join("+");
//         }

//         function valueReplacer(c) {
//             return missing[c] ? c : MAPPING[c];
//         }

//         for (all in MAPPING) {
//             if (MAPPING[all]) {
//                 MAPPING[all] = MAPPING[all].replace(/\"([^\"]+)\"/gi, mappingReplacer);
//             }
//         }

//         while (findMissing()) {
//             for (all in missing) {
//                 value = MAPPING[all];
//                 value = value.replace(regEx, valueReplacer);
//                 MAPPING[all] = value;
//                 missing[all] = value;
//             }

//             if (count-- === 0) {
//                 console.error("Could not compile the following chars:", missing);
//             }
//         }
//     }

//     function escapeSequence(c) {
//         let cc = c.charCodeAt(0);
//         if (cc < 256) {
//             return '\\' + cc.toString(8);
//         } else {
//             let cc16 = cc.toString(16);
//             return '\\u' + ('0000' + cc16).substring(cc16.length);
//         }
//     }

//     function escapeSequenceForReplace(c) {
//         return escapeSequence(c).replace('\\', 't');
//     }

//     function encode(input, wrapWithEval, runInParentScope) {
//         let output = [];
//         if (!input) return "";

//         let unmappped = ''
//         for (let k in MAPPING) if (MAPPING[k]) unmappped += k;
//         unmappped = unmappped.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//         unmappped = new RegExp('[^' + unmappped + ']', 'g');
//         let unmappedCharactersCount = (input.match(unmappped) || []).length;
//         if (unmappedCharactersCount > 1) {
//             input = input.replace(/[^0123456789.adefilnrsuN]/g, escapeSequenceForReplace);
//         } else if (unmappedCharactersCount > 0) {
//             input = input.replace(/["\\]/g, escapeSequence);
//             input = input.replace(unmappped, escapeSequence);
//         }

//         let r = "";
//         for (let i in SIMPLE) {
//             r += i + "|";
//         }
//         r += ".";

//         input.replace(new RegExp(r, 'g'), function (c) {
//             let replacement = SIMPLE[c];
//             if (replacement) {
//                 output.push("(" + replacement + "+[])");
//             } else {
//                 replacement = MAPPING[c];
//                 if (replacement) {
//                     output.push(replacement);
//                 } else {
//                     throw new Error('Found unmapped character: ' + c);
//                 }
//             }
//         });

//         output = output.join("+");

//         if (/^\d$/.test(input)) {
//             output += "+[]";
//         }

//         if (unmappedCharactersCount > 1) {
//             output = "(" + output + ")[" + encode("split") + "](" + encode("t") + ")[" + encode("join") + "](" + encode("\\") + ")";
//         }

//         if (unmappedCharactersCount > 0) {
//             output = "[][" + encode("flat") + "]" +
//                 "[" + encode("constructor") + "]" +
//                 "(" + encode("return\"") + "+" + output + "+" + encode("\"") + ")()";
//         }

//         if (wrapWithEval) {
//             if (runInParentScope) {
//                 output = "[][" + encode("flat") + "]" +
//                     "[" + encode("constructor") + "]" +
//                     "(" + encode("return eval") + ")()" +
//                     "(" + output + ")";
//             } else {
//                 output = "[][" + encode("flat") + "]" +
//                     "[" + encode("constructor") + "]" +
//                     "(" + output + ")()";
//             }
//         }

//         return output;
//     }

//     fillMissingDigits();
//     replaceMap();
//     replaceStrings();

//     window.JSFuck = {
//         encode: encode
//     };
// })();

// function meyerDiff(seq1, seq2) {
//     var N = seq1.length, M = seq2.length, MAX = N + M, furthestReaching = [], D, k, x, y, step, src = [], target = [], stepMap = [], dist = MAX, a;
//     for (; dist--;)stepMap[dist] = [];
//     furthestReaching[MAX + 1] = 0;
//     for (D = 0; D <= MAX && dist === -1; D++) {
//         for (k = -D, x, y, step; k <= D && dist === -1; k += 2) {
//             if (k === -D || (k !== D && furthestReaching[k - 1 + MAX] < furthestReaching[k + 1 + MAX])) x = furthestReaching[k + 1 + MAX], step = 3;
//             else x = furthestReaching[k - 1 + MAX] + 1, step = 2;
//             y = x - k;
//             stepMap[x][y] = step;
//             while (x < N && y < M && seq1[x] === seq2[y]) x++, y++, stepMap[x][y] = 0;
//             furthestReaching[k + MAX] = x;
//             if (x >= N && y >= M) dist = D;
//         }
//     }
//     for (; N || M;) {
//         a = stepMap[N][M]; src.unshift(a > 2 ? -1 : seq1[N - 1]); target.unshift(a == 2 ? -1 : seq2[M - 1]); a < 3 && N--; a != 2 && M--;
//     }
//     return [src, target]
// }
