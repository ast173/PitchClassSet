console.log("==================== ON START ====================");
console.log("In \"./index.html\" load order:");
console.log("\"./modules/onStart.js\"");
console.log("\"./modules/index.js\"");
console.log("\"./modules/loadSettings.js\"");

console.log("Load order:");
console.log("1. UTIL");
console.log("2. UTIL2");
console.log("3. MAPS");
console.log("4. DEEP");
console.log("5. HISTORY");
console.log("6. LOAD SETTINGS");
console.log("7. KEYBOARD");
console.log("8. INDEX");

/*
TODO: add supersets and subsets
TODO: add 'is subset of' options
TODO: show unique transpositions/inversions
TODO:HTML needs work

DATATYPES
let a PC be of datatype Number and to be a positive integer of 0, 1, 2, ..., 11
let a PCS be of datatype Array[PC...] and to have no duplicates and be unordered
let a NormalOrder be of datatype PCS but it is sorted in ascending order
let a Integer be of datatype Number and to be an integer
let a Natural be of datatype Integer and to be non negative
check "./util.js" for definitions of PackingType and FormatingType

FUNCTION VISIBILITY
private means only used within its own .js file
public means exported and used in other .js files
*/