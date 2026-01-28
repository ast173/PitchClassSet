console.log("==================== HISTORY ====================");
console.log("\"./history.js\" has no imports");

export { remember }; // to "./index.js"
export { undo, redo, rememberChangeOfState }; // to "./index.js", "./keyboard.js"

// ==================== HISTORY ====================
let history = [];
let pointer = 0;
function undo() {
    if (pointer === -history.length) return;
    pointer--;
    loadHistoryAtPointer();
}

function redo() {
    if (pointer === 0) return;
    loadHistoryAtPointer();
    pointer++;
}

// private
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

function remember(pc) {
    if (pointer < 0) {
        history = history.slice(0, pointer);
        pointer = 0;
    }
    history.push(pc);
}

function rememberChangeOfState(lastPCS, currentPCS) {
    let toToggle = getToToggle(lastPCS, currentPCS);
    if (pointer < 0) {
        history = history.slice(0, pointer);
        pointer = 0;
    }
    history.push(toToggle);
}

// private
function getToToggle(last, cur) {
    return [
        ...cur.filter(pc => !last.includes(pc)),
        ...last.filter(pc => !cur.includes(pc))
    ];
}

function resetHistory() {
    history.length = 0;
    pointer = 0;
}

// private
// toggleAll(): Array[Number...] -> void
function toggleAll(pcs) {
    for (let pc of pcs) {
        toggle(pc);
    }
}