console.log("==================== LOAD SETTINGS ====================");

// ==================== Imports ====================
import { FORTE, RAHN } from "./util.js";
import { setCheckboxStates } from "./util2.js";
import { setPackingType, calculate, setPCS } from "./index.js";
console.log("Imported items from \"./util.js\"");
console.log("Imported items from \"./util2.js\"");
console.log("Imported items from \"./index.js\"");

// ==================== Exports ====================
export { useTAndE, showMultiple }; // to "./index.js"
export { useManualInput }; // to "./index.js", "./keyboard.js"

// ==================== HTML Elements ====================
const pc_btns = document.getElementsByClassName("pc-btn");

// ==================== LOAD SETTINGS ====================
const setting1 = localStorage.getItem("setting:pc-display");
const usePCNumbers = setting1 === "true";
const setting2 = localStorage.getItem("setting:ten-eleven");
const useTAndE = setting2 === "true";
const setting3 = localStorage.getItem("setting:packing-type");
const useRahn = setting3 === "true";
const setting4 = localStorage.getItem("setting:manual-input");
const useManualInput = setting4 === "true";
const setting5 = localStorage.getItem("setting:show-multiple");
const showMultiple = setting5 === "true";
// const setting6 = localStorage.getItem("setting:show-unique");
// const showUnique = setting6 === "true";

// private function
// loadSettings() -> undefined
function loadSettings() {
    for (let btn of pc_btns) {
        btn.textContent = usePCNumbers ?
            btn.getAttribute("pc-number") :
            btn.getAttribute("pc-note");
    }

    const btn_10 = document.querySelector(".pc-btn[pc-number='10']");
    const btn_11 = document.querySelector(".pc-btn[pc-number='11']");
    if (usePCNumbers && useTAndE) {
        btn_10.textContent = "T";
        btn_11.textContent = "E";
    }

    setPackingType(useRahn ? RAHN : FORTE);

    const bottom_rows = document.querySelectorAll("div.selector-row");
    for (let row of bottom_rows) {
        showMultiple ? row.classList.add("hidden") : row.classList.remove("hidden");
    }

    const inputLabel = document.querySelector("label[for='input']");
    if (useManualInput) {
        input.classList.remove("hidden");
        inputLabel.classList.remove("hidden");
    } else {
        input.classList.add("hidden");
        inputLabel.classList.add("hidden");
    }
}

// private function
// loadStoredPCS() -> PCS
function loadStoredPCS() {
    const storedData = localStorage.getItem("pcs");

    let pcs = [];
    if (!storedData) {
        console.log("Item: \"pcs\" not found in local storage")
        return pcs;
    }

    pcs = storedData.split(",").map(pc => parseInt(pc));

    const inputText = localStorage.getItem("input-text");
    input.value = Boolean(inputText) ? inputText : "";

    return pcs;
}

document.addEventListener("DOMContentLoaded", () => {
    loadSettings();
    let pcs = loadStoredPCS();
    setPCS(pcs);
    setCheckboxStates(pcs);
    calculate(false);
    console.log("Loaded settings");
});