console.log("==================== INDEX ====================");

import { MAX_SEMITONES, UNORDERED, NORMAL_ORDER, PRIME_FORM, IC_VECTOR } from "./util.js";
import { toggle, getPCFromCheckbox, savePCS, saveInputText, setCheckboxStates } from "./util2.js";
import { getForteNumber, getZMate, tryMatchForKnown } from "./maps.js";
import { getNormalOrder, getPrimeForm, getICVector, getComplement, getTn, getTnI } from "./deep.js";
console.log("Imported items from \"./util.js\"");
console.log("Imported items from \"./util2.js\"");
console.log("Imported items from \"./maps.js\"");
console.log("Imported items from \"./deep.js\"");

// ==================== INDEX ====================
// private function
// handleTranspositionAndInversion() -> undefined
function handleTranspositionAndInversion() {
    if (!showMultiple) {
        setTextAlign("center");
        Tn_output.value = formatOutput(getTn([...pcs], parseInt(Tn_select.value)), UNORDERED);
        TnI_output.value = formatOutput(getTnI([...pcs], parseInt(TnI_select.value)), UNORDERED);
        return;
    }

    if (pcs.length === 0) {
        setTextAlign("center");
        Tn_output.value = "[]";
        TnI_output.value = "[]";
        return;
    }

    setTextAlign("left");

    Tn_output.value = [...Array(MAX_SEMITONES).keys()]
        .map(pc => getTextStart(pc) + formatOutput(getTn([...pcs], pc), UNORDERED))
        .join("\n");
    TnI_output.value = [...Array(MAX_SEMITONES).keys()]
        .map(pc => getTextStart(pc) + formatOutput(getTnI([...pcs], pc), UNORDERED))
        .join("\n");
}

// private function
// setTextAlign(String) -> undefined
function setTextAlign(align) {
    Tn_output.style.textAlign = align;
    TnI_output.style.textAlign = align;
}

// private function
// resizeHeight(PC) -> String
function getTextStart(pc) {
    let result = " ".repeat(9 - pc.toString().length);
    result += `n = ${pc}: `;
    return result;
}

// private function
// resizeHeight(TODO:HTML) -> undefined
function resizeHeight(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
}

// private function
// getPCS() -> PCS
function getPCS() {
    return [...pc_checkboxes]
                .filter(check => check.checked)
                .map(check => getPCFromCheckbox(check));
}

// private function
// setPCS(PCS) -> undefined
function setPCS(other) {
    pcs = [...other];
}









// ==================== CONNECTS TO index.html ====================
const input = document.getElementById("input");
const output = document.getElementById("output");
const pc_checkboxes = document.getElementsByClassName("pc");
let pcs = [];
let packingType;
// public function
// setPackingType(PackingType) -> undefined
function setPackingType(type) {
    packingType = type;
}

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

// public function
// calculate(Boolean) -> undefined
function calculate(manualOn) {
    if (manualOn) {
        clearAllPC();
        pcs = parseManualInput();
        setCheckboxStates(pcs);
    } else {
        pcs = getPCS();
    }
    pcs = pcs.sort((a, b) => a - b);
    savePCS([...pcs]);
    saveInputText(useManualInput);

    output.value = formatOutput([...pcs], UNORDERED);

    // console.log("Normal Order");
    normal_order.value = formatOutput(getNormalOrder([...pcs], packingType), NORMAL_ORDER);
    // console.log("Prime Form");
    let prime = getPrimeForm([...pcs], packingType);
    prime_form.value = formatOutput(prime, PRIME_FORM);
    // console.log("IC Vector");
    ic_vector.value = formatOutput(getICVector([...pcs]), IC_VECTOR);
    // console.log("Complement");
    complement.value = formatOutput(getComplement([...pcs]), UNORDERED);

    // console.log("Forte Number");
    // TODO: temporary solution
    forte_number.value = getForteNumber([...prime]);
    // console.log("Z Mate");
    z_mate.value = getZMate([...prime]);
    // console.log("Known");
    known.value = tryMatchForKnown([...prime]);

    handleTranspositionAndInversion();
    resizeHeight(Tn_output);
    resizeHeight(TnI_output);
}

// private function
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
        throw new Error("Unknown formatting " + formatting);
    }

    return useTAndE ?
        formatted.replaceAll("10", "T").replaceAll("11", "E") :
        formatted;
}

// private function
// clearAllPC() -> undefined
function clearAllPC() {
    for (let checkbox of pc_checkboxes) {
        checkbox.checked = false;
    }
}

// button functions
// public function
// onReset() -> undefined
function onReset() {
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
    
    rememberAll(getPCS());

    clearAllPC();
    pcs = [];

    savePCS([...pcs]);
    saveInputText(useManualInput);
}

// private function
// switchToComplement() -> undefined
function switchToComplement() {
    for (let pc = 0; pc < MAX_SEMITONES; pc++) {
        toggle(pc);
        calculate(false);
    }
    rememberAll([...Array(12).keys()]);

    calculate(false);
}

// private function
// generateRandom() -> undefined
function generateRandom() {
    let lastPCS = getPCS();

    for (let checkbox of pc_checkboxes) {
        let state = Math.random() < 0.5;
        checkbox.checked = Boolean(state);
    }

    let currentPCS = getPCS();
    rememberAll(getDifference(lastPCS, currentPCS));

    calculate(false);
}









// EVENT LISTENERS
for (let check of pc_checkboxes) {
    check.addEventListener("input", () => {
        remember(getPCFromCheckbox(check));
        calculate(false);
    });
}

Tn_select.addEventListener("change", () => {
    Tn_output.value = formatOutput(getTn([...pcs], parseInt(Tn_select.value)), UNORDERED);
});

TnI_select.addEventListener("change", () => {
    TnI_output.value = formatOutput(getTnI([...pcs], parseInt(TnI_select.value)), UNORDERED);
});

// ==================== Imports ====================
// KEYBOARD
import { parseManualInput } from "./keyboard.js";
console.log("Imported items from \"./keyboard.js\"");

// HISTORY
import { undo, redo, remember, rememberAll, getDifference } from "./history.js";
console.log("Imported items from \"./history.js\"");

// LOAD SETTINGS
import { useTAndE, showMultiple, useManualInput } from "./loadSettings.js";
console.log("Imported items from \"./loadSettings.js\"");

// ==================== Exports ====================
export { input, onReset, getPCS }; // to "./keyboard.js"
export { calculate }; // to "./keyboard.js", "./loadSettings.js"
export { setPackingType, setPCS }; // to "./loadSettings.js"

// ==================== Elements accessible from index.html ====================
window.calculate = calculate;
window.onReset = onReset;
window.switchToComplement = switchToComplement;
window.generateRandom = generateRandom;
window.undo = undo;
window.redo = redo;