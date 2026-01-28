console.log("==================== DEEP ====================");

import { MAX_SEMITONES, FORTE, RAHN, mod12 } from "./util.js";
console.log("Imported items from \"./util.js\"");
console.log(`Test 2.1:\n${mod12}`);

export { getNormalOrder, getICVector,
    getComplement, getTn, getTnI } // to "./index.js";
export { getPrimeForm }; // to "./index.js", "./maps.js";

// ==================== DEEP ====================
// normal order
function getNormalOrder(pcs, packingType) {
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

// private
function transposeAndSort(pcs) {
    let first = pcs[0];
    pcs = pcs.map(pc => mod12(pc - first));
    return pcs.sort((a, b) => a - b);
}

// private
function rotate(arr, i) {
    return arr.slice(i).concat(arr.slice(0, i));
}

// private
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
function getPrimeForm(pcs, packingType) {
    pcs = transposeAndSort(pcs);
    let pcsr = transposeAndSort(invert([...pcs]));

    return tiebreak(getNormalOrder(pcs, packingType), getNormalOrder(pcsr, packingType), packingType);
}

// private
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

// private
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

// transposition and inversion
function getTn(pcs, n) {
    return pcs.map(pc => mod12(pc + n));
}

function getTnI(pcs, n) {
    let T0I = invert(pcs).sort((a, b) => a - b);
    return T0I.map(pc => mod12(pc + n));
}