console.log("==================== KEYBOARD ====================");

// ==================== Imports ====================
import { noteToPC } from "./util.js";
import { undo, redo, remember, rememberAll, getDifference } from "./history.js";
import { calculate, onReset, getPCS } from "./index.js";
import { useManualInput } from "./loadSettings.js";
import { toggle, toggleAll } from "./util2.js";
console.log("Imported items from \"./util.js\"");
console.log("Imported items from \"./history.js\"");
console.log("Imported items from \"./index.js\"");
console.log("Imported items from \"./loadSettings.js\"");

// ==================== Exports ====================

// ==================== HTML Elements ====================
const input = document.getElementById("input");

// ==================== KEYBOARD ====================
input.addEventListener("change", () => {
    let lastPCS = getPCS();
    calculate(useManualInput);
    let currentPCS = getPCS();
    rememberAll(getDifference(lastPCS, currentPCS));
});

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