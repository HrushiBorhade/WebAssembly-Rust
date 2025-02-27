use wasm_bindgen::prelude::*;
mod utils;
#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(msg: &str) {
    alert(&format!("{}", msg));
}
