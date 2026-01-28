console.log("==================== UTIL ====================");
console.log("\"./util.js\" has no imports");

export { UNORDERED, NORMAL_ORDER, PRIME_FORM, IC_VECTOR }; // to "./index.js"
export { FORTE, RAHN }; // to "./deep.js"
export { MAX_SEMITONES, mod12 }; // to "./index.js", "./deep.js"
export { letterToPC, semitoneValue, FLAT_TIME_MS }; // to "./keyboard.js"

// ==================== UTIL ====================
const MAX_SEMITONES = 12;
const FORTE = Symbol("forte");
const RAHN = Symbol("rahn");

const UNORDERED = Symbol("unordered");
const NORMAL_ORDER = Symbol("normal_order");
const PRIME_FORM = Symbol("prime_form");
const IC_VECTOR = Symbol("ic_vector");

let letterToPC = new Map([
    ["a", 9], ["b", 11], ["c", 0], ["d", 2], ["e", 4], ["f", 5], ["g", 7],
]);

let semitoneValue = new Map([
    ["#", 1], ["b", -1],
]);

const FLAT_TIME_MS = 500;

function mod12(pc) {
    return ((pc % 12) + 12) % 12;
}