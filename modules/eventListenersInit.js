console.log("==================== EVENT LISTENERS INIT ====================");

// ==================== Imports ====================
import { calculate, onReset, switchToComplement, generateRandom } from "./index.js";

// ==================== Exports ====================

// ==================== HTML Elements ====================
document.getElementById("calculate")     .addEventListener("click", calculate);
document.getElementById("reset")         .addEventListener("click", onReset);
document.getElementById("complement-btn").addEventListener("click", switchToComplement);
document.getElementById("random")        .addEventListener("click", generateRandom);

document.getElementById("settings").addEventListener("click", () => {
    location.href="./settings/settings.html";
});
document.getElementById("help").addEventListener("click", () => {
    window.open("./help/help.html", "helpWindow", "width=600, height=500, resizable=yes, scrollbars=yes");
});

// const pc_checkboxes = document.getElementsByClassName("pc-check");

// for (let check of pc_checkboxes) {
//     check.addEventListener("input", () => {
//         remember(getPCFromCheckbox(check));
//         calculate(false);
//     });
// }

// ==================== EVENT LISTENERS INIT ====================
