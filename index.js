// constants
const MAX_SEMITONES = 12;
const FORTE = Symbol("forte");
const RAHN = Symbol("rahn");

// normal order
function getNormalOrder(pcs) {
    pcs = transposeAndSort(pcs);

    let minRange = MAX_SEMITONES;
    let order = pcs;
    for (let i = 0; i < pcs.length; i++) {
        let rotation = rotate(pcs, i);

        let first = rotation[0];
        rotation = rotation.map(pc => mod12(pc - first));

        let range = rotation.at(-1) - rotation.at(0);

        if (range < minRange) {
            order = rotation;
            minRange = range;
        } else if (range === minRange) {
            order = tiebreak(order, rotation, packingType);
        }
    }

    return order;
}

function transposeAndSort(pcs) {
    let first = pcs[0];
    pcs = pcs.map(pc => mod12(pc - first));
    return pcs.sort((a, b) => a - b);
}

function mod12(pc) {
    return ((pc % 12) + 12) % 12;
}

function rotate(arr, i) {
    return arr.slice(i).concat(arr.slice(0, i));
}

function tiebreak(oldSet, newSet, type) {
    if (type === FORTE) {
        for (let i = 0; i < oldSet.length; i++) {
            if (oldSet[i] < newSet[i]) {
                return oldSet;
            } else if (oldSet[i] > newSet[i]) {
                return newSet;
            }
        }
    } else if (type === RAHN) {
        for (let i = oldSet.length - 1; i >= 0; i--) {
            if (oldSet[i] < newSet[i]) {
                return oldSet;
            } else if (oldSet[i] > newSet[i]) {
                return newSet;
            }
        }
    }
    return oldSet;
}

// prime form
function getPrimeForm(pcs) {
    pcs = transposeAndSort(pcs);
    let pcsr = transposeAndSort(invert([...pcs]));

    return tiebreak(getNormalOrder(pcs), getNormalOrder(pcsr), packingType);
}

function invert(pcs) {
    return pcs.map(pc => mod12(-pc));
}

// ic vector
function getICVector(pcs) {
    let icVector = [0, 0, 0, 0, 0, 0];
    let primeForm = getPrimeForm(pcs);

    for (let i = 0; i < primeForm.length - 1; i++) {
        for (let j = i + 1; j < primeForm.length; j++) {
            let ic = getIC(primeForm[j] - primeForm[i]);
            icVector[ic - 1]++;
        }
    }

    return icVector;
}

function getIC(interval) {
    interval = mod12(interval);
    if (interval === 0) throw new Error("Interval must be non zero");
    return interval <= 6 ? interval : 12 - interval;
}

// complement
function getComplement(pcs) {
    let complement = [];

    for (let pc = 0; pc < MAX_SEMITONES; pc++) {
        if (!pcs.includes(pc)) {
            complement.push(pc);
        }
    }

    return complement;
}

// forte number
function getForteNumber(pcs) {
    return primeToForte.has(getPrimeForm(pcs).join(", ")) ?
        primeToForte.get(getPrimeForm(pcs).join(", ")) :
        "None";
}

const primeToForte = new Map([
    ["", "0-1"],
    ["0", "1-1"],
    ["0, 1", "2-1"],
    ["0, 2", "2-2"],
    ["0, 3", "2-3"],
    ["0, 4", "2-4"],
    ["0, 5", "2-5"],
    ["0, 6", "2-6"],

    // cardinality 3 (12 total prime forms)
    ["0, 1, 2", "3-1"],
    ["0, 1, 3", "3-2"],
    ["0, 1, 4", "3-3"],
    ["0, 1, 5", "3-4"],
    ["0, 1, 6", "3-5"],
    ["0, 2, 4", "3-6"],
    ["0, 2, 5", "3-7"],
    ["0, 2, 6", "3-8"],
    ["0, 2, 7", "3-9"],
    ["0, 3, 6", "3-10"],
    ["0, 3, 7", "3-11"],
    ["0, 4, 8", "3-12"],

    // cardinality 4 (29 total prime forms)
    ["0, 1, 2, 3", "4-1"],
    ["0, 1, 2, 4", "4-2"],
    ["0, 1, 3, 4", "4-3"],
    ["0, 1, 2, 5", "4-4"],
    ["0, 1, 2, 6", "4-5"],
    ["0, 1, 2, 7", "4-6"],
    ["0, 1, 4, 5", "4-7"],
    ["0, 1, 5, 6", "4-8"],
    ["0, 1, 6, 7", "4-9"],
    ["0, 2, 3, 5", "4-10"],
    ["0, 1, 3, 5", "4-11"],
    ["0, 2, 3, 6", "4-12"],
    ["0, 1, 3, 6", "4-13"],
    ["0, 2, 3, 7", "4-14"],
    ["0, 1, 4, 6", "4-Z15"],
    ["0, 1, 5, 7", "4-16"],
    ["0, 3, 4, 7", "4-17"],
    ["0, 1, 4, 7", "4-18"],
    ["0, 1, 4, 8", "4-19"],
    ["0, 1, 5, 8", "4-20"],
    ["0, 2, 4, 6", "4-21"],
    ["0, 2, 4, 7", "4-22"],
    ["0, 2, 5, 7", "4-23"],
    ["0, 2, 4, 8", "4-24"],
    ["0, 2, 6, 8", "4-25"],
    ["0, 3, 5, 8", "4-26"],
    ["0, 2, 5, 8", "4-27"],
    ["0, 3, 6, 9", "4-28"],
    ["0, 1, 3, 7", "4-Z29"],

    // cardinality 5 (38 total prime forms)
    ["0, 1, 2, 3, 4", "5-1"],
    ["0, 1, 2, 3, 5", "5-2"],
    ["0, 1, 2, 4, 5", "5-3"],
    ["0, 1, 2, 3, 6", "5-4"],
    ["0, 1, 2, 3, 7", "5-5"],
    ["0, 1, 2, 5, 6", "5-6"],
    ["0, 1, 2, 6, 7", "5-7"],
    ["0, 2, 3, 4, 6", "5-8"],
    ["0, 1, 2, 4, 6", "5-9"],
    ["0, 1, 3, 4, 6", "5-10"],
    ["0, 2, 3, 4, 7", "5-11"],
    ["0, 1, 3, 5, 6", "5-Z12"],
    ["0, 1, 2, 4, 8", "5-13"],
    ["0, 1, 2, 5, 7", "5-14"],
    ["0, 1, 2, 6, 8", "5-15"],
    ["0, 1, 3, 4, 7", "5-16"],
    ["0, 1, 3, 4, 8", "5-Z17"],
    ["0, 1, 4, 5, 7", "5-Z18"],
    ["0, 1, 3, 6, 7", "5-19"],
    ["0, 1, 5, 6, 8", "5-20"], // Rahn: "0, 1, 5, 6, 8", "5-20"
    ["0, 1, 3, 7, 8", "5-20"], // Forte: "0, 1, 3, 7, 8", "5-20"
    ["0, 1, 4, 5, 8", "5-21"],
    ["0, 1, 4, 7, 8", "5-22"],
    ["0, 2, 3, 5, 7", "5-23"],
    ["0, 1, 3, 5, 7", "5-24"],
    ["0, 2, 3, 5, 8", "5-25"],
    ["0, 2, 4, 5, 8", "5-26"],
    ["0, 1, 3, 5, 8", "5-27"],
    ["0, 2, 3, 6, 8", "5-28"],
    ["0, 1, 3, 6, 8", "5-29"],
    ["0, 1, 4, 6, 8", "5-30"],
    ["0, 1, 3, 6, 9", "5-31"],
    ["0, 1, 4, 6, 9", "5-32"],
    ["0, 2, 4, 6, 8", "5-33"],
    ["0, 2, 4, 6, 9", "5-34"],
    ["0, 2, 4, 7, 9", "5-35"],
    ["0, 1, 2, 4, 7", "5-Z36"],
    ["0, 3, 4, 5, 8", "5-Z37"],
    ["0, 1, 2, 5, 8", "5-Z38"],

    // cardinality 6 (50 total prime forms)
    ["0, 1, 2, 3, 4, 5", "6-1"],
    ["0, 1, 2, 3, 4, 6", "6-2"],
    ["0, 1, 2, 3, 5, 6", "6-Z3"],
    ["0, 1, 2, 4, 5, 6", "6-Z4"],
    ["0, 1, 2, 3, 6, 7", "6-5"],
    ["0, 1, 2, 5, 6, 7", "6-Z6"],
    ["0, 1, 2, 6, 7, 8", "6-7"],
    ["0, 2, 3, 4, 5, 7", "6-8"],
    ["0, 1, 2, 3, 5, 7", "6-9"],
    ["0, 1, 3, 4, 5, 7", "6-Z10"],
    ["0, 1, 2, 4, 5, 7", "6-Z11"],
    ["0, 1, 2, 4, 6, 7", "6-Z12"],
    ["0, 1, 3, 4, 6, 7", "6-Z13"],
    ["0, 1, 3, 4, 5, 8", "6-14"],
    ["0, 1, 2, 4, 5, 8", "6-15"],
    ["0, 1, 4, 5, 6, 8", "6-16"],
    ["0, 1, 2, 4, 7, 8", "6-Z17"],
    ["0, 1, 2, 5, 7, 8", "6-18"],
    ["0, 1, 3, 4, 7, 8", "6-Z19"],
    ["0, 1, 4, 5, 8, 9", "6-20"],
    ["0, 2, 3, 4, 6, 8", "6-21"],
    ["0, 1, 2, 4, 6, 8", "6-22"],
    ["0, 2, 3, 5, 6, 8", "6-Z23"],
    ["0, 1, 3, 4, 6, 8", "6-Z24"],
    ["0, 1, 3, 5, 6, 8", "6-Z25"],
    ["0, 1, 3, 5, 7, 8", "6-Z26"],
    ["0, 1, 3, 4, 6, 9", "6-27"],
    ["0, 1, 3, 5, 6, 9", "6-Z28"],
    ["0, 2, 3, 6, 7, 9", "6-Z29"], // Rahn: "0, 2, 3, 6, 7, 9", "6-Z29"
    ["0, 1, 3, 6, 8, 9", "6-Z29"], // Forte: "0, 1, 3, 6, 8, 9", "6-Z29"
    ["0, 1, 3, 6, 7, 9", "6-30"],
    ["0, 1, 4, 5, 7, 9", "6-31"], // Rahn: "0, 1, 4, 5, 7, 9", "6-31"
    ["0, 1, 3, 5, 8, 9", "6-31"], // Forte: "0, 1, 3, 5, 8, 9", "6-31"
    ["0, 2, 4, 5, 7, 9", "6-32"],
    ["0, 2, 3, 5, 7, 9", "6-33"],
    ["0, 1, 3, 5, 7, 9", "6-34"],
    ["0, 2, 4, 6, 8, 10", "6-35"],
    ["0, 1, 2, 3, 4, 7", "6-Z36"],
    ["0, 1, 2, 3, 4, 8", "6-Z37"],
    ["0, 1, 2, 3, 7, 8", "6-Z38"],
    ["0, 2, 3, 4, 5, 8", "6-Z39"],
    ["0, 1, 2, 3, 5, 8", "6-Z40"],
    ["0, 1, 2, 3, 6, 8", "6-Z41"],
    ["0, 1, 2, 3, 6, 9", "6-Z42"],
    ["0, 1, 2, 5, 6, 8", "6-Z43"],
    ["0, 1, 2, 5, 6, 9", "6-Z44"],
    ["0, 2, 3, 4, 6, 9", "6-Z45"],
    ["0, 1, 2, 4, 6, 9", "6-Z46"],
    ["0, 1, 2, 4, 7, 9", "6-Z47"],
    ["0, 1, 2, 5, 7, 9", "6-Z48"],
    ["0, 1, 3, 4, 7, 9", "6-Z49"],
    ["0, 1, 4, 6, 7, 9", "6-Z50"],

    // cardinality 7 (38 total prime forms)
    ["0, 1, 2, 3, 4, 5, 6", "7-1"],
    ["0, 1, 2, 3, 4, 5, 7", "7-2"],
    ["0, 1, 2, 3, 4, 5, 8", "7-3"],
    ["0, 1, 2, 3, 4, 6, 7", "7-4"],
    ["0, 1, 2, 3, 5, 6, 7", "7-5"],
    ["0, 1, 2, 3, 4, 7, 8", "7-6"],
    ["0, 1, 2, 3, 6, 7, 8", "7-7"],
    ["0, 2, 3, 4, 5, 6, 8", "7-8"],
    ["0, 1, 2, 3, 4, 6, 8", "7-9"],
    ["0, 1, 2, 3, 4, 6, 9", "7-10"],
    ["0, 1, 3, 4, 5, 6, 8", "7-11"],
    ["0, 1, 2, 3, 4, 7, 9", "7-Z12"],
    ["0, 1, 2, 4, 5, 6, 8", "7-13"],
    ["0, 1, 2, 3, 5, 7, 8", "7-14"],
    ["0, 1, 2, 4, 6, 7, 8", "7-15"],
    ["0, 1, 2, 3, 5, 6, 9", "7-16"],
    ["0, 1, 2, 4, 5, 6, 9", "7-Z17"],
    ["0, 1, 4, 5, 6, 7, 9", "7-Z18"], // Rahn: "0, 1, 4, 5, 6, 7, 9", "7-Z18"
    ["0, 1, 2, 3, 5, 8, 9", "7-Z18"], // Forte: "0, 1, 2, 3, 5, 8, 9", "7-Z18"
    ["0, 1, 2, 3, 6, 7, 9", "7-19"],
    ["0, 1, 2, 5, 6, 7, 9", "7-20"], // Rahn: "0, 1, 2, 5, 6, 7, 9", "7-20"
    ["0, 1, 2, 4, 7, 8, 9", "7-20"], // Forte: "0, 1, 2, 4, 7, 8, 9", "7-20"
    ["0, 1, 2, 4, 5, 8, 9", "7-21"],
    ["0, 1, 2, 5, 6, 8, 9", "7-22"],
    ["0, 2, 3, 4, 5, 7, 9", "7-23"],
    ["0, 1, 2, 3, 5, 7, 9", "7-24"],
    ["0, 2, 3, 4, 6, 7, 9", "7-25"],
    ["0, 1, 3, 4, 5, 7, 9", "7-26"],
    ["0, 1, 2, 4, 5, 7, 9", "7-27"],
    ["0, 1, 3, 5, 6, 7, 9", "7-28"],
    ["0, 1, 2, 4, 6, 7, 9", "7-29"],
    ["0, 1, 2, 4, 6, 8, 9", "7-30"],
    ["0, 1, 3, 4, 6, 7, 9", "7-31"],
    ["0, 1, 3, 4, 6, 8, 9", "7-32"],
    ["0, 1, 2, 4, 6, 8, 10", "7-33"],
    ["0, 1, 3, 4, 6, 8, 10", "7-34"],
    ["0, 1, 3, 5, 6, 8, 10", "7-35"],
    ["0, 1, 2, 3, 5, 6, 8", "7-Z36"],
    ["0, 1, 3, 4, 5, 7, 8", "7-Z37"],
    ["0, 1, 2, 4, 5, 7, 8", "7-Z38"],

    // cardinality 8 (29 total IC vectors)
    ["0, 1, 2, 3, 4, 5, 6, 7", "8-1"],
    ["0, 1, 2, 3, 4, 5, 6, 8", "8-2"],
    ["0, 1, 2, 3, 4, 5, 6, 9", "8-3"],
    ["0, 1, 2, 3, 4, 5, 7, 8", "8-4"],
    ["0, 1, 2, 3, 4, 6, 7, 8", "8-5"],
    ["0, 1, 2, 3, 5, 6, 7, 8", "8-6"],
    ["0, 1, 2, 3, 4, 5, 8, 9", "8-7"],
    ["0, 1, 2, 3, 4, 7, 8, 9", "8-8"],
    ["0, 1, 2, 3, 6, 7, 8, 9", "8-9"],
    ["0, 2, 3, 4, 5, 6, 7, 9", "8-10"],
    ["0, 1, 2, 3, 4, 5, 7, 9", "8-11"],
    ["0, 1, 3, 4, 5, 6, 7, 9", "8-12"],
    ["0, 1, 2, 3, 4, 6, 7, 9", "8-13"],
    ["0, 1, 2, 4, 5, 6, 7, 9", "8-14"],
    ["0, 1, 2, 3, 4, 6, 8, 9", "8-Z15"],
    ["0, 1, 2, 3, 5, 7, 8, 9", "8-16"],
    ["0, 1, 3, 4, 5, 6, 8, 9", "8-17"],
    ["0, 1, 2, 3, 5, 6, 8, 9", "8-18"],
    ["0, 1, 2, 4, 5, 6, 8, 9", "8-19"],
    ["0, 1, 2, 4, 5, 7, 8, 9", "8-20"],
    ["0, 1, 2, 3, 4, 6, 8, 10", "8-21"],
    ["0, 1, 2, 3, 5, 6, 8, 10", "8-22"],
    ["0, 1, 2, 3, 5, 7, 8, 10", "8-23"],
    ["0, 1, 2, 4, 5, 6, 8, 10", "8-24"],
    ["0, 1, 2, 4, 6, 7, 8, 10", "8-25"],
    ["0, 1, 3, 4, 5, 7, 8, 10", "8-26"], // Rahn: "0, 1, 3, 4, 5, 7, 8, 10", "8-26"
    ["0, 1, 2, 4, 5, 7, 9, 10", "8-26"], // Forte: "0, 1, 2, 4, 5, 7, 9, 10", "8-26"
    ["0, 1, 2, 4, 5, 7, 8, 10", "8-27"],
    ["0, 1, 3, 4, 6, 7, 9, 10", "8-28"],
    ["0, 1, 2, 3, 5, 6, 7, 9", "8-Z29"],

    // cardinality 9 (12 total prime forms)
    ["0, 1, 2, 3, 4, 5, 6, 7, 8", "9-1"],
    ["0, 1, 2, 3, 4, 5, 6, 7, 9", "9-2"],
    ["0, 1, 2, 3, 4, 5, 6, 8, 9", "9-3"],
    ["0, 1, 2, 3, 4, 5, 7, 8, 9", "9-4"],
    ["0, 1, 2, 3, 4, 6, 7, 8, 9", "9-5"],
    ["0, 1, 2, 3, 4, 5, 6, 8, 10", "9-6"],
    ["0, 1, 2, 3, 4, 5, 7, 8, 10", "9-7"],
    ["0, 1, 2, 3, 4, 6, 7, 8, 10", "9-8"],
    ["0, 1, 2, 3, 5, 6, 7, 8, 10", "9-9"],
    ["0, 1, 2, 3, 4, 6, 7, 9, 10", "9-10"],
    ["0, 1, 2, 3, 5, 6, 7, 9, 10", "9-11"],
    ["0, 1, 2, 4, 5, 6, 8, 9, 10", "9-12"],

    ["0, 1, 2, 3, 4, 5, 6, 7, 8, 9", "10-1"],
    ["0, 1, 2, 3, 4, 5, 6, 7, 8, 10", "10-2"],
    ["0, 1, 2, 3, 4, 5, 6, 7, 9, 10", "10-3"],
    ["0, 1, 2, 3, 4, 5, 6, 8, 9, 10", "10-4"],
    ["0, 1, 2, 3, 4, 5, 7, 8, 9, 10", "10-5"],
    ["0, 1, 2, 3, 4, 6, 7, 8, 9, 10", "10-6"],
    ["0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10", "11-1"],
    ["0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11", "12-1"]
]);

const forteToPrime = new Map([...primeToForte].map(([k, v]) => [v, k]));

// z sets
function getZMate() {
    return zSets.has(getForteNumber(pcs)) ?
        zSets.get(getForteNumber(pcs)) :
        "None";
}

const zSets = new Map([
    // cardinality 4 (1 total z-set)
    ["4-Z15", "4-Z29"],
    ["4-Z29", "4-Z15"],

    // cardinality 5 (3 total z-sets)
    ["5-Z12", "5-Z36"],
    ["5-Z36", "5-Z12"],
    ["5-Z17", "5-Z37"],
    ["5-Z37", "5-Z17"],
    ["5-Z18", "5-Z38"],
    ["5-Z38", "5-Z18"],

    // cardinality 6 (15 total z-sets)
    ["6-Z3", "6-Z36"],
    ["6-Z36", "6-Z3"],
    ["6-Z4", "6-Z37"],
    ["6-Z37", "6-Z4"],
    ["6-Z6", "6-Z38"],
    ["6-Z38", "6-Z6"],
    ["6-Z10", "6-Z39"],
    ["6-Z39", "6-Z10"],
    ["6-Z11", "6-Z40"],
    ["6-Z40", "6-Z11"],
    ["6-Z12", "6-Z41"],
    ["6-Z41", "6-Z12"],
    ["6-Z13", "6-Z42"],
    ["6-Z42", "6-Z13"],
    ["6-Z17", "6-Z43"],
    ["6-Z43", "6-Z17"],
    ["6-Z19", "6-Z44"],
    ["6-Z44", "6-Z19"],
    ["6-Z23", "6-Z45"],
    ["6-Z45", "6-Z23"],
    ["6-Z24", "6-Z46"],
    ["6-Z46", "6-Z24"],
    ["6-Z25", "6-Z47"],
    ["6-Z47", "6-Z25"],
    ["6-Z26", "6-Z48"],
    ["6-Z48", "6-Z26"],
    ["6-Z28", "6-Z49"],
    ["6-Z49", "6-Z28"],
    ["6-Z29", "6-Z50"],
    ["6-Z50", "6-Z29"],

    // cardinality 7 (3 total z-sets)
    ["7-Z12", "7-Z36"],
    ["7-Z36", "7-Z12"],
    ["7-Z17", "7-Z37"],
    ["7-Z37", "7-Z17"],
    ["7-Z18", "7-Z38"],
    ["7-Z38", "7-Z18"],

    // cardinality 8 (1 total z-set)
    ["8-Z15", "8-Z29"],
    ["8-Z29", "8-Z15"],
]);

// known chords
function tryMatchForKnown() {
    return forteToKnown.has(getForteNumber(pcs)) ?
        forteToKnown.get(getForteNumber(pcs)) :
        "";
}

const forteToKnown = new Map([
    ["3-8", "Italian 6th"],
    ["3-9", "Suspended Chord/Quartal Chord"],
    ["3-10", "Diminished Triad"],
    ["3-11", "Major/Minor Triad"],
    ["3-12", "Augmented Triad"],

    ["4-20", "Major 7th"],
    ["4-23", "Quartal Chord (4)"],
    ["4-25", "French 6th"],
    ["4-26", "Minor 7th"],
    ["4-27", "Dominant 7th/Half Diminished 7th"],
    ["4-28", "Diminished 7th"],

    ["5-35", "Pentatonic Scale"],
    ["6-35", "Whole Tone Scale"],
    ["7-35", "Major/Minor Scale"],
    ["8-28", "Octatonic Scale"],
]);

// transposition and inversion
function getTn(pcs, n) {
    return pcs.map(pc => mod12(pc + n));
}

function getTnI(pcs, n) {
    let T0I = invert(pcs).sort((a, b) => a - b);
    return T0I.map(pc => mod12(pc + n));
}

function handleTranspositionAndInversion() {
    if (!displayAll) {
        Tn_output.value = formatOutput(getTn(pcs, parseInt(Tn_select.value)), UNORDERED);
        TnI_output.value = formatOutput(getTnI(pcs, parseInt(TnI_select.value)), UNORDERED);
        return;
    }

    if (pcs.length === 0) {
        Tn_output.value = "[]";
        TnI_output.value = "[]";
        return;
    }

    Tn_output.value = [...Array(MAX_SEMITONES).keys()]
        .map(pc => textStart(pc) + formatOutput(getTn(pcs, pc), UNORDERED)).join("\n");
    TnI_output.value = [...Array(MAX_SEMITONES).keys()]
        .map(pc => textStart(pc) + formatOutput(getTnI(pcs, pc), UNORDERED)).join("\n");
}

function textStart(pc) {
    let spaces = "             ";
    return pc.toString().length === 1 ? spaces + ` n = ${pc}: ` : spaces + `n = ${pc}: `;
}

function resizeHeight(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
}









// TODO: forte number manual input
// TODO: add supersets and subsets
// TODO: add 'is subset of' options
// index.html
const output = document.getElementById("output");
const pc_checkboxes = document.getElementsByClassName("pc");
let pcs = [];
let packingType;

const normal_order = document.getElementById("normal-order");
const prime_form = document.getElementById("prime-form");
const ic_vector = document.getElementById("ic-vector");
const complement = document.getElementById("complement");
const forte_number = document.getElementById("forte-number");
const z_mate = document.getElementById("z-mate");
const known = document.getElementById("known");

const Tn_output = document.getElementById("Tn-output");
const TnI_output = document.getElementById("TnI-output");
const Tn_select = document.getElementById("Tn-select");
const TnI_select = document.getElementById("TnI-select");

const UNORDERED = Symbol("unordered");
const NORMAL_ORDER = Symbol("normal_order");
const PRIME_FORM = Symbol("prime_form");
const IC_VECTOR = Symbol("ic_vector");

function calculate(manualOn) {
    if (manualOn) {
        for (let checkbox of pc_checkboxes) {
            checkbox.checked = false;
        }
        pcs = parseManualInput();
        setCheckboxStates();
    } else {
        pcs = getAllPC();
    }
    pcs = pcs.sort((a, b) => a - b);
    savePCS();

    output.value = formatOutput(pcs, UNORDERED);

    normal_order.value = formatOutput(getNormalOrder(pcs), NORMAL_ORDER);
    prime_form.value = formatOutput(getPrimeForm(pcs), PRIME_FORM);
    ic_vector.value = formatOutput(getICVector(pcs), IC_VECTOR);
    complement.value = formatOutput(getComplement(pcs), UNORDERED);

    forte_number.value = getForteNumber(pcs);
    z_mate.value = getZMate(pcs);
    known.value = tryMatchForKnown(pcs);

    handleTranspositionAndInversion();
    resizeHeight(Tn_output);
    resizeHeight(TnI_output);
}

function getAllPC() {
    let pcs = [];
    for (let checkbox of pc_checkboxes) {
        if (checkbox.checked) {
            pcs.push(parseInt(checkbox.id));
        }
    }
    return pcs;
}

function savePCS() {
    if (useManualInput) localStorage.setItem("input-text", input.value);
    localStorage.setItem("pcs", pcs.join(","));
}

function formatOutput(pcs, formatting) {
    let formatted = "";
    if (formatting === NORMAL_ORDER || formatting === UNORDERED) {
        formatted = `[${pcs.join(", ")}]`;
    } else if (formatting === PRIME_FORM) {
        formatted = `(${pcs.join(" ")})`;
    } else if (formatting === IC_VECTOR) {
        formatted = `<${pcs.join(" ")}>`;
    } else {
        throw new Error("Unknown formatting " + formatting);
    }

    return useTAndE ?
        formatted.replaceAll("10", "T").replaceAll("11", "E") :
        formatted;
}

// button functions
function reset() {
    input.value = "";
    output.value = "";

    normal_order.value = "";
    prime_form.value = "";
    ic_vector.value = "";
    complement.value = "";

    forte_number.value = "";
    z_mate.value = "";
    known.value = "";

    Tn_output.value = "";
    TnI_output.value = "";
    resizeHeight(Tn_output);
    resizeHeight(TnI_output);

    resetHistory();

    for (let checkbox of pc_checkboxes) {
        checkbox.checked = false;
    }

    pcs = [];
    savePCS();
}

function switchToComplement() {
    for (let pc = 0; pc < MAX_SEMITONES; pc++) {
        toggle(pc);
        calculate(false);
    }
    resetHistory();
    calculate(false);
}

function toggle(pc) {
    pc = mod12(pc);
    let checkbox = document.getElementById(pc.toString());
    checkbox.checked = !checkbox.checked;

    remember(pc);
}

function generateRandom() {
    for (let checkbox of pc_checkboxes) {
        let state = Math.floor(Math.random() * 2);
        checkbox.checked = Boolean(state);
    }
    resetHistory();
    calculate(false);
}







// event listeners
for (let check of pc_checkboxes) {
    check.addEventListener("input", () => {
        remember(parseInt(check.id));
        calculate(false);
    });
}

Tn_select.addEventListener("change", () => {
    Tn_output.value = formatOutput(getTn(pcs, parseInt(Tn_select.value)), UNORDERED);
});

TnI_select.addEventListener("change", () => {
    TnI_output.value = formatOutput(getTnI(pcs, parseInt(TnI_select.value)), UNORDERED);
});

let letterToPC = new Map([
    ["a", 9], ["b", 11], ["c", 0], ["d", 2], ["e", 4], ["f", 5], ["g", 7],
]);

let semitoneValue = new Map([
    ["#", 1], ["b", -1],
]);

let lastInputTime = 0;
const FLAT_TIME_MS = 500;
let lastNote = "";
document.addEventListener("keydown", e => {
    if (useManualInput && document.activeElement === input) return;

    let key = e.key;

    if ((e.ctrlKey || e.metaKey)) {
        if (key.toLowerCase() === "z") {
            e.preventDefault();
            undo();
            calculate(false);
        } else if (key.toLowerCase() === "y") {
            e.preventDefault();
            redo();
            calculate(false);
        }
        return;
    }

    // letter inputs
    if (/^[acdefg]$/i.test(key) || (key === "b" && (!lastNote || Date.now() - lastInputTime >= FLAT_TIME_MS))) {
        toggle(letterToPC.get(key));
        calculate(false);
        lastNote = key;
        lastInputTime = Date.now();
    } else if ((key === "#" || key === "b") && lastNote) {
        toggle(letterToPC.get(lastNote));
        toggle(letterToPC.get(lastNote) + semitoneValue.get(key));
        calculate(false);
        lastNote = "";
    } else if (!/^[a-g#]$/i.test(key) && key !== "Shift") {
        lastNote = "";
    }

    // numerical inputs
    if (/^[0-9]$/.test(key)) {
        toggle(parseInt(key));
        calculate(false);
    } else if (key === "t") {
        toggle(10);
        calculate(false);
    }

    // other inputs
    else if (key === "Enter") {
        e.preventDefault();
        calculate(false);
    } else if (key === "Escape") {
        reset();
    } else if (key === "Backspace" || key === "Delete") {
        e.preventDefault();
        undo();
        calculate(false);
    }
});

// undo and redo
let history = [];
let pointer = 0;
function undo() {
    if (pointer === -history.length) return;
    pointer--;

    let pc = history.at(pointer);
    let pc_checkbox = document.getElementById(pc.toString());
    pc_checkbox.checked = !pc_checkbox.checked;
}

function redo() {
    if (pointer === 0) return;

    let pc = history.at(pointer);
    let pc_checkbox = document.getElementById(pc.toString());
    pc_checkbox.checked = !pc_checkbox.checked;

    pointer++;
}

function remember(pc) {
    if (pointer <= -1) {
        history = history.slice(0, pointer);
        pointer = 0;
    }
    history.push(pc);
}

function resetHistory() {
    history.length = 0;
    pointer = 0;
}

const input = document.getElementById("input");
input.addEventListener("change", () => {
    calculate(useManualInput);
    resetHistory();
});

function parseManualInput() {
    let text = input.value.toLowerCase().trim();

    let forte = (text.toUpperCase().match(/^(?:1[01]|[0-9])-Z?(?:\d\d|\d)$/) || [])[0];
    if (forte) {
        let key = forteToPrime.has(forte) ? forte : forte.replace("-", "-Z")
        if (forteToPrime.has(key)) {
            return forteToPrime.get(key).split(", ");
        }
    }

    let pcs = (text.match(/1[01]|[0-9]|t|[a-g][#b]?/g) || []).map(pc => {
        if (pc === "t") return 10;
        if (/^[a-g]$/.test(pc)) {
            return letterToPC.get(pc);
        }
        if (/^[a-g][#b]$/.test(pc)) {
            return mod12(letterToPC.get(pc[0]) + semitoneValue.get(pc[1]));
        }
        return parseInt(pc);
    });

    return [...new Set(pcs)];
}








// settings
const setting1 = localStorage.getItem("setting:pc-display");
const usePCNumbers = setting1 === "true";
const setting2 = localStorage.getItem("setting:ten-eleven");
const useTAndE = setting2 === "true";
const setting3 = localStorage.getItem("setting:packing-type");
const useRahn = setting3 === "true";
const setting4 = localStorage.getItem("setting:one-or-all");
const displayAll = setting4 === "true";
const setting5 = localStorage.getItem("setting:manual-input");
const useManualInput = setting5 === "true";
const setting6 = localStorage.getItem("setting:show-unique");
const showUnique = setting6 === "true";
function loadSettings() {
    const pc_btns = document.getElementsByClassName("pc-btn");
    for (let btn of pc_btns) {
        btn.textContent = usePCNumbers ?
            btn.getAttribute("pc-number") :
            btn.textContent = btn.getAttribute("pc-note");
    }

    const btn_10 = document.querySelector(".pc-btn[pc-number='10']");
    const btn_11 = document.querySelector(".pc-btn[pc-number='11']");
    if (usePCNumbers && useTAndE) {
        btn_10.textContent = "T";
        btn_11.textContent = "E";
    }

    packingType = useRahn ? RAHN : FORTE;

    const bottom_rows = document.querySelectorAll("div.bottom-row");
    for (let row of bottom_rows) {
        displayAll ? row.classList.add("hidden") : row.classList.remove("hidden");
    }
    document.getElementById("Tn-output").style.textAlign = displayAll ? "left" : "center";
    document.getElementById("TnI-output").style.textAlign = displayAll ? "left" : "center";

    const inputLabel = document.querySelector("label[for='input']");
    if (useManualInput) {
        input.classList.remove("hidden");
        inputLabel.classList.remove("hidden");
    } else {
        input.classList.add("hidden");
        inputLabel.classList.add("hidden");
    }
}

function tryLoadPCS() {
    let storedData = localStorage.getItem("pcs");

    if (!storedData) {
        pcs = [];
        return;
    }

    pcs = storedData.split(",").map(pc => parseInt(pc));

    setCheckboxStates();

    let inputText = localStorage.getItem("input-text");
    input.value = Boolean(inputText) ? inputText : "";

    calculate(false);
}

function setCheckboxStates() {
    for (let pc of pcs) {
        let checkbox = document.getElementById(pc.toString());
        checkbox.checked = true;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadSettings();
    tryLoadPCS();
});