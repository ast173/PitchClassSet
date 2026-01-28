console.log("==================== LOAD SETTINGS ====================");

import { setPackingType, tryLoadPCS } from "./index.js";
import { FORTE, RAHN } from "./util.js";
console.log("Imported items from \"./index.js\"")
console.log(`Test 5.1:\n${setPackingType}`);
console.log("Imported items from \"./util.js\"")
console.log(`Test 5.2:\n${String(FORTE)}`);

export { useTAndE, displayAll }; // to "./index.js"
export { useManualInput }; // to "./index.js", "./keyboard.js"

// ==================== LOAD SETTINGS ====================
const setting1 = localStorage.getItem("setting:pc-display");
const usePCNumbers = setting1 === "true";
const setting2 = localStorage.getItem("setting:ten-eleven");
const useTAndE = setting2 === "true";
const setting3 = localStorage.getItem("setting:packing-type");
const useRahn = setting3 === "true";
const setting4 = localStorage.getItem("setting:one-or-all");
const displayAll = setting4 === "true";
// const setting5 = localStorage.getItem("setting:show-unique");
// const showUnique = setting5 === "true";
const setting6 = localStorage.getItem("setting:manual-input");
const useManualInput = setting6 === "true";
function loadSettings() {
    const pc_btns = document.getElementsByClassName("pc-btn");
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

    const bottom_rows = document.querySelectorAll("div.bottom-row");
    for (let row of bottom_rows) {
        displayAll ? row.classList.add("hidden") : row.classList.remove("hidden");
    }
    document.getElementById("Tn-output").style.textAlign = displayAll ? "left" : "center";
    document.getElementById("TnI-output").style.textAlign = displayAll ? "left" : "center";

    const inputLabel = document.querySelector("label[for='input']");
    if (useManualInput) {
        input.classList.remove("hidden");
        inputLabel.classList.remove("hidden");
    } else {
        input.classList.add("hidden");
        inputLabel.classList.add("hidden");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadSettings();
    tryLoadPCS();
});