console.log("==================== UTIL2 ====================");
console.log("\"./util2.js\" has no imports");

export { getIDFromPC, toggleAll } // to "./history.js"
export { getPCFromCheckbox, savePCSToStorage, setCheckboxStates }; // to "./index.js"
export { toggle }; // to "./index.js", "./keyboard.js"

// public function
// toggle(PC) -> undefined
function toggle(pc) {
    let checkbox = document.getElementById(getIDFromPC(pc));
    checkbox.checked = !checkbox.checked;
}

// public function
// toggleAll(PCS) -> undefined
function toggleAll(pcs) {
    for (let pc of pcs) {
        toggle(pc);
    }
}

// public function
// getIDFromPC(PC) -> String
function getIDFromPC(pc) {
    return pc.toString();
}

// public function
// getPCFromCheckbox(TODO:HTML) -> PC
function getPCFromCheckbox(check) {
    return parseInt(check.id);
}

// public function
// savePCSToStorage(PCS) -> undefined
function savePCSToStorage(pcs, useManualInput) {
    if (useManualInput) localStorage.setItem("input-text", input.value);
    localStorage.setItem("pcs", pcs.join(","));
}

// public function
// setCheckboxStates() -> undefined
function setCheckboxStates(other) {
    for (let pc of other) {
        let checkbox = document.getElementById(getIDFromPC(pc));
        checkbox.checked = true;
    }
}