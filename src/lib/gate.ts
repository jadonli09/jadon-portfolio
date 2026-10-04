/** The lock screen's switch. Off for now: flip to `true` to put the site back behind the sticker puzzle. */
export const GATE_ENABLED = false;

/** localStorage flag set once the lock screen has been solved. */
export const GATE_KEY = "jl_unlocked";

/** Runs before first paint (see layout) so returning visitors never see the gate flash. `?lock` locks the site again. */
export const GATE_SCRIPT = `try{if(/[?&]lock\\b/.test(location.search)){localStorage.removeItem("${GATE_KEY}");sessionStorage.removeItem("jl_intro")}if(localStorage.getItem("${GATE_KEY}"))document.documentElement.dataset.unlocked="1"}catch(e){}`;
