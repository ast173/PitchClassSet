// settings
// 0, 1, ... or C, C#, ...
const setting1 = document.getElementById("notes-number");
let htmlElement1 = localStorage.getItem("setting-pc-display");

setting1.checked = htmlElement1 === "true";

setting1.addEventListener("change", () => {
    localStorage.setItem("setting-pc-display", setting1.checked.toString());
});