import { Universe, Cell } from "game-of-life";
import { memory } from "game-of-life/game_of_life_bg.wasm";
// const pre = document.getElementById("game-of-life-canvas");
// const universe = Universe.new();

// const renderLoop = () => {
//     pre.textContent = universe.render();
//     universe.tick();

//     requestAnimationFrame(renderLoop);
//   };

//   requestAnimationFrame(renderLoop);

const CELL_SIZE = 25;
const GRID_COLOR = "#262626";
const DEAD_COLOR = "#403f3f";
const ALIVE_COLOR = "#bab6b6";

const universe = Universe.new();
const width = universe.width();
const height = universe.height();

const canvas = document.getElementById("game-of-life-canvas");

canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext("2d");

const renderLoop = () => {
  universe.tick();
  drawGrid();
  drawCells();

  requestAnimationFrame(renderLoop);
};
// const drawGrid = () => {
//   ctx.beginPath();
//   ctx.strokeStyle = GRID_COLOR;

//   // Vertical lines.
//   for (let i = 0; i <= width; i++) {
//     ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
//     ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
//   }

//   // Horizontal lines.
//   for (let j = 0; j <= height; j++) {
//     ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
//     ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
//   }

//   ctx.stroke();
// };

const drawGrid = () => {
    // Draw the inner grid lines first
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;
  
    // Vertical lines (skip the first and last lines, which are part of the border)
    for (let i = 1; i < width; i++) {
      ctx.moveTo(i * (CELL_SIZE + 1) + 1, 1);
      ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height);
    }
  
    // Horizontal lines (skip the first and last lines, which are part of the border)
    for (let j = 1; j < height; j++) {
      ctx.moveTo(1, j * (CELL_SIZE + 1) + 1);
      ctx.lineTo((CELL_SIZE + 1) * width, j * (CELL_SIZE + 1) + 1);
    }
    
    ctx.stroke();
    
    // Draw the rounded border separately
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;
    
    // Calculate border positions
    const leftX = 1;
    const topY = 1;
    const rightX = (CELL_SIZE + 1) * width + 1;
    const bottomY = (CELL_SIZE + 1) * height + 1;
    const cornerRadius = 4; // Same radius as the cells
    
    // Draw the border with rounded corners
    // Start at top left corner, after the rounded part
    ctx.moveTo(leftX + cornerRadius, topY);
    
    // Top border to top right corner
    ctx.lineTo(rightX - cornerRadius, topY);
    ctx.arcTo(rightX, topY, rightX, topY + cornerRadius, cornerRadius);
    
    // Right border to bottom right corner
    ctx.lineTo(rightX, bottomY - cornerRadius);
    ctx.arcTo(rightX, bottomY, rightX - cornerRadius, bottomY, cornerRadius);
    
    // Bottom border to bottom left corner
    ctx.lineTo(leftX + cornerRadius, bottomY);
    ctx.arcTo(leftX, bottomY, leftX, bottomY - cornerRadius, cornerRadius);
    
    // Left border to top left corner
    ctx.lineTo(leftX, topY + cornerRadius);
    ctx.arcTo(leftX, topY, leftX + cornerRadius, topY, cornerRadius);
    
    ctx.stroke();
  };

const getIndex = (row, column) => {
  return row * width + column;
};

// const drawCells = () => {
//   const cellsPtr = universe.cells();
//   const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

//   ctx.beginPath();

//   for (let row = 0; row < height; row++) {
//     for (let col = 0; col < width; col++) {
//       const idx = getIndex(row, col);

//       ctx.fillStyle = cells[idx] === Cell.Dead ? DEAD_COLOR : ALIVE_COLOR;

//       ctx.fillRect(
//         col * (CELL_SIZE + 1) + 1,
//         row * (CELL_SIZE + 1) + 1,
//         CELL_SIZE,
//         CELL_SIZE
//       );
//     }
//   }

//   ctx.stroke();
// };

const drawCells = () => {
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);
    
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const idx = getIndex(row, col);
        ctx.fillStyle = cells[idx] === Cell.Dead ? DEAD_COLOR : ALIVE_COLOR;
        
        const x = col * (CELL_SIZE + 1) + 1;
        const y = row * (CELL_SIZE + 1) + 1;
        
        ctx.beginPath();
        
        // Check if the cell is on an edge
        const isTopEdge = row === 0;
        const isBottomEdge = row === height - 1;
        const isLeftEdge = col === 0;
        const isRightEdge = col === width - 1;
        
        // Define corner radii - only apply to outside corners
        const topLeftRadius = (isTopEdge && isLeftEdge) ? 4 : 0;
        const topRightRadius = (isTopEdge && isRightEdge) ? 4 : 0;
        const bottomLeftRadius = (isBottomEdge && isLeftEdge) ? 4 : 0;
        const bottomRightRadius = (isBottomEdge && isRightEdge) ? 4 : 0;
        
        // Draw the cell with selective rounded corners
        if (topLeftRadius || topRightRadius || bottomLeftRadius || bottomRightRadius) {
          // For cells with at least one rounded corner
          const radii = [topLeftRadius, topRightRadius, bottomRightRadius, bottomLeftRadius];
          ctx.roundRect(x, y, CELL_SIZE, CELL_SIZE, radii);
        } else {
          // For cells with no rounded corners
          ctx.rect(x, y, CELL_SIZE, CELL_SIZE);
        }
        
        ctx.fill();
      }
    }
  };

drawGrid();
drawCells();
requestAnimationFrame(renderLoop);
