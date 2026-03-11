console.log("==================== MANUAL ====================");

// ==================== Imports ====================
import { noteToPC } from "./util.js";
import { forteToPrime } from "./maps.js";
console.log("Imported items from \"./util.js\"");
console.log("Imported items from \"./maps.js\"");

// ==================== Exports ====================
export { parseManualInput }; // to "./index.js"

// ==================== MANUAL ====================
// public function
// parseManualInput() -> PCS
function parseManualInput() {
    let text = input.value.toLowerCase().trim();

    let pcs = tryMatchForte(text);

    if (pcs.length === 0) {
        pcs = tryMatchPCS(text);
    }

    return [...new Set(pcs)];
}

// private function
// tryMatchForte(String) -> PCS
function tryMatchForte(text) {
    let forte = (text.match(/^(1[01]|[0-9])-(z?)(\d{1,2})$/) || [])[0];
    if (!forte) return [];

    if (forteToPrime.has(forte)) {
        return forteToPrime.get(forte).split(", ").map(s => parseInt(s));
    }

    forte = forte.replace(/-(?!z)/, "-z");
    if (forteToPrime.has(forte)) {
        return forteToPrime.get(forte).split(", ").map(s => parseInt(s));
    }

    return [];
}

// private function
// tryMatchPCS(String) -> PCS
function tryMatchPCS(text) {
    let pcs = (text.match(/1[01]|[0-9]|t|[a-g][#b+\-]?/g) || []).map(stringToPC);
    return pcs;
}

// private function
// stringToPC(String) -> PC
function stringToPC(string) {
    if (0 <= string && string <= 11) {
        return string;
    }

    if (/^[a-g]$/.test(string)) {
        return noteToPC(string);
    }
    if (/^[a-g][#b+\-]$/.test(string)) {
        return noteToPC(string[0], string[1]);
    }

    if (string === "t") return 10;
    if (/^1[01]|[0-9]$/.test(string)) {
        return parseInt(string);
    }

    throw new Error(`The string \"${string}\" cannot be converted to a PC`);
}