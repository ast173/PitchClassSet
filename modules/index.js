console.log("==================== INDEX ====================");

// ==================== Imports ====================
import { MAX_SEMITONES, UNORDERED, NORMAL_ORDER, PRIME_FORM, IC_VECTOR, RAHN, formatOutput } from "./util.js";
import { toggle, getPCFromCheckbox, savePCS, saveInputText, setCheckboxStates } from "./util2.js";
import { getForteNumber, getZMate, tryMatchForKnown } from "./maps.js";
console.log("Imported items from \"./util.js\"");
console.log("Imported items from \"./util2.js\"");
console.log("Imported items from \"./maps.js\"");

import { getNormalOrder, getPrimeForm, getICVector, getComplement, getTn, getTnI } from "./deep.js";
import { parseManualInput } from "./manual.js";
import { remember, rememberAll, getDifference } from "./history.js";
import { useManualInput } from "./loadSettings.js";
import { handleTransformations, resizeHeight } from "./transformations.js";

console.log("Imported items from \"./deep.js\"");
console.log("Imported items from \"./manual.js\"");
console.log("Imported items from \"./history.js\"");
console.log("Imported items from \"./loadSettings.js\"");
console.log("Imported items from \"./transformations.js\"");

// ==================== Exports ====================
export { onReset }; // to "./keyboard.js", "./eventListenersInit.js"
export { calculate }; // to "./keyboard.js", "./loadSettings.js", "./eventListenersInit.js"
export { setPackingType, setPCS }; // to "./loadSettings.js"
export { getPCS }; // to "./keyboard.js", "./audio.js", "./transformations.js"

// ==================== HTML Elements ====================
const input         = document.getElementById("input");
const output        = document.getElementById("output");
const pc_checkboxes = document.getElementsByClassName("pc-check");

const normal_order  = document.getElementById("normal-order");
const prime_form    = document.getElementById("prime-form");
const ic_vector     = document.getElementById("ic-vector");
const complement    = document.getElementById("complement");
const forte_number  = document.getElementById("forte-number");
const z_mate        = document.getElementById("z-mate");
const known         = document.getElementById("known");

const Tn_output     = document.getElementById("Tn-output");
const TnI_output    = document.getElementById("TnI-output");
const Tn_select     = document.getElementById("Tn-select");
const TnI_select    = document.getElementById("TnI-select");

// ==================== INDEX ====================
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

// public function
// setPackingType(PackingType) -> undefined
function setPackingType(type) {
    packingType = type;
}









// ==================== CONNECTS TO index.html ====================
let pcs = [];
let packingType = RAHN;

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

    handleTransformations();
    resizeHeight(Tn_output);
    resizeHeight(TnI_output);
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
    rememberAll([...Array(MAX_SEMITONES).keys()]);

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

export { switchToComplement, generateRandom }; // to "./modules/eventListenersInit.js"

for (let check of pc_checkboxes) {
    check.addEventListener("input", () => {
        remember(getPCFromCheckbox(check));
        calculate(false);
    });
}