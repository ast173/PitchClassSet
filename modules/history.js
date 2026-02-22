console.log("==================== HISTORY ====================");
import { toggleAll, getIDFromPC } from "./util2.js";
console.log("Imported items from \"./util2.js\"");

export { undo, redo, remember, rememberAll, getDifference }; // to "./index.js", "./keyboard.js"

// ==================== HISTORY ====================
// private variable
let history = [];
// private variable
// pointer <= 0
let pointer = 0;

// public function
// undo() -> undefined
function undo() {
    if (pointer === -history.length) {
        console.log("Pointer is already at START, cannot undo any more");
        return;
    }
    pointer--;
    loadHistoryAtPointer();
    logHistory();
}

// public function
// redo() -> undefined
function redo() {
    if (pointer === 0) {
        console.log("Pointer is already at END, cannot redo any more");
        return;
    }
    loadHistoryAtPointer();
    pointer++;
    logHistory();
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
        let pc_checkbox = document.getElementById(getIDFromPC(pc));
        pc_checkbox.checked = !pc_checkbox.checked;
    }
}

// public function
// remember(PC) -> undefined
function remember(pc) {
    sliceHistory();
    history.push(pc);
    logHistory();
}

// private function
// sliceHistory() -> undefined
function sliceHistory() {
    if (pointer === 0) return;
    history = history.slice(0, pointer);
    pointer = 0;
}

// public function
// rememberAll(PCS) -> undefined
function rememberAll(pcs) {
    sliceHistory();
    if (pcs.length == 0) {
        console.log("No change to history");
        return;
    }
    history.push(pcs);
    logHistory();
}

// public function
// getDifference(PCS, PCS) -> PCS
function getDifference(lastPCS, currentPCS) {
    return [
        ...currentPCS.filter(pc => !lastPCS.includes(pc)),
        ...lastPCS.filter(pc => !currentPCS.includes(pc))
    ];
}

// private function
// logHistory() -> undefined
function logHistory() {
    console.log("==================== SNAPSHOT ====================");
    console.log("History:");
    getHistory();
    console.log(`History Length: ${history.length}`);
    console.log(`Pointer: ${pointer}`);
}

// private function
// getHistory() -> undefined
function getHistory() {
    const TAB = " ".repeat(4);
    const POINTER_TAB = " ".repeat(6);

    console.log("[");

    if (history.length === 0) {
        console.log(`${POINTER_TAB}<- Pointer=START/END: ${pointer}`);
        console.log("]");
        return;
    }

    let pointerPosition = pointer + history.length;
    
    for (let i = 0; i < history.length; i++) {
        if (pointerPosition === i && i === 0) {
            console.log(`${POINTER_TAB}<- Pointer=START: ${pointer}`);
        }

        let e = history[i];
        if (e instanceof Array) {
            console.log(`${TAB}${i}: [${e.join(", ")}]`);
        } else {
            console.log(`${TAB}${i}: ${e}`);
        }

        if (pointerPosition === i + 1) {
            if (pointer === 0) {
                console.log(`${POINTER_TAB}<- Pointer=END: ${pointer}`);
            } else {
                console.log(`${POINTER_TAB}<- Pointer: ${pointer}`);
            }
        }
    }
    console.log("]");
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("==================== LOGGING START ====================");
    logHistory();
});