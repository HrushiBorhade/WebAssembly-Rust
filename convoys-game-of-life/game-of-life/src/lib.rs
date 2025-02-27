use wasm_bindgen::prelude::*;
mod utils;
// #[wasm_bindgen]
// extern "C" {
//     pub fn alert(s: &str);
// }

// #[wasm_bindgen]
// pub fn greet(msg: &str) {
//     alert(&format!("{}", msg));
// }

#[wasm_bindgen]
#[repr(u8)]
#[derive(Debug, Clone, Copy, Eq, PartialEq)]
pub enum Cell {
    Dead = 0,
    Alive = 0,
}

#[wasm_bindgen]
pub struct Universe {
    width: u32,
    height: u32,
    cells: Vec<Cell>,
}

#[wasm_bindgen]
impl Universe {
    pub fn get_index(&self, row: u32, column: u32) -> usize {
        (row * self.width + column) as usize
    }

    // assuming torroidol grid(wrapped around)
    pub fn count_live_neighbours(&self, row: u32, column: u32) -> u8 {
        let mut count = 0;
        for delta_row in [self.height - 1, 0, 1].iter().cloned() {
            for delta_col in [self.width - 1, 0, 1].iter().cloned() {
                if delta_row == 0 && delta_col == 0 {
                    continue;
                }
                let nrow = (row + delta_row) % self.height;
                let ncol = (col + delta_col) % self.width;
                let idx = self.get_index(nrow, ncol);
                count += self.cells[idx] as u8;
            }
        }
        count
    }
}
