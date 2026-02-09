console.log("==================== HISTORY ====================");
import { toggle, getIDFromPC } from "./index.js";
console.log("Imported items from \"./history.js\"");
// console.log(`Test 4.1\n${toggle}`);

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
        // console.log("Set pointer to 0"); // TODO: move this in front of the snapshot
    }
    history.push(pc);

    logHistory();
}

// public function
// rememberChangeOfState(PCS, PCS) -> undefined
function rememberChangeOfState(lastPCS, currentPCS) {
    let toToggle = getToToggle(lastPCS, currentPCS);
    if (pointer < 0) {
        history = history.slice(0, pointer);
        pointer = 0;
        // console.log("Set pointer to 0");
    }
    history.push(toToggle);

    logHistory();
}

// private function
// rememberChangeOfState(PCS, PCS) -> PCS
function getToToggle(lastPCS, currentPCS) {
    return [
        ...currentPCS.filter(pc => !lastPCS.includes(pc)),
        ...lastPCS.filter(pc => !currentPCS.includes(pc))
    ];
}

// private function
// logHistory() -> undefined
function logHistory() {
    console.log("==================== SNAPSHOT ====================");
    console.log("History:")
    logHistoryString();
    console.log(`History Length: ${history.length}`);
    console.log(`Pointer: ${pointer}`);
}

// private function
// logHistoryString() -> undefined
function logHistoryString() {
    console.log("[");

    if (history.length === 0) {
        console.log(`      <- Pointer=START/END: ${pointer}`);
        console.log("]");
        return;
    }

    let pointerPosition = history.length + pointer;
    
    for (let i = 0; i <= history.length; i++) {
        // if (pointer === -history.length && i === 0) {
        if (pointerPosition === 0 && i === 0) {
            console.log(`      <- Pointer=START: ${pointer}`);
        }

        let e = history[i];
        if (e instanceof Array) {
            console.log(`    ${i}: [${e.join(", ")}]`);
        } else {
            console.log(`    ${i}: ${e}`);
        }

        if (pointer === 0 && i + 1 === history.length + pointer) {
        // if (pointer === 0 && i === history.length - 1) {
            console.log(`      <- Pointer=END: ${pointer}`);
        } else if (i + 1 === pointerPosition) {
        // } else if (pointer === i + 1 - history.length) {
            console.log(`      <- Pointer: ${pointer}`);
        }
    }
    console.log("]");
}

logHistory();