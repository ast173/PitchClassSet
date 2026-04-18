console.log("==================== EVENT LISTENERS INIT ====================");

// ==================== Imports ====================
import { MAX_SEMITONES } from "./util/util.js";
import { toggle, getPCFromCheckbox, savePCS, saveInputText } from "./util/util2.js";
import { calculate, getPCS, clearAllPC } from "./index.js";
import { remember, getDifference, rememberAll } from "./history.js";
import { resizeHeight } from "./transformations.js";
import { useManualInput } from "./loadSettings.js";

console.log("Imported items from \"./util.js\"");
console.log("Imported items from \"./util2.js\"");
console.log("Imported items from \"./index.js\"");
console.log("Imported items from \"./history.js\"");
console.log("Imported items from \"./transformations.js\"");
console.log("Imported items from \"./loadSettings.js\"");

// ==================== Exports ====================
export { onReset }; // to "./keyboard.js"

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

// document.getElementById("calculate")     .addEventListener("click", calculate);
document.getElementById("reset")         .addEventListener("click", onReset);
document.getElementById("complement-btn").addEventListener("click", switchToComplement);
document.getElementById("random")        .addEventListener("click", generateRandom);

document.getElementById("settings").addEventListener("click", () => {
    location.href="./settings/settings.html";
});
document.getElementById("help").addEventListener("click", () => {
    window.open("./help/help.html", "helpWindow", "width=600, height=500, resizable=yes, scrollbars=yes");
});

for (let check of pc_checkboxes) {
    check.addEventListener("input", () => {
        remember(getPCFromCheckbox(check));
        calculate(false);
    });
}

// ==================== EVENT LISTENERS INIT ====================
// private function
// onReset() -> undefined
function onReset() {
    let pcs = getPCS();

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
    
    rememberAll([...pcs]);

    clearAllPC();

    savePCS([...pcs]);
    saveInputText(useManualInput);
}

// private function
// switchToComplement() -> undefined
function switchToComplement() {
    for (let pc = 0; pc < MAX_SEMITONES; pc++) {
        toggle(pc);
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