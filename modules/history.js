console.log("==================== HISTORY ====================");
import { toggle } from "./index.js";
console.log("Imported items from \"./history.js\"");
console.log(`Test 4.1\n${toggle}`);

export { remember }; // to "./index.js"
export { undo, redo, rememberChangeOfState }; // to "./index.js", "./keyboard.js"
export { logHistory }; // to "./onStart.js"

// ==================== HISTORY ====================
// private variable
let history = [];
// private variable
let pointer = 0;

// public function
// undo() -> undefined
function undo() {
    if (pointer === -history.length) {
        console.log("Pointer is already at END, cannot undo any more");
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
        console.log("Pointer is already at START, cannot redo any more");
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

// public function
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
    if (history.length === 0) {
        console.log("[");
        console.log(`      <- Pointer=END/START: ${pointer}`);
        console.log("]");
        return;
    }

    console.log("[");
    for (let i = 0; i < history.length; i++) {
        if (i === 0 && pointer === -history.length) {
            console.log(`      <- Pointer=END: ${pointer}`);
        }

        let e = history[i];
        if (e instanceof Number) {
            console.log(`    ${i}: ${e}`);
        } else if (e instanceof Array) {
            console.log(`    ${i}: [${e.join(", ")}]`);
        } else {
            console.log(`    ${i}: ${e}`);
        }

        if (pointer === 0 && i === history.length - 1) {
            console.log(`      <- Pointer=START: ${pointer}`);
        } else if (pointer === i + 1 - history.length) {
            console.log(`      <- Pointer: ${pointer}`);
        }
    }
    console.log("]");
}