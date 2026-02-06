console.log("==================== INDEX ====================");

import { MAX_SEMITONES, UNORDERED, NORMAL_ORDER, PRIME_FORM, IC_VECTOR, mod12 } from "./util.js";
import { getForteNumber, getZMate, tryMatchForKnown } from "./maps.js";
import { getNormalOrder, getPrimeForm, getICVector,
    getComplement, getTn, getTnI } from "./deep.js";
console.log("Imported items from \"./util.js\"");
console.log(`Test 7.1:\n${MAX_SEMITONES}`);
console.log("Imported items from \"./maps.js\"");
console.log(`Test 7.2:\n${getForteNumber}`);
console.log("Imported items from \"./deep.js\"");
console.log(`Test 7.3:\n${getNormalOrder}`);

// ==================== INDEX ====================
// private function
// handleTranspositionAndInversion() -> undefined
function handleTranspositionAndInversion() {
    if (!displayAll) {
        Tn_output.value = formatOutput(getTn([...pcs], parseInt(Tn_select.value)), UNORDERED);
        TnI_output.value = formatOutput(getTnI([...pcs], parseInt(TnI_select.value)), UNORDERED);
        return;
    }

    if (pcs.length === 0) {
        Tn_output.value = "[]";
        TnI_output.value = "[]";
        return;
    }

    Tn_output.value = [...Array(MAX_SEMITONES).keys()]
        .map(pc => textStart(pc) + formatOutput(getTn([...pcs], pc), UNORDERED)).join("\n");
    TnI_output.value = [...Array(MAX_SEMITONES).keys()]
        .map(pc => textStart(pc) + formatOutput(getTnI([...pcs], pc), UNORDERED)).join("\n");
}

// private function
// resizeHeight(PC) -> String
function textStart(pc) {
    let spaces = "             ";
    return pc.toString().length === 1 ? spaces + ` n = ${pc}: ` : spaces + `n = ${pc}: `;
}

// private function
// resizeHeight(TODO:HTML) -> undefined
function resizeHeight(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
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
        for (let checkbox of pc_checkboxes) {
            checkbox.checked = false;
        }
        pcs = parseManualInput();
        setCheckboxStates();
    } else {
        pcs = getPCS();
    }
    pcs = pcs.sort((a, b) => a - b);
    savePCSToStorage([...pcs]);

    output.value = formatOutput([...pcs], UNORDERED);
    // output.value = JSON.stringify(history, null, 2) +`\nLength: ${history.length}\nPointer: ${pointer}`;

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
    z_mate.value = getZMate([...pcs]);
    // console.log("Known");
    known.value = tryMatchForKnown([...pcs]);

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
    
    rememberChangeOfState(getPCS(), []);

    for (let checkbox of pc_checkboxes) {
        checkbox.checked = false;
    }

    pcs = [];
    savePCSToStorage([...pcs]);
}

// private function
// switchToComplement() -> undefined
function switchToComplement() {
    let lastState = getPCS();
    
    for (let pc = 0; pc < MAX_SEMITONES; pc++) {
        toggle(pc);
        calculate(false);
    }
    
    let currentState = getPCS();
    rememberChangeOfState(lastState, currentState);

    calculate(false);
}

// public function
// toggleAndRemember(PC) -> undefined
function toggleAndRemember(pc) {
    toggle(pc);
    remember(pc);
}

// public function
// toggle(PC) -> undefined
function toggle(pc) {
    pc = mod12(pc);
    let checkbox = document.getElementById(pc.toString());
    checkbox.checked = !checkbox.checked;
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
    rememberChangeOfState(lastPCS, currentPCS);

    calculate(false);
}







// ==================== DATA ====================
// public function
// getPCS() -> PCS
function getPCS() {
    return [...pc_checkboxes]
                .filter(check => check.checked)
                .map(check => getPC(check));
}

// private function
// getPC(TODO:HTML) -> PC
function getPC(check) {
    return parseInt(check.id);
}

// private function
// savePCSToStorage(PCS) -> undefined
function savePCSToStorage(pcs) {
    if (useManualInput) localStorage.setItem("input-text", input.value);
    localStorage.setItem("pcs", pcs.join(","));
}



// KEYBOARD
import { parseManualInput } from "./keyboard.js";
export { input, calculate, toggleAndRemember, onReset } // to "./keyboard.js";
export { getPCS }; // to "./keyboard.js";

// EVENT LISTENERS
for (let check of pc_checkboxes) {
    check.addEventListener("input", () => {
        remember(getPC(check));
        calculate(false);
    });
}

Tn_select.addEventListener("change", () => {
    Tn_output.value = formatOutput(getTn([...pcs], parseInt(Tn_select.value)), UNORDERED);
});

TnI_select.addEventListener("change", () => {
    TnI_output.value = formatOutput(getTnI([...pcs], parseInt(TnI_select.value)), UNORDERED);
});

// HISTORY
import { undo, redo, remember, rememberChangeOfState } from "./history.js";
export { toggle }; // to "./history.js";

// ==================== LOAD SETTINGS ====================
import { useTAndE, displayAll, useManualInput } from "./loadSettings.js";
export { setPackingType, tryLoadPCS }; // to "./loadSettings.js"

// public function
// tryLoadPCS() -> undefined
function tryLoadPCS() {
    let storedData = localStorage.getItem("pcs");

    if (!storedData) {
        pcs = [];
        return;
    }

    pcs = storedData.split(",").map(pc => parseInt(pc));

    setCheckboxStates();

    let inputText = localStorage.getItem("input-text");
    input.value = Boolean(inputText) ? inputText : "";

    calculate(false);
}

// private function
// setCheckboxStates() -> undefined
function setCheckboxStates() {
    for (let pc of pcs) {
        let checkbox = document.getElementById(pc.toString());
        checkbox.checked = true;
    }
}

// ==================== Elements accessible from index.html ====================
window.calculate = calculate;
window.onReset = onReset;
window.switchToComplement = switchToComplement;
window.generateRandom = generateRandom;
window.undo = undo;
window.redo = redo;