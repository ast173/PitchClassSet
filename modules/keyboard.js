console.log("==================== KEYBOARD ====================");

import { undo, redo } from "./history.js";
import { input, calculate, toggleAndRemember } from "./index.js";
import { useManualInput } from "./loadSettings.js";
import { forteToPrime } from "./maps.js";
import { letterToPC, semitoneValue, FLAT_TIME_MS } from "./util.js";
console.log("Imported items from \"./history.js\"")
console.log(`Test 6.1:\n${undo}`);
console.log("Imported items from \"./index.js\"")
console.log(`Test 6.2:\n${toggleAndRemember}`);
console.log("Imported items from \"./loadSettings.js\"")
console.log(`Test 6.3:\n${useManualInput}`);
console.log("Imported items from \"./maps.js\"")
console.log(`Test 6.4:\n${forteToPrime}`);
console.log("Imported items from \"./util.js\"")
console.log(`Test 6.5:\n${FLAT_TIME_MS}`);

export { parseManualInput }; // to "./index.js"

// ==================== KEYBOARD ====================
// private variable
let lastInputTime = 0;
// private variable
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
        toggleAndRemember(letterToPC.get(key));
        calculate(false);
        lastNote = key;
        lastInputTime = Date.now();
    } else if ((key === "#" || key === "b") && lastNote) {
        toggleAndRemember(letterToPC.get(lastNote));
        toggleAndRemember(letterToPC.get(lastNote) + semitoneValue.get(key));
        calculate(false);
        lastNote = "";
    } else if (!/^[a-g#]$/i.test(key) && key !== "Shift") {
        lastNote = "";
    }

    // numerical inputs
    if (/^[0-9]$/.test(key)) {
        toggleAndRemember(parseInt(key));
        calculate(false);
    } else if (key === "t") {
        toggleAndRemember(10);
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

import { rememberChangeOfState } from "./history.js";
import { getPCS } from "./index.js";
document.addEventListener("DOMContentLoaded", () => {
    input.addEventListener("change", () => {
        let lastPCS = getPCS();
        calculate(useManualInput);
        let currentPCS = getPCS();
        rememberChangeOfState(lastPCS, currentPCS);
    });
});

// public function
// parseManualInput() -> PCS
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