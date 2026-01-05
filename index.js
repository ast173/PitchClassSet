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

function tiebreak(oldSet, newSet, type) { // TODO: optimize
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

// transposition and inversion
function getTn(pcs, n) {
    return pcs.map(pc => mod12(pc + n));
}

function getTnI(pcs, n) {
    let T0I = invert(pcs).sort((a, b) => a - b);
    return T0I.map(pc => mod12(pc + n));
}

function getAllTn(pcs) {
    let allTn = [];

    for (let n = 0; n < MAX_SEMITONES; n++) {
        let transposition = pcs.map(pc => mod12(pc + n));
        allTn.push(transposition);
    }

    return allTn;
}

function getAllTnI(pcs) {
    let allTnI = [];
    let T0I = invert(pcs).sort((a, b) => a - b);

    for (let n = 0; n < MAX_SEMITONES; n++) {
        let inversion = T0I.map(pc => mod12(pc + n));
        allTnI.push(inversion);
    }

    return allTnI;
}









// pc is an Integer from 0-11 inclusive representing the pitch class
// pcs is a list of pc

// TODO: display all Tn and TnI or only one
// TODO: manual input?
// TODO: forte number manual input

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

const Tn_output = document.getElementById("Tn-output");
const TnI_output = document.getElementById("TnI-output");
const Tn_select = document.getElementById("Tn-select");
const TnI_select = document.getElementById("TnI-select");

const UNORDERED = Symbol("unordered");
const NORMAL_ORDER = Symbol("normal_order");
const PRIME_FORM = Symbol("prime_form");
const IC_VECTOR = Symbol("ic_vector");

function tryLoadPCS() {
    let storedData = localStorage.getItem("pcs");

    if (!storedData) {
        pcs = [];
        return;
    }

    pcs = storedData.split(",").map(pc => parseInt(pc)); // TODO .map(parseInt) doesn't work for some reason

    for (let pc of pcs) {
        let checkbox = document.getElementById(pc.toString());
        if (checkbox) checkbox.checked = true;
    }

    calculate();
}

function savePCS() {
    if (!pcs) {
        pcs = [];
        return;
    }
    // let data = !!pcs ? pcs.join(",") : null;
    localStorage.setItem("pcs", pcs.join(","));
}

function calculate() {
    pcs = getAllPC();
    savePCS();

    output.value = formatOutput(pcs, UNORDERED);

    normal_order.value = formatOutput(getNormalOrder(pcs), NORMAL_ORDER);
    prime_form.value = formatOutput(getPrimeForm(pcs), PRIME_FORM);
    ic_vector.value = formatOutput(getICVector(pcs), IC_VECTOR);
    complement.value = formatOutput(getComplement(pcs), UNORDERED);

    forte_number.value = getForteNumber(pcs);
    z_mate.value = getZMate(pcs);

    if (displayAll) {
        Tn_output.value = "";
        TnI_output.value = "";
        for (let n = 0; n < MAX_SEMITONES; n++) {
            Tn_output.value += formatOutput(getTn(pcs, n), UNORDERED);
            TnI_output.value += formatOutput(getTnI(pcs, n), UNORDERED);
            if (n !== 11) {
                Tn_output.value += "\n";
                TnI_output.value += "\n";
            }
        }
    } else {
        Tn_output.value = formatOutput(getTn(pcs, parseInt(Tn_select.value)), UNORDERED);
        TnI_output.value = formatOutput(getTnI(pcs, parseInt(TnI_select.value)), UNORDERED);
    }
    resizeHeight(Tn_output);
    resizeHeight(TnI_output);
}

function getAllPC() {
    let pcs = [];
    for (let checkbox of pc_checkboxes) {
        if (checkbox.checked) {
            pcs.push(parseInt(checkbox.id)); // TODO change this to not use id
        }
    }
    return pcs;
}

function formatOutput(pcs, formatting) {
    let formatted = "";
    switch (formatting) {
        case NORMAL_ORDER:
        case UNORDERED:
            formatted = `[${pcs.join(", ")}]`;
            break;
        case PRIME_FORM:
            formatted = `(${pcs.join(" ")})`;
            break;
        case IC_VECTOR:
            formatted = `<${pcs.join(" ")}>`;
            break;
        default:
            throw new Error("Unknown formatting " + formatting);
    }

    return useTAndE ?
        formatted.replace("10", "T").replace("11", "E") :
        formatted;
}

function resizeHeight(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
}

function reset() {
    output.value = "";

    normal_order.value = "";
    prime_form.value = "";
    ic_vector.value = "";
    complement.value = "";

    forte_number.value = "";
    z_mate.value = "";

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
    }
    resetHistory();
    calculate();
}

function toggle(pc) {
    pc = mod12(pc);
    let checkbox = document.getElementById(pc.toString());
    checkbox.checked = !checkbox.checked;

    remember(pc);
    calculate();
}

function generateRandom() {
    for (let checkbox of pc_checkboxes) {
        let state = Math.floor(Math.random() * 2);
        checkbox.checked = !!state;
    }
    resetHistory();
    calculate();
}

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









// event listeners
for (let check of pc_checkboxes) {
    check.addEventListener("input", () => {
        remember(parseInt(check.id));
        calculate();
    })
}

Tn_select.addEventListener("change", () => {
    Tn_output.value = `[${getTn(pcs, parseInt(Tn_select.value)).join(", ")}]`;
});

TnI_select.addEventListener("change", () => {
    TnI_output.value = `[${getTnI(pcs, parseInt(TnI_select.value)).join(", ")}]`;
});

let lastInputTime = 0;
const FLAT_TIME_MS = 500;
let lastNote = "";
document.addEventListener("keydown", e => {
    let key = e.key;

    if ((e.ctrlKey || e.metaKey)) {
        if (key.toLowerCase() === "z") {
            e.preventDefault();
            undo();
            calculate();
        } else if (key.toLowerCase() === "y") {
            e.preventDefault();
            redo();
            calculate();
        }
        return;
    }

    // letter inputs
    if (/^[acdefg]$/i.test(key) || (key === "b" && (!lastNote || Date.now() - lastInputTime >= FLAT_TIME_MS))) {
        toggle(letterToPC.get(key));
        lastNote = key;
        lastInputTime = Date.now();
    } else if ((key === "#" || key === "b") && lastNote) {
        toggle(letterToPC.get(lastNote));
        toggle(letterToPC.get(lastNote) + semitoneValue.get(key));
        lastNote = "";
    } else if (!/^[a-g#]$/i.test(key) && key !== "Shift") {
        lastNote = "";
    }

    // numerical inputs
    if (/^[0-9]$/.test(key)) {
        toggle(parseInt(key));
    } else if (key === "t") {
        toggle(10);
    }

    // other inputs
    else if (key === "Enter") {
        e.preventDefault();
        calculate();
    } else if (key === "Escape") {
        reset();
    } else if (key === "Backspace" || key === "Delete") {
        e.preventDefault();
        undo();
        calculate();
    }
});

let letterToPC = new Map([
    ["a", 9],
    ["b", 11],
    ["c", 0],
    ["d", 2],
    ["e", 4],
    ["f", 5],
    ["g", 7],
]);

let semitoneValue = new Map([
    ["#", 1],
    ["b", -1],
]);








// settings
const setting1 = localStorage.getItem("setting-pc-display");
const usePCNumbers = setting1 === "true";
const setting2 = localStorage.getItem("setting-ten-eleven");
const useTAndE = setting2 === "true";
const setting3 = localStorage.getItem("setting-packing-type");
const useRahn = setting3 === "true";
const setting4 = localStorage.getItem("setting-one-or-all");
const displayAll = setting4 === "true";
document.addEventListener("DOMContentLoaded", () => {
    const pc_btns = document.getElementsByClassName("pc-btn");
    const btn_10 = document.querySelector('.pc-btn[pc-number="10"]');
    const btn_11 = document.querySelector('.pc-btn[pc-number="11"]');

    packingType = useRahn ? RAHN : FORTE;

    if (!pc_btns) return;
    if (!btn_10 || !btn_11) return;

    for (let btn of pc_btns) {
        if (usePCNumbers) {
            btn.textContent = btn.getAttribute("pc-number");
        } else {
            btn.textContent = btn.getAttribute("pc-note");
        }
    }

    if (usePCNumbers && useTAndE) {
        btn_10.textContent = "T";
        btn_11.textContent = "E";
    }

    if (displayAll) {
        Tn_select.classList.add("hidden");
        TnI_select.classList.add("hidden");
    } else {
        Tn_select.classList.remove("hidden");
        TnI_select.classList.remove("hidden");
    }

    tryLoadPCS();
});