console.log("==================== AUDIO ====================");

// ==================== Imports ====================
import { MAX_SEMITONES } from "./util.js";
import { getPCS } from "./index.js";
console.log("Imported items from \"./util.js\"");
console.log("Imported items from \"./index.js\"");

// ==================== Exports ====================

// ==================== HTML Elements ====================
const play_btn = document.getElementById("play");
const stop_btn = document.getElementById("stop");

// ==================== AUDIO ====================
const audioCtx = new AudioContext();

let audioBuffers = [];
let sources = [];
let stopped = false;
let playing = false;

// private function
// loadPiano() -> undefined
async function loadPiano() {
    for (let pc of [...Array(MAX_SEMITONES).keys()]) {
        const file = await fetch(`../audio/pc_${pc}.mp3`);
        const arrayBuffer = await file.arrayBuffer();
        audioBuffers[pc] = await audioCtx.decodeAudioData(arrayBuffer);
    }
}

// private function
// playNote(PC) -> undefined
function playNote(pc) {
    if (stopped) return;

    const audioData = audioBuffers[pc];

    const source = audioCtx.createBufferSource();
    source.buffer = audioData;

    const gain = audioCtx.createGain();
    gain.gain.value = 0.8;

    source.connect(gain);
    gain.connect(audioCtx.destination);

    sources.push(source);

    source.start();
}

// private function
// playSolid(PCS) -> undefined
function playSolid(pcs) {
    pcs.forEach(playNote);
}

// private function
// sleep(Number) -> Promise
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// private function
// playBroken(PCS) -> undefined
async function playBroken(pcs) {
    for (let pc of pcs) {
        playNote(pc);
        await sleep(250);
    }
}

await loadPiano();
play_btn.addEventListener("click", async () => {
    audioCtx.resume();
    
    if (playing) return;
    playing = true;

    let pcs = getPCS();
    pcs = pcs.sort((a, b) => a - b);

    await playBroken(pcs);

    if (pcs.length % 2 === 1) {
        await sleep(250);
    }

    if (pcs.length > 1) {
        playSolid(pcs);
        await sleep(1000);
    }

    playing = false;
});

// stop_btn.addEventListener("click", () => {
//     stopped = true;
//     sources.forEach(source => source.stop());
//     sources.length = 0;
// });