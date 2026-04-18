console.log("==================== INDEX ====================");

// ==================== Imports ====================
import { UNORDERED, NORMAL_ORDER, PRIME_FORM, IC_VECTOR, FORTE, RAHN, formatOutput } from "./util/util.js";
import { getPCFromCheckbox, savePCS, saveInputText, setCheckboxStates } from "./util/util2.js";
import { getForteNumber, getZMate, tryMatchForKnown } from "./util/maps.js";
console.log("Imported items from \"./util.js\"");
console.log("Imported items from \"./util2.js\"");
console.log("Imported items from \"./maps.js\"");

import { getNormalOrder, getPrimeForm, getICVector, getComplement } from "./deep.js";
import { parseManualInput } from "./manual.js";
import { useManualInput, useRahn } from "./loadSettings.js";
import { handleTransformations, resizeHeight } from "./transformations.js";

console.log("Imported items from \"./deep.js\"");
console.log("Imported items from \"./manual.js\"");
console.log("Imported items from \"./history.js\"");
console.log("Imported items from \"./loadSettings.js\"");
console.log("Imported items from \"./transformations.js\"");

// ==================== Exports ====================
export { calculate }; // to "./keyboard.js", "./loadSettings.js", "./eventListenersInit.js", "./history.js"
export { setPCS }; // to "./loadSettings.js"
export { getPCS }; // to "./keyboard.js", "./audio.js", "./transformations.js"
export { clearAllPC };

// ==================== HTML Elements ====================
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

// ==================== INDEX ====================
// public function
// getPCS() -> PCS
function getPCS() {
    return [...pc_checkboxes]
                .filter(check => check.checked)
                .map(check => getPCFromCheckbox(check));
}

// public function
// setPCS(PCS) -> undefined
function setPCS(other) {
    pcs = [...other];
}

// public function
// clearAllPC() -> undefined
function clearAllPC() {
    for (let checkbox of pc_checkboxes) {
        checkbox.checked = false;
    }
    pcs.length = 0;
}

let pcs = [];
let packingType = useRahn ? RAHN : FORTE;

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

    normal_order.value = formatOutput(getNormalOrder([...pcs], packingType), NORMAL_ORDER);
    let prime = getPrimeForm([...pcs], packingType);
    prime_form.value = formatOutput(prime, PRIME_FORM);
    ic_vector.value = formatOutput(getICVector([...pcs]), IC_VECTOR);
    complement.value = formatOutput(getComplement([...pcs]), UNORDERED);

    forte_number.value = getForteNumber([...prime]);
    z_mate.value = getZMate([...prime]);
    known.value = tryMatchForKnown([...prime]);

    handleTransformations();
    resizeHeight(Tn_output);
    resizeHeight(TnI_output);
}