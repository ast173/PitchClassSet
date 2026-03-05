console.log("==================== KEYBOARD ====================");

import { noteToPC } from "./util.js";
import { forteToPrime } from "./maps.js";
import { undo, redo, remember, rememberAll, getDifference } from "./history.js";
import { input, calculate, onReset, getPCS } from "./index.js";
import { useManualInput } from "./loadSettings.js";
import { toggle, toggleAll } from "./util2.js";
console.log("Imported items from \"./util.js\"");
console.log("Imported items from \"./maps.js\"");
console.log("Imported items from \"./history.js\"");
console.log("Imported items from \"./index.js\"");
console.log("Imported items from \"./loadSettings.js\"");

export { parseManualInput }; // to "./index.js"

// ==================== KEYBOARD ====================
// private variable
let lastNote = "";
document.addEventListener("keydown", e => {
    if (useManualInput && document.activeElement === input) return;

    let key = e.key;

    if (e.ctrlKey || e.metaKey) {
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
    if (/^[a-g]$/i.test(key)) {
        let pc = noteToPC(key);
        toggle(pc);
        remember(pc);
        calculate(false);
        lastNote = key;
    } else if (/^[#+\-]$/.test(key) && lastNote) {
        let pcs = [noteToPC(lastNote), noteToPC(lastNote, key)];
        toggleAll(pcs);
        rememberAll(pcs);
        calculate(false);
        lastNote = "";
    } else if (!/^[a-g#+\-]$/i.test(key) && key !== "Shift") {
        lastNote = "";
    }

    // numerical inputs
    if (/^[0-9]$/.test(key)) {
        let pc = parseInt(key);
        toggle(pc);
        remember(pc);
        calculate(false);
    } else if (key === "t") {
        toggle(10);
        remember(10);
        calculate(false);
    }

    // other inputs
    else if (key === "Enter") {
        e.preventDefault();
        calculate(false);
    } else if (key === "Escape") {
        onReset();
    } else if (key === "Backspace" || key === "Delete") {
        e.preventDefault();
        undo();
        calculate(false);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    input.addEventListener("change", () => {
        let lastPCS = getPCS();
        calculate(useManualInput);
        let currentPCS = getPCS();
        rememberAll(getDifference(lastPCS, currentPCS));
    });
});

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

    return []
}

// private function
// tryMatchPCS(String) -> PCS
function tryMatchPCS(text) {
    let pcs = (text.match(/1[01]|[0-9]|t|[a-g][#b+\-]?/g) || []).map(s => stringToPC(s));
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

    throw console.error(`The string \"${string}\" cannot be converted to a PC`);
}