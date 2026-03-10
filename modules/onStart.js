console.log("==================== ON START ====================");
console.log("In \"./index.html\" load order:");
console.log("\"./modules/onStart.js\"");
console.log("\"./modules/keyboard.js\"");
console.log("\"./modules/index.js\"");

console.log("Load order:");
console.log("1. UTIL");
console.log("2. UTIL2");
console.log("3. MAPS");
console.log("4. DEEP");
console.log("5. MANUAL");
console.log("6. HISTORY");
console.log("7. LOAD SETTINGS");
console.log("8. KEYBOARD");
console.log("9. INDEX");

/*
TODO: show unique transpositions/inversions
TODO: add supersets and subsets
TODO: add 'is subset of' options
TODO: remove the calculate button
TODO: add a play button that plays the chord solid and broken
the datatype TODO:HTML needs refinement

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