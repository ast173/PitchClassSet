console.log("==================== UTIL2 ====================");

// ==================== Imports ====================
console.log("\"./util2.js\" has no imports");

// ==================== Exports ====================
export { getIDFromPC, toggleAll } // to "./history.js"
export { getPCFromCheckbox, savePCS, saveInputText, setCheckboxStates }; // to "./index.js"
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
    pcs.forEach(toggle);
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
// savePCS(PCS) -> undefined
function savePCS(pcs) {
    localStorage.setItem("pcs", pcs.join(","));
}

// public function
// saveInputText() -> undefined
function saveInputText(useManualInput) {
    if (!useManualInput) {
        localStorage.setItem("input-text", input.value);
    }
}

// public function
// setCheckboxStates() -> undefined
function setCheckboxStates(pcs) {
    for (let pc of pcs) {
        let checkbox = document.getElementById(getIDFromPC(pc));
        checkbox.checked = true;
    }
}