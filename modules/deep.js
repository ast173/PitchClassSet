console.log("==================== DEEP ====================");

import { MAX_SEMITONES, FORTE, RAHN, mod12 } from "./util.js";
console.log("Imported items from \"./util.js\"");
console.log(`Test 2.1:\n${mod12}`);

export { getNormalOrder, getICVector,
    getComplement, getTn, getTnI } // to "./index.js";
export { getPrimeForm }; // to "./index.js", "./maps.js";

// ==================== DEEP ====================
// public function
// getNormalOrder(PCS, PackingType) -> PCS
function getNormalOrder(pcs, packingType) {
    let pcsCopy = transposeAndSort(pcs);

    let minRange = MAX_SEMITONES;
    let order = [...pcsCopy];
    for (let i = 0; i < pcsCopy.length; i++) {
        let rotation = rotate(pcsCopy, i);

        let first = rotation[0];
        rotation = rotation.map(pc => mod12(pc - first));

        let range = rotation.at(-1) - rotation.at(0);

        if (range < minRange) {
            order = [...rotation];
            minRange = range;
        } else if (range === minRange) {
            order = tiebreak(order, rotation, packingType);
        }
    }

    return order;
}

// private function
// transposeAndSort(PCS) -> PCS
function transposeAndSort(pcs) {
    let pcsCopy = [...pcs]
    pcsCopy = pcsCopy.sort((a, b) => a - b);
    let first = pcsCopy[0];
    pcsCopy = pcsCopy.map(pc => mod12(pc - first));

    return pcsCopy.sort((a, b) => a - b);
}

// private function
// rotate(Array, Number) -> Array
function rotate(arr, i) {
    let arrCopy = [...arr];
    return arrCopy.slice(i).concat(arrCopy.slice(0, i));
}

// private function
// tiebreak(NormalOrder, NormalOrder, PackingType) -> NormalOrder
function tiebreak(oldSet, newSet, packingType) {
    if (packingType === FORTE) {
        for (let i = 0; i < oldSet.length; i++) {
            if (oldSet[i] < newSet[i]) {
                return [...oldSet];
            } else if (oldSet[i] > newSet[i]) {
                return [...newSet];
            }
        }
    } else if (packingType === RAHN) {
        for (let i = oldSet.length - 1; i >= 0; i--) {
            if (oldSet[i] < newSet[i]) {
                return [...oldSet];
            } else if (oldSet[i] > newSet[i]) {
                return [...newSet];
            }
        }
    }
    return [...oldSet];
}

// public function
// getPrimeForm(PCS, PackingType) -> NormalOrder
function getPrimeForm(pcs, packingType) {
    pcs = transposeAndSort([...pcs]);
    let pcsr = transposeAndSort(invert([...pcs]));
    return tiebreak(getNormalOrder(pcs, packingType), getNormalOrder(pcsr, packingType), packingType);
}

// private function
// invert(PCS) -> PCS
function invert(pcs) {
    return [...pcs].map(pc => mod12(-pc));
}

// public function
// getICVector(PCS) -> Array[Natural, Natural, Natural, Natural, Natural, Natural]
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

// private function
// getIC(Number) -> Natural [0, 6]
function getIC(interval) {
    interval = mod12(interval);
    if (interval === 0) throw new Error("Interval must be non zero");
    return interval <= 6 ? interval : 12 - interval;
}

// public function
// getComplement(PCS) -> PCS
function getComplement(pcs) {
    let complement = [];

    for (let pc = 0; pc < MAX_SEMITONES; pc++) {
        if (!pcs.includes(pc)) {
            complement.push(pc);
        }
    }

    return complement;
}

// public function
// getTn(PCS, Natural [0, 11]) -> PCS
function getTn(pcs, n) {
    return pcs.map(pc => mod12(pc + n));
}

// public function
// getTnI(PCS, Natural [0, 11]) -> PCS
function getTnI(pcs, n) {
    let T0I = invert(pcs).sort((a, b) => a - b);
    return T0I.map(pc => mod12(pc + n));
}