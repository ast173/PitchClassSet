console.log("==================== HISTORY ====================");
console.log("\"./history.js\" has no imports");

export { remember }; // to "./index.js"
export { undo, redo, rememberChangeOfState }; // to "./index.js", "./keyboard.js"

// ==================== HISTORY ====================
// private variable
let history = [];
// private variable
let pointer = 0;

// public function
// undo() -> undefined
function undo() {
    if (pointer === -history.length) return;
    pointer--;
    loadHistoryAtPointer();
}

// public function
// redo() -> undefined
function redo() {
    if (pointer === 0) return;
    loadHistoryAtPointer();
    pointer++;
}

// private function
// loadHistoryAtPointer() -> undefined
function loadHistoryAtPointer() {
    let data = history.at(pointer);
    if (Array.isArray(data)) {
        let pcs = data;
        toggleAll(pcs);
    } else {
        let pc = data
        let pc_checkbox = document.getElementById(pc.toString());
        pc_checkbox.checked = !pc_checkbox.checked;
    }
}

// private function
// toggleAll(PCS) -> undefined
function toggleAll(pcs) {
    for (let pc of pcs) {
        toggle(pc);
    }
}

// public function
// remember(PC) -> undefined
function remember(pc) {
    if (pointer < 0) {
        history = history.slice(0, pointer);
        pointer = 0;
    }
    history.push(pc);
}

// public function
// rememberChangeOfState(PCS, PCS) -> undefined
function rememberChangeOfState(lastPCS, currentPCS) {
    let toToggle = getToToggle(lastPCS, currentPCS);
    if (pointer < 0) {
        history = history.slice(0, pointer);
        pointer = 0;
    }
    history.push(toToggle);
}

// private function
// rememberChangeOfState(PCS, PCS) -> PCS
function getToToggle(lastPCS, currentPCS) {
    return [
        ...currentPCS.filter(pc => !lastPCS.includes(pc)),
        ...lastPCS.filter(pc => !currentPCS.includes(pc))
    ];
}

// deprecated function
// rememberChangeOfState() -> undefined
function resetHistory() {
    history.length = 0;
    pointer = 0;
}