console.log("==================== ON START ====================");
console.log("In \"./index.html\" load order:");
console.log("\"./modules/onStart.js\"");
console.log("\"./modules/keyboard.js\"");
console.log("\"./modules/index.js\"");
console.log("\"./modules/audio.js\"");
console.log("\"./modules/eventListenersInit.js\"");

console.log("Load order:");
console.log("1. UTIL");
console.log("2. UTIL2");
console.log("3. HISTORY");
console.log("4. MAPS");
console.log("5. DEEP");
console.log("6. MANUAL");
console.log("7. LOAD SETTINGS");
console.log("8. TRANSFORMATIONS");
console.log("9. INDEX");
console.log("10. KEYBOARD");
console.log("11. AUDIO");
console.log("12. EVENT LISTENERS INIT");

/*
TODO: show unique transpositions/inversions
TODO: add supersets and subsets
TODO: add 'is subset of' options
the datatype TODO:HTML needs refinement

DATATYPES
let a PC be of datatype Number and to be of 0, 1, 2, ..., 11
let a PCS be of datatype Array[PC...] and to have no duplicates and be unordered
let a NormalOrder be of datatype PCS but it is sorted in ascending order
let a Integer be of datatype Number and to be an integer
let a Natural be of datatype Integer and to be non negative
check "./util.js" for definitions of PackingType and FormatingType

FUNCTION VISIBILITY
private means only used within its own .js file
public means exported and used in other .js files

Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
firebase serve

Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
firebase deploy

Select-String -Path "public\modules\*.js" -Pattern "from.*[""']\.\/util"
*/