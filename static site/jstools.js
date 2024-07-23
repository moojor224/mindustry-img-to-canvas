function createElement(tag, data = {}) {
    tag = typeof tag === "string" ? document.createElement(tag) : tag;
    Object.keys(data).forEach((e) => {
        if (typeof data[e] === "object") {
            createElement(tag[e] || (tag[e] = {}), data[e]);
        } else {
            if (tag instanceof window.Element) {
                if (e.substring(0, 2) == "on" && typeof data[e] == "function") {
                    tag.addEventListener(e.substring(2), data[e]);
                } else {
                    tag[e] = data[e];
                }
            } else {
                tag[e] = data[e];
            }
        }
    });
    return tag;
}

function add(...args) {
    args.forEach(elem => {
        this.append(elem);
    });
    return this;
};
if (window.Element.prototype.add === undefined) {
    window.Element.prototype.add = add;
}

Object.getOwnPropertyNames(window).filter(e => e.startsWith("HTML") && e.endsWith("Element")).forEach(e => {
    if (window[e].prototype.add !== add) {
        window[e].prototype.add = add
    }
});

function disable(...selectors) {
    for (let s of selectors) (typeof s == "string" ? document.querySelector(s) : s).setAttribute("disabled", true);
}

function enable(...selectors) {
    for (let s of selectors) (typeof s == "string" ? document.querySelector(s) : s).removeAttribute("disabled");
}