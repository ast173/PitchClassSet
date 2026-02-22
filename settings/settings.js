// private function
// getStorageAndSet(String, String) -> undefined
function getStorageAndSet(htmlID, storageItem) {
    const htmlCheckbox = document.getElementById(htmlID);
    const setting = localStorage.getItem(storageItem);
    htmlCheckbox.checked = setting === "true";

    htmlCheckbox.addEventListener("change", () => {
        localStorage.setItem(storageItem, htmlCheckbox.checked.toString());
    });
}

getStorageAndSet("notes-number", "setting:pc-display");
getStorageAndSet("ten-eleven", "setting:ten-eleven");
getStorageAndSet("forte-rahn", "setting:packing-type");
getStorageAndSet("manual-input", "setting:manual-input");
getStorageAndSet("show-multiple", "setting:show-multiple");
getStorageAndSet("show-unique", "setting:show-unique");