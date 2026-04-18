console.log("==================== TRANSFORMATIONS ====================");

// ==================== Imports ====================
import { MAX_SEMITONES, UNORDERED, formatOutput } from "./util/util.js";
import { showMultiple } from "./loadSettings.js";
import { getTn, getTnI } from "./deep.js";
import { getPCS } from "./index.js";

console.log("Imported items from \"./util.js\"");
console.log("Imported items from \"./loadSettings.js\"");
console.log("Imported items from \"./deep.js\"");
console.log("Imported items from \"./index.js\"");

// ==================== Exports ====================
export { handleTransformations, resizeHeight }; // to "./index.js"

// ==================== HTML Elements ====================
const Tn_output     = document.getElementById("Tn-output");
const TnI_output    = document.getElementById("TnI-output");
const Tn_select     = document.getElementById("Tn-select");
const TnI_select    = document.getElementById("TnI-select");

Tn_select.addEventListener("change", () => {
    Tn_output.value = formatOutput(getTn([...getPCS()], parseInt(Tn_select.value)), UNORDERED);
});

TnI_select.addEventListener("change", () => {
    TnI_output.value = formatOutput(getTnI([...getPCS()], parseInt(TnI_select.value)), UNORDERED);
});

// ==================== TRANSFORMATIONS ====================
// public function
// resizeHeight(HTMLElement) -> undefined
function resizeHeight(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
}

// public function
// handleTransformations() -> undefined
function handleTransformations() {
    let pcs = getPCS();

    if (!showMultiple) {
        setTextAlign("center");
        Tn_output.value = formatOutput(getTn([...pcs], parseInt(Tn_select.value)), UNORDERED);
        TnI_output.value = formatOutput(getTnI([...pcs], parseInt(TnI_select.value)), UNORDERED);
        return;
    }

    if (pcs.length === 0) {
        setTextAlign("center");
        Tn_output.value = "[]";
        TnI_output.value = "[]";
        return;
    }

    setTextAlign("left");

    Tn_output.value = [...Array(MAX_SEMITONES).keys()]
        .map(pc => getTextStart(pc) + formatOutput(getTn([...pcs], pc), UNORDERED))
        .join("\n");
    TnI_output.value = [...Array(MAX_SEMITONES).keys()]
        .map(pc => getTextStart(pc) + formatOutput(getTnI([...pcs], pc), UNORDERED))
        .join("\n");
}

// private function
// setTextAlign(String) -> undefined
function setTextAlign(align) {
    Tn_output.style.textAlign = align;
    TnI_output.style.textAlign = align;
}

const TRANS_SPACES = 4;
// private function
// resizeHeight(PC) -> String
function getTextStart(pc) {
    let result = " ".repeat(TRANS_SPACES - pc.toString().length);
    result += `n = ${pc}: `;
    return result;
}