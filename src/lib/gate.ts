/** The lock screen's switch. On: the site sits behind the sticker puzzle. Flip to `false` to switch it off. */
export const GATE_ENABLED = true;

/** localStorage flag set once the lock screen has been solved. */
export const GATE_KEY = "jl_unlocked";

/** Runs before first paint (see layout) so returning visitors never see the gate flash. `?lock` locks the site again. */
export const GATE_SCRIPT = `try{if(/[?&]lock\\b/.test(location.search)){localStorage.removeItem("${GATE_KEY}");sessionStorage.removeItem("jl_intro")}if(localStorage.getItem("${GATE_KEY}"))document.documentElement.dataset.unlocked="1"}catch(e){}`;
