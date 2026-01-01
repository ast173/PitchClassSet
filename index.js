function getNormalOrder(pcs) {
    pcs = transposeAndSort(pcs);

    let minRange = 12;
    let order = pcs;
    for (let i = 0; i < pcs.length; i++) {
        let rotation = rotate(pcs, i);

        let first = rotation[0];
        rotation = rotation.map(pc => mod12(pc - first));

        let range = rotation.at(-1) - rotation.at(0);

        if (range < minRange) {
            order = rotation;
            minRange = range;
        } else if (range === minRange) {
            order = tiebreak(order, rotation);
        }
    }

    return order;
}

function transposeAndSort(pcs) {
    let first = pcs[0];
    pcs = pcs.map(pc => mod12(pc - first));
    return pcs.sort((a, b) => a - b);
}

function mod12(n) {
    return ((n % 12) + 12) % 12;
}

function rotate(arr, n) {
    return arr.slice(n).concat(arr.slice(0, n));
}

function tiebreak(oldCand, newCand) {
    for (let i = 0; i < oldCand.length; i++) {
        if (oldCand[i] < newCand[i]) {
            return oldCand;
        } else if (oldCand[i] > newCand[i]) {
            return newCand;
        }
    }
    return oldCand;
}

console.log(getNormalOrder([5, 10, 8, 1, 3])); // [0,2,4,7,9]

function getPrimeForm(pcs) {
    pcs = transposeAndSort(pcs);

    let pcsr = [...pcs];
    pcsr = transposeAndSort(invert(pcsr));

    return tiebreak(getNormalOrder(pcs), getNormalOrder(pcsr));
}

function invert(pcs) {
    return transposeAndSort(pcs.map(pc => mod12(-pc)));
}

console.log(getPrimeForm([5, 10, 8, 1, 3])); // (0 2 4 7 9)
console.log(getPrimeForm([2, 3, 4, 8, 11])); // (0 1 2 5 8)

function getICVector(pcs) {
    let icVector = [0, 0, 0, 0, 0, 0];
    let prime = getPrimeForm(pcs);

    for (let i = 0; i < prime.length - 1; i++) {
        for (let j = i + 1; j < prime.length; j++) {
            let ic = getIC(prime[j] - prime[i]);
            icVector[ic - 1]++;
        }
    }

    return icVector;
}

function getIC(interval) {
    interval = mod12(interval)
    if (1 <= interval && interval <= 6) return interval
    return 6 - (interval - 6)
}

console.log(getICVector([2, 3, 4, 8, 11])); // <2 1 2 2 2 1>

function getComplement(pcs) {
    let complement = []

    for (let i = 0; i < 12; i++) {
        if (!pcs.includes(i)) {
            complement.push(i);
        }
    }

    return getNormalOrder(complement);
}

console.log(getComplement([2, 3, 4, 8, 11])); // [0, 1, 5, 6, 7, 9, 10]

const primeToForte = new Map([
    ["", "0-1"],
    ["0", "1-1"],
    ["0, 1", "2-1"],
    ["0, 2", "2-2"],
    ["0, 3", "2-3"],
    ["0, 4", "2-4"],
    ["0, 5", "2-5"],
    ["0, 6", "2-6"],

    // cardinality 3 (12 total prime forms)
    ["0, 1, 2", "3-1"],
    ["0, 1, 3", "3-2"],
    ["0, 1, 4", "3-3"],
    ["0, 1, 5", "3-4"],
    ["0, 1, 6", "3-5"],
    ["0, 2, 4", "3-6"],
    ["0, 2, 5", "3-7"],
    ["0, 2, 6", "3-8"],
    ["0, 2, 7", "3-9"],
    ["0, 3, 6", "3-10"],
    ["0, 3, 7", "3-11"],
    ["0, 4, 8", "3-12"],

    // cardinality 4 (29 total prime forms)
    ["0, 1, 2, 3", "4-1"],
    ["0, 1, 2, 4", "4-2"],
    ["0, 1, 3, 4", "4-3"],
    ["0, 1, 2, 5", "4-4"],
    ["0, 1, 2, 6", "4-5"],
    ["0, 1, 2, 7", "4-6"],
    ["0, 1, 4, 5", "4-7"],
    ["0, 1, 5, 6", "4-8"],
    ["0, 1, 6, 7", "4-9"],
    ["0, 2, 3, 5", "4-10"],
    ["0, 1, 3, 5", "4-11"],
    ["0, 2, 3, 6", "4-12"],
    ["0, 1, 3, 6", "4-13"],
    ["0, 2, 3, 7", "4-14"],
    ["0, 1, 4, 6", "4-Z15"],
    ["0, 1, 5, 7", "4-16"],
    ["0, 3, 4, 7", "4-17"],
    ["0, 1, 4, 7", "4-18"],
    ["0, 1, 4, 8", "4-19"],
    ["0, 1, 5, 8", "4-20"],
    ["0, 2, 4, 6", "4-21"],
    ["0, 2, 4, 7", "4-22"],
    ["0, 2, 5, 7", "4-23"],
    ["0, 2, 4, 8", "4-24"],
    ["0, 2, 6, 8", "4-25"],
    ["0, 3, 5, 8", "4-26"],
    ["0, 2, 5, 8", "4-27"],
    ["0, 3, 6, 9", "4-28"],
    ["0, 1, 3, 7", "4-Z29"],

    // cardinality 5 (38 total prime forms)
    ["0, 1, 2, 3, 4", "5-1"],
    ["0, 1, 2, 3, 5", "5-2"],
    ["0, 1, 2, 4, 5", "5-3"],
    ["0, 1, 2, 3, 6", "5-4"],
    ["0, 1, 2, 3, 7", "5-5"],
    ["0, 1, 2, 5, 6", "5-6"],
    ["0, 1, 2, 6, 7", "5-7"],
    ["0, 2, 3, 4, 6", "5-8"],
    ["0, 1, 2, 4, 6", "5-9"],
    ["0, 1, 3, 4, 6", "5-10"],
    ["0, 2, 3, 4, 7", "5-11"],
    ["0, 1, 3, 5, 6", "5-Z12"],
    ["0, 1, 2, 4, 8", "5-13"],
    ["0, 1, 2, 5, 7", "5-14"],
    ["0, 1, 2, 6, 8", "5-15"],
    ["0, 1, 3, 4, 7", "5-16"],
    ["0, 1, 3, 4, 8", "5-Z17"],
    ["0, 1, 4, 5, 7", "5-Z18"],
    ["0, 1, 3, 6, 7", "5-19"],
    ["0, 1, 5, 6, 8", "5-20"], // Forte: "0, 1, 3, 7, 8", "5-20"
    ["0, 1, 4, 5, 8", "5-21"],
    ["0, 1, 4, 7, 8", "5-22"],
    ["0, 2, 3, 5, 7", "5-23"],
    ["0, 1, 3, 5, 7", "5-24"],
    ["0, 2, 3, 5, 8", "5-25"],
    ["0, 2, 4, 5, 8", "5-26"],
    ["0, 1, 3, 5, 8", "5-27"],
    ["0, 2, 3, 6, 8", "5-28"],
    ["0, 1, 3, 6, 8", "5-29"],
    ["0, 1, 4, 6, 8", "5-30"],
    ["0, 1, 3, 6, 9", "5-31"],
    ["0, 1, 4, 6, 9", "5-32"],
    ["0, 2, 4, 6, 8", "5-33"],
    ["0, 2, 4, 6, 9", "5-34"],
    ["0, 2, 4, 7, 9", "5-35"],
    ["0, 1, 2, 4, 7", "5-Z36"],
    ["0, 3, 4, 5, 8", "5-Z37"],
    ["0, 1, 2, 5, 8", "5-Z38"],

    // cardinality 6 (50 total prime forms)
    ["0, 1, 2, 3, 4, 5", "6-1"],

    // cardinality 8 (29 total IC vectors)
    ["0, 1, 2, 3, 4, 5, 6, 7", "8-1"],
    ["0, 1, 2, 3, 4, 5, 6, 8", "8-2"],
    ["0, 1, 2, 3, 4, 5, 6, 9", "8-3"],
    ["0, 1, 2, 3, 4, 5, 7, 8", "8-4"],
    ["0, 1, 2, 3, 4, 6, 7, 8", "8-5"],
    ["0, 1, 2, 3, 5, 6, 7, 8", "8-6"],
    ["0, 1, 2, 3, 4, 5, 8, 9", "8-7"],
    ["0, 1, 2, 3, 4, 7, 8, 9", "8-8"],
    ["0, 1, 2, 3, 6, 7, 8, 9", "8-9"],
    ["0, 2, 3, 4, 5, 6, 7, 9", "8-10"],
    ["0, 1, 2, 3, 4, 5, 7, 9", "8-11"],
    ["0, 1, 3, 4, 5, 6, 7, 9", "8-12"],
    ["0, 1, 2, 3, 4, 6, 7, 9", "8-13"],
    ["0, 1, 2, 4, 5, 6, 7, 9", "8-14"],
    ["0, 1, 2, 3, 4, 6, 8, 9", "8-Z15"],
    ["0, 1, 2, 3, 5, 7, 8, 9", "8-16"],
    ["0, 1, 3, 4, 5, 6, 8, 9", "8-17"],
    ["0, 1, 2, 3, 5, 6, 8, 9", "8-18"],
    ["0, 1, 2, 4, 5, 6, 8, 9", "8-19"],
    ["0, 1, 2, 4, 5, 7, 8, 9", "8-20"],
    ["0, 1, 2, 3, 4, 6, 8, 10", "8-21"],
    ["0, 1, 2, 3, 5, 6, 8, 10", "8-22"],
    ["0, 1, 2, 3, 5, 7, 8, 10", "8-23"],
    ["0, 1, 2, 4, 5, 6, 8, 10", "8-24"],
    ["0, 1, 2, 4, 6, 7, 8, 10", "8-25"],
    ["0, 1, 3, 4, 5, 7, 8, 10", "8-26"], // Forte: 8-26: ([")0124579T)
    ["0, 1, 2, 4, 5, 7, 8, 10", "8-27"],
    ["0, 1, 3, 4, 6, 7, 9, 10", "8-28"],
    ["0, 1, 2, 3, 5, 6, 7, 9", "8-Z29"],

    // cardinality 9 (12 total prime forms)
    ["0, 1, 2, 3, 4, 5, 6, 7, 8", "9-1"],
    ["0, 1, 2, 3, 4, 5, 6, 7, 9", "9-2"],
    ["0, 1, 2, 3, 4, 5, 6, 8, 9", "9-3"],
    ["0, 1, 2, 3, 4, 5, 7, 8, 9", "9-4"],
    ["0, 1, 2, 3, 4, 6, 7, 8, 9", "9-5"],
    ["0, 1, 2, 3, 4, 5, 6, 8, 10", "9-6"],
    ["0, 1, 2, 3, 4, 5, 7, 8, 10", "9-7"],
    ["0, 1, 2, 3, 4, 6, 7, 8, 10", "9-8"],
    ["0, 1, 2, 3, 5, 6, 7, 8, 10", "9-9"],
    ["0, 1, 2, 3, 4, 6, 7, 9, 10", "9-10"],
    ["0, 1, 2, 3, 5, 6, 7, 9, 10", "9-11"],
    ["0, 1, 2, 4, 5, 6, 8, 9, 10", "9-12"],

    ["0, 1, 2, 3, 4, 5, 6, 7, 8, 9", "10-1"],
    ["0, 1, 2, 3, 4, 5, 6, 7, 8, 10", "10-2"],
    ["0, 1, 2, 3, 4, 5, 6, 7, 9, 10", "10-3"],
    ["0, 1, 2, 3, 4, 5, 6, 8, 9, 10", "10-4"],
    ["0, 1, 2, 3, 4, 5, 7, 8, 9, 10", "10-5"],
    ["0, 1, 2, 3, 4, 6, 7, 8, 9, 10", "10-6"],
    ["0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10", "11-1"],
    ["0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11", "12-1"]
])

// import primeToForte from "./util.js"
function getForteNumber(pcs) {
    return primeToForte.has(getPrimeForm(pcs).join(", ")) ?
        primeToForte.get(getPrimeForm(pcs).join(", ")) :
        "None"
}

const zSets = new Map([
    // cardinality 4 (1 total z-set)
    ["4-Z15", "4-Z29"],
    ["4-Z29", "4-Z15"],

    // cardinality 5 (3 total z-sets)
    ["5-Z12", "5-Z36"],
    ["5-Z36", "5-Z12"],
    ["5-Z17", "5-Z37"],
    ["5-Z37", "5-Z17"],
    ["5-Z18", "5-Z38"],
    ["5-Z38", "5-Z18"],

    // cardinality 6 ("" total z-sets)

    // cardinality 7 (3 total z-sets)
    ["7-Z12", "7-Z36"],
    ["7-Z36", "7-Z12"],
    ["7-Z17", "7-Z37"],
    ["7-Z37", "7-Z17"],
    ["7-Z18", "7-Z38"],
    ["7-Z38", "7-Z18"],

    // cardinality 8 (1 total z-set)
    ["8-Z15", "8-Z29"],
    ["8-Z29", "8-Z15"],
])

function getZMate() {
    return zSets.has(getForteNumber(pcs)) ?
        zSets.get(getForteNumber(pcs)) :
        "None"
}

function getTn(pcs, n) {
    return pcs.map(pc => mod12(pc + n))
}

function getTnI(pcs, n) {
    return pcs.map(pc => mod12(-pc + n)).sort((a, b) => a - b)
}




// index.html
const output = document.getElementById("output");
const normal_order = document.getElementById("normal-order");
const prime_form = document.getElementById("prime-form");
const ic_vector = document.getElementById("ic-vector");
const complement = document.getElementById("complement");
const forte_number = document.getElementById("forte-number");
const z_mate = document.getElementById("z-mate");
const Tn_output = document.getElementById("Tn-output")
const TnI_output = document.getElementById("TnI-output")

const pitch_classes = document.getElementsByClassName("pc");
let pcs = [];

function calculate() {
    pcs = getAllPC();

    output.value = `[${pcs.replaceAll(",", ", ")}]`

    normal_order.value = `[${getNormalOrder(pcs).replaceAll(",", ", ")}]`;
    prime_form.value = `(${getPrimeForm(pcs).replaceAll(",", " ")})`;
    ic_vector.value = `<${getICVector(pcs).replaceAll(",", " ")}>`;
    complement.value = `[${getComplement(pcs).replaceAll(",", ", ")}]`;

    forte_number.value = getForteNumber(pcs);
    z_mate.value = getZMate(pcs);

    Tn_output.value = `[${getTn(pcs, parseInt(document.getElementById("Tn-select").value)).replaceAll(",", ", ")}]`;
    TnI_output.value = `[${getTnI(pcs, parseInt(document.getElementById("TnI-select").value)).replaceAll(",", ", ")}]`;
}

function getAllPC() {
    let pcs = [];

    for (let i = 0; i < pitch_classes.length; i++) {
        if (pitch_classes.item(i).checked) {
            pcs.push(parseInt(pitch_classes.item(i).id));
        }
    }

    return pcs;
}

function reset() {
    output.value = ""

    normal_order.value = "";
    prime_form.value = "";
    ic_vector.value = "";
    complement.value = "";

    forte_number.value = "";
    z_mate.value = "";

    Tn_output.value = ""
    TnI_output.value = ""

    for (let i = 0; i < pitch_classes.length; i++) {
        pitch_classes.item(i).checked = false
    }
}

function complement_btn() {
    for (let i = 0; i < pitch_classes.length; i++) {
        pitch_classes.item(i).checked = !pitch_classes.item(i).checked
    }
}