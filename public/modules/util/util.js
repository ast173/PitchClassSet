console.log("==================== UTIL ====================");

// ==================== Imports ====================
console.log("\"./util.js\" has no imports");

// ==================== Exports ====================
export { NORMAL_ORDER, PRIME_FORM, IC_VECTOR }; // to "./index.js"
export { UNORDERED, formatOutput }; // to "./index.js", "./transformations.js"
export { mod12 }; // to "./deep.js"
export { MAX_SEMITONES }; // to "./index.js", "./deep.js", "./audio.js", "./transformations.js"
export { noteToPC }; // to "./keyboard.js", "./manual.js"
export { RAHN }; // to "./index.js", "./loadSettings.js"
export { FORTE }; // to "./deep.js", "./loadSettings.js"

// ==================== UTIL ====================
const MAX_SEMITONES = 12;

// let a PackingType be of datatype Symbol and to be one of the following:
const FORTE = Symbol("forte");
const RAHN = Symbol("rahn");

// let a FormatingType be of datatype Symbol and to be one of the following:
const UNORDERED = Symbol("unordered");
const NORMAL_ORDER = Symbol("normal_order");
const PRIME_FORM = Symbol("prime_form");
const IC_VECTOR = Symbol("ic_vector");

const useTAndE = localStorage.getItem("setting:ten-eleven") === "true";

// public function
// formatOutput(PCS, FormatingType) -> String
function formatOutput(pcs, formatting) {
    let formatted = "";
    if (formatting === NORMAL_ORDER || formatting === UNORDERED) {
        formatted = `[${pcs.join(", ")}]`;
    } else if (formatting === PRIME_FORM) {
        formatted = `(${pcs.join(" ")})`;
    } else if (formatting === IC_VECTOR) {
        formatted = `<${pcs.join(" ")}>`;
    } else {
        throw new Error("Unknown formatting: " + formatting);
    }

    return useTAndE ?
        formatted.replaceAll("10", "T").replaceAll("11", "E") :
        formatted;
}

// private map
let letterToPC = new Map([
    ["a", 9], ["b", 11], ["c", 0], ["d", 2], ["e", 4], ["f", 5], ["g", 7],
]);

// private map
let accedentalToValue = new Map([
    ["#", 1], ["b", -1],
    ["+", 1], ["-", -1],
    ["=", 0],
]);

// public function
// noteToPC(String, String) -> PC
function noteToPC(key, accedental = "=") {
    return mod12(letterToPC.get(key) + accedentalToValue.get(accedental));
}

// public function
// mod12(Integer) -> PC
function mod12(pc) {
    return ((pc % 12) + 12) % 12;
}

// // private function
// // isPC(Any) -> Boolean
// function isPC(any) {
//     return Number.isInteger(any) && 0 <= any && any < MAX_SEMITONES
// }

// // private function
// // isPCS(Any) -> Boolean
// function isPCS(any) {
//     return Array.isArray(any) &&
//             any.every(isPC) &&
//             new Set(any).size === any.length;
// }

// // private function
// // assert(Boolean) -> undefined
// function assert(bool) {
//     if (!bool) {
//         throw new Error("Assertion failed");
//     }
// }