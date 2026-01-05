// settings
// 0, 1, ... or C, C#, ...
const htmlElement1 = document.getElementById("notes-number");
const setting1 = localStorage.getItem("setting-pc-display");
const usePCNumbers = setting1 === "true";

htmlElement1.checked = usePCNumbers;

htmlElement1.addEventListener("change", () => {
    localStorage.setItem("setting-pc-display", htmlElement1.checked.toString());
});

// 10/11 or T/E
const htmlElement2 = document.getElementById("ten-eleven");
const setting2 = localStorage.getItem("setting-ten-eleven");
const useTAndE = setting2 === "true";

htmlElement2.checked = useTAndE;

htmlElement2.addEventListener("change", () => {
    localStorage.setItem("setting-ten-eleven", htmlElement2.checked.toString());
});

// Rahn or Forte
const htmlElement3 = document.getElementById("forte-rahn");
const setting3 = localStorage.getItem("setting-packing-type");
const useRahn = setting3 === "true";

htmlElement3.checked = useRahn;

htmlElement3.addEventListener("change", () => {
    localStorage.setItem("setting-packing-type", htmlElement3.checked.toString());
});

// One or All
const htmlElement4 = document.getElementById("one-or-all");
const setting4 = localStorage.getItem("setting-one-or-all");
const displayAll = setting4 === "true";

htmlElement4.checked = displayAll;

htmlElement4.addEventListener("change", () => {
    localStorage.setItem("setting-one-or-all", htmlElement4.checked.toString());
});