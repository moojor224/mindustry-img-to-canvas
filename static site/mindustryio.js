(() => {
    var t,
        e,
        r = {
            823: (t, e, r) => {
                const { err: o, capitalize: a } = r(398),
                    i = [
                        "item",
                        "block",
                        "mech_UNUSED",
                        "bullet",
                        "liquid",
                        "status",
                        "unit",
                        "weather",
                        "effect_UNUSED",
                        "sector",
                        "loadout_UNUSED",
                        "typeid_UNUSED",
                        "error",
                        "planet",
                        "ammo",
                    ],
                    s = {
                        Block: [
                            "air",
                            "spawn",
                            "cliff",
                            "deepwater",
                            "water",
                            "taintedWater",
                            "tar",
                            "slag",
                            "stone",
                            "craters",
                            "charr",
                            "sand",
                            "darksand",
                            "dirt",
                            "mud",
                            "ice",
                            "snow",
                            "darksandTaintedWater",
                            "space",
                            "dacite",
                            "stoneWall",
                            "dirtWall",
                            "sporeWall",
                            "iceWall",
                            "daciteWall",
                            "sporePine",
                            "snowPine",
                            "pine",
                            "shrubs",
                            "whiteTree",
                            "whiteTreeDead",
                            "sporeCluster",
                            "iceSnow",
                            "sandWater",
                            "darksandWater",
                            "duneWall",
                            "sandWall",
                            "moss",
                            "sporeMoss",
                            "shale",
                            "shaleWall",
                            "shaleBoulder",
                            "sandBoulder",
                            "daciteBoulder",
                            "boulder",
                            "snowBoulder",
                            "basaltBoulder",
                            "grass",
                            "salt",
                            "metalFloor",
                            "metalFloorDamaged",
                            "metalFloor2",
                            "metalFloor3",
                            "metalFloor5",
                            "basalt",
                            "magmarock",
                            "hotrock",
                            "snowWall",
                            "saltWall",
                            "darkPanel1",
                            "darkPanel2",
                            "darkPanel3",
                            "darkPanel4",
                            "darkPanel5",
                            "darkPanel6",
                            "darkMetal",
                            "pebbles",
                            "tendrils",
                            "oreCopper",
                            "oreLead",
                            "oreScrap",
                            "oreCoal",
                            "oreTitanium",
                            "oreThorium",
                            "siliconSmelter",
                            "siliconCrucible",
                            "kiln",
                            "graphitePress",
                            "plastaniumCompressor",
                            "multiPress",
                            "phaseWeaver",
                            "surgeSmelter",
                            "pyratiteMixer",
                            "blastMixer",
                            "cryofluidMixer",
                            "melter",
                            "separator",
                            "disassembler",
                            "sporePress",
                            "pulverizer",
                            "incinerator",
                            "coalCentrifuge",
                            "powerSource",
                            "powerVoid",
                            "itemSource",
                            "itemVoid",
                            "liquidSource",
                            "liquidVoid",
                            "illuminator",
                            "copperWall",
                            "copperWallLarge",
                            "titaniumWall",
                            "titaniumWallLarge",
                            "plastaniumWall",
                            "plastaniumWallLarge",
                            "thoriumWall",
                            "thoriumWallLarge",
                            "door",
                            "doorLarge",
                            "phaseWall",
                            "phaseWallLarge",
                            "surgeWall",
                            "surgeWallLarge",
                            "mender",
                            "mendProjector",
                            "overdriveProjector",
                            "overdriveDome",
                            "forceProjector",
                            "shockMine",
                            "scrapWall",
                            "scrapWallLarge",
                            "scrapWallHuge",
                            "scrapWallGigantic",
                            "thruster",
                            "conveyor",
                            "titaniumConveyor",
                            "plastaniumConveyor",
                            "armoredConveyor",
                            "distributor",
                            "junction",
                            "itemBridge",
                            "phaseConveyor",
                            "sorter",
                            "invertedSorter",
                            "router",
                            "overflowGate",
                            "underflowGate",
                            "massDriver",
                            "payloadConveyor",
                            "payloadRouter",
                            "mechanicalPump",
                            "rotaryPump",
                            "thermalPump",
                            "conduit",
                            "pulseConduit",
                            "platedConduit",
                            "liquidRouter",
                            "liquidTank",
                            "liquidJunction",
                            "bridgeConduit",
                            "phaseConduit",
                            "combustionGenerator",
                            "thermalGenerator",
                            "steamGenerator",
                            "differentialGenerator",
                            "rtgGenerator",
                            "solarPanel",
                            "largeSolarPanel",
                            "thoriumReactor",
                            "impactReactor",
                            "battery",
                            "batteryLarge",
                            "powerNode",
                            "powerNodeLarge",
                            "surgeTower",
                            "diode",
                            "mechanicalDrill",
                            "pneumaticDrill",
                            "laserDrill",
                            "blastDrill",
                            "waterExtractor",
                            "oilExtractor",
                            "cultivator",
                            "coreShard",
                            "coreFoundation",
                            "coreNucleus",
                            "vault",
                            "container",
                            "unloader",
                            "duo",
                            "scatter",
                            "scorch",
                            "hail",
                            "arc",
                            "wave",
                            "lancer",
                            "swarmer",
                            "salvo",
                            "fuse",
                            "ripple",
                            "cyclone",
                            "foreshadow",
                            "spectre",
                            "meltdown",
                            "segment",
                            "parallax",
                            "tsunami",
                            "commandCenter",
                            "groundFactory",
                            "airFactory",
                            "navalFactory",
                            "additiveReconstructor",
                            "multiplicativeReconstructor",
                            "exponentialReconstructor",
                            "tetrativeReconstructor",
                            "repairPoint",
                            "resupplyPoint",
                            "message",
                            "switchBlock",
                            "microProcessor",
                            "logicProcessor",
                            "hyperProcessor",
                            "largeLogicDisplay",
                            "logicDisplay",
                            "memoryCell",
                            "memoryBank",
                            "launchPad",
                            "launchPadLarge",
                            "interplanetaryAccelerator",
                            "blockForge",
                            "blockLoader",
                            "blockUnloader",
                        ],
                        Item: [
                            "scrap",
                            "copper",
                            "lead",
                            "graphite",
                            "coal",
                            "titanium",
                            "thorium",
                            "silicon",
                            "plastanium",
                            "phaseFabric",
                            "surgeAlloy",
                            "sporePod",
                            "sand",
                            "blastCompound",
                            "pyratite",
                            "metaglass",
                        ],
                        Liquid: ["water", "slag", "oil", "cryofluid"],
                        Unit: [
                            "mace",
                            "dagger",
                            "crawler",
                            "fortress",
                            "scepter",
                            "reign",
                            "nova",
                            "pulsar",
                            "quasar",
                            "vela",
                            "corvus",
                            "atrax",
                            "spiroct",
                            "arkyid",
                            "toxopid",
                            "flare",
                            "eclipse",
                            "horizon",
                            "zenith",
                            "antumbra",
                            "mono",
                            "poly",
                            "mega",
                            "quad",
                            "oct",
                            "alpha",
                            "beta",
                            "gamma",
                            "risso",
                            "minke",
                            "bryde",
                            "sei",
                            "omura",
                            "block",
                        ],
                        Bullet: [
                            "artilleryDense",
                            "artilleryPlastic",
                            "artilleryPlasticFrag",
                            "artilleryHoming",
                            "artilleryIncendiary",
                            "artilleryExplosive",
                            "flakScrap",
                            "flakLead",
                            "flakGlass",
                            "flakGlassFrag",
                            "fragGlass",
                            "fragExplosive",
                            "fragPlastic",
                            "fragSurge",
                            "fragGlassFrag",
                            "fragPlasticFrag",
                            "missileExplosive",
                            "missileIncendiary",
                            "missileSurge",
                            "standardCopper",
                            "standardDense",
                            "standardThorium",
                            "standardHoming",
                            "standardIncendiary",
                            "standardDenseBig",
                            "standardThoriumBig",
                            "standardIncendiaryBig",
                            "waterShot",
                            "cryoShot",
                            "slagShot",
                            "oilShot",
                            "heavyWaterShot",
                            "heavyCryoShot",
                            "heavySlagShot",
                            "heavyOilShot",
                            "damageLightning",
                            "damageLightningGround",
                            "fireball",
                            "basicFlame",
                            "pyraFlame",
                            "driverBolt",
                        ],
                    };
                class n {
                    constructor(t, e) {
                        (this.type = t), (this.name = e);
                    }
                    get typeId() {
                        return i.indexOf(this.type.toLowerCase());
                    }
                    get id() {
                        return s[this.type].indexOf(this.name);
                    }
                }
                t.exports = {
                    ContentType: i,
                    Content: n,
                    content: s,
                    getByName: function (t, e) {
                        "number" != typeof t || isNaN(t) || (t = i[t]);
                        const r = s[a(t)];
                        if (!r) throw "content doesnt exist";
                        return r[e] ? new n(a(t), r[e]) : null;
                    },
                };
            },
            173: (t, e, r) => {
                const {
                    Reader: o,
                    Writer: a,
                    TypeIO: i,
                    Position: s,
                    capitalize: n,
                } = r(126),
                    l = Buffer.from("msch");
                class c {
                    constructor(t = {}) {
                        (this.block = "air"),
                            (this.position = new s(0)),
                            (this.config = null),
                            (this.rotation = 0),
                            Object.assign(this, t);
                        const e = this;
                        for (let t of ["block", "position", "config", "rotation"]) {
                            const r = n(t);
                            (this["get" + r] = () => e[t]),
                                (this["set" + r] = (r) => (e[t] = r));
                        }
                    }
                }
                t.exports = class {
                    constructor(t) {
                        if ((this.reset(), !t)) return this;
                        const e = new o(t);
                        if (!e.raw(4).equals(l)) throw "Incorrect header";
                        if (1 !== e.byte()) throw "Unsupported schematic version";
                        const r = new o(zlib.inflateSync(t.slice(5)));
                        (this.width = r.short()), (this.height = r.short());
                        const a = r.byte();
                        for (let t = 0; t < a; t++) this.tags[r.string()] = r.string();
                        const n = [],
                            u = r.byte();
                        for (let t = 0; t < u; t++) n.push(r.string());
                        const h = r.int();
                        for (let t = 0; t < h; t++) {
                            const t = n[r.byte()],
                                e = new s(r.int()),
                                o = i.read(r),
                                a = r.byte();
                            if ("air" === t) continue;
                            const l = new c({
                                block: t,
                                position: e,
                                config: o,
                                rotation: a,
                            });
                            this.tiles.push(new c(l));
                        }
                    }
                    resize(t, e) {
                        (this.height = t), (this.width = e);
                    }
                    tile(t, e) {
                        if (t < 0 || e < 0 || t >= this.width || e >= this.height)
                            throw "out of bounds, resize schematic first!";
                        for (let r of this.tiles)
                            if (r.position.x === t && r.position.y === e) return r;
                        const r = new c({ position: new s({ x: t, y: e }) });
                        return this.tiles.push(r), r;
                    }
                    delete(t, e) {
                        let r = -1;
                        for (let o = 0; o < this.tiles.length; o++) {
                            const a = this.tiles[o].position;
                            a.x === t && a.y === e && (r = o);
                        }
                        r >= 0 && this.tiles.splice(r, 1);
                    }
                    each(t) {
                        this.tiles.forEach(t);
                    }
                    toBuffer() {
                        const t = new a();
                        t.short(this.width),
                            t.short(this.height),
                            t.byte(Object.keys(this.tags).length);
                        for (let e in this.tags) t.string(e), t.string(this.tags[e]);
                        const e = this.tiles.reduce(
                            (t, e) => (t.includes(e.block) || t.push(e.block), t),
                            []
                        );
                        t.byte(e.length),
                            e.forEach((e) => t.string(e)),
                            t.int(this.tiles.length);
                        for (let r of this.tiles)
                            t.byte(e.indexOf(r.block)),
                                t.int(r.position.pack()),
                                i.write(t, r.config),
                                t.byte(r.rotation);
                        return Buffer.concat([
                            l,
                            Buffer.from(""),
                            zlib.deflate(t.toBuffer()),
                        ]);
                    }
                    toString() {
                        this.tags.name;
                    }
                    reset() {
                        (this.width = 0),
                            (this.height = 0),
                            (this.tags = {}),
                            (this.tiles = []);
                    }
                };
            },
            901: (t, e, r) => {
                t.exports = { Schematic: r(173) };
            },
            126: (t, e, r) => {
                t.exports = { ...r(305), ...r(398), TypeIO: r(199) };
            },
            305: (t) => {
                t.exports = {
                    Reader: class {
                        constructor(t) {
                            (this.buffer = t), (this.offset = 0);
                        }
                        raw(t) {
                            const e = this.offset;
                            return (this.offset += t), this.buffer.slice(e, this.offset);
                        }
                        byte() {
                            return this.raw(1).readInt8();
                        }
                        short() {
                            return this.raw(2).readInt16BE();
                        }
                        int() {
                            return this.raw(4).readInt32BE();
                        }
                        long() {
                            return this.raw(8).readBigInt64BE();
                        }
                        float() {
                            return this.raw(4).readFloatBE();
                        }
                        string() {
                            const t = this.short();
                            return this.raw(t).toString("utf8");
                        }
                    },
                    Writer: class {
                        constructor() {
                            this.parts = [];
                        }
                        write(t, e, r) {
                            const o = Buffer.alloc(t);
                            o[e](r), this.parts.push(o);
                        }
                        raw(t) {
                            const e = Buffer.from(t);
                            this.parts.push(e);
                        }
                        byte(t) {
                            this.write(1, "writeInt8", t);
                        }
                        short(t) {
                            this.write(2, "writeInt16BE", t);
                        }
                        int(t) {
                            this.write(4, "writeInt32BE", t);
                        }
                        long(t) {
                            this.write(8, "writeBigInt64BE", t);
                        }
                        float(t) {
                            this.write(4, "writeFloatBE", t);
                        }
                        string(t) {
                            this.short(t.length), this.raw(t);
                        }
                        toBuffer() {
                            return Buffer.concat(this.parts);
                        }
                    },
                };
            },
            398: (t) => {
                const e = 65536;
                t.exports = {
                    Position: class {
                        constructor(t = 0) {
                            "object" == typeof t && t
                                ? ((this.x = t.x), (this.y = t.y))
                                : ((this.x = Math.floor(t / e)), (this.y = t % e));
                        }
                        pack() {
                            return this.x * e + this.y;
                        }
                    },
                    overflow: e,
                    err: function (t) {
                        throw new Error(t);
                    },
                    capitalize: function (t) {
                        return t[0].toUpperCase() + t.slice(1).toLowerCase();
                    },
                };
            },
            199: (t, e, r) => {
                const { err: o, overflow: a, Position: i } = r(398),
                    { getByName: s, Content: n } = r(823);
                t.exports = {
                    read: function (t) {
                        const e = t.byte();
                        switch (e) {
                            case 0:
                                return null;
                            case 1:
                                return t.int();
                            case 2:
                                return t.long();
                            case 3:
                                return t.float();
                            case 4:
                                return 0 === t.byte() ? null : t.string();
                            case 5:
                                return s(t.byte(), t.short());
                            case 6:
                                const r = t.short(),
                                    o = [];
                                for (let e = 0; e < r; e++) o.push(t.int());
                                return o;
                            case 7:
                                return new i({ x: t.int(), y: t.int() });
                            case 8:
                                const a = t.byte(),
                                    n = [];
                                for (let e = 0; e < a; e++) n.push(new i(t.int()));
                                return n;
                            case 14:
                                const l = t.int();
                                return t.raw(l);
                            case 15:
                                return ["attack", "rally", "idle"][t.byte()];
                            default:
                                throw `Unknown object type: ${e}`;
                        }
                    },
                    write: function (t, e) {
                        if (null === e) t.byte(0);
                        else if ("number" != typeof e || isNaN(e))
                            if ("string" == typeof e) {
                                if ((t.byte(4), !e.length)) return t.byte(0);
                                t.byte(1), t.string(e);
                            } else if (e instanceof n)
                                t.byte(5), t.byte(e.typeId), t.short(e.id);
                            else if (e instanceof Array)
                                if (e[0] instanceof i) {
                                    t.byte(8), t.byte(e.length);
                                    for (let r of e) t.int(r.pack());
                                } else {
                                    t.byte(6), t.short(e.length);
                                    for (let r of e) t.int(r);
                                }
                            else if (e instanceof i) t.byte(7), t.int(e.x), t.int(e.y);
                            else {
                                if (!(e instanceof Buffer)) throw "can't pack";
                                t.byte(14), t.int(e.length), t.raw(e);
                            }
                        else
                            Number.isInteger(e)
                                ? e > a
                                    ? (t.byte(2), t.long(e))
                                    : (t.byte(1), t.int(e))
                                : (t.byte(3), t.float(e));
                    },
                };
            },
        },
        o = {};
    function a(t) {
        var e = o[t];
        if (void 0 !== e) return e.exports;
        var i = (o[t] = { exports: {} });
        return r[t](i, i.exports, a), i.exports;
    }
    (e = Object.getPrototypeOf
        ? (t) => Object.getPrototypeOf(t)
        : (t) => t.__proto__),
        (a.t = function (r, o) {
            if ((1 & o && (r = this(r)), 8 & o)) return r;
            if ("object" == typeof r && r) {
                if (4 & o && r.__esModule) return r;
                if (16 & o && "function" == typeof r.then) return r;
            }
            var i = Object.create(null);
            a.r(i);
            var s = {};
            t = t || [null, e({}), e([]), e(e)];
            for (var n = 2 & o && r; "object" == typeof n && !~t.indexOf(n); n = e(n))
                Object.getOwnPropertyNames(n).forEach((t) => (s[t] = () => r[t]));
            return (s.default = () => r), a.d(i, s), i;
        }),
        (a.d = (t, e) => {
            for (var r in e)
                a.o(e, r) &&
                    !a.o(t, r) &&
                    Object.defineProperty(t, r, { enumerable: !0, get: e[r] });
        }),
        (a.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e)),
        (a.r = (t) => {
            "undefined" != typeof Symbol &&
                Symbol.toStringTag &&
                Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
                Object.defineProperty(t, "__esModule", { value: !0 });
        }),
        (() => {
            "use strict";
            var t,
                e = a(901);
            window.mindustryio = t || (t = a.t(e, 2));
        })();
})();
