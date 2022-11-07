import { MoveDirection, ShapeType } from "./@types";
import { wallKickData, wallKickDataI } from "./game-data";
import gameSettings from "./game-settings.json";

export function rotateMatrix(matrix: Array<Array<string>>) {
    const size = matrix.length;
    const newMatrix: Array<Array<string>> = [];

    for (let i = 0; i < size; ++i) {
        if (newMatrix[i] === undefined) {
            newMatrix[i] = [];
        }

        for (let j = 0; j < size; ++j) {
            newMatrix[i][j] = matrix[size - j - 1][i];
        }
    }

    return newMatrix;
}

export function rotateTetro(tetro: CurrentTetromino, grid: Array<string[]>): CurrentTetromino {
    if (tetro.shapeType === ShapeType.O) return tetro;

    const tetroTest = { ...tetro, shape: JSON.parse(JSON.stringify(tetro.shape)) };
    tetroTest.shape = rotateMatrix(tetro.shape);
    tetroTest.applyRotation();
    console.log("rotation idx test:", tetroTest.rotationIdx);

    const wkData = tetroTest.shapeType === ShapeType.I ? wallKickDataI[tetroTest.rotationIdx] : wallKickData[tetroTest.rotationIdx];
    let rotateSuccess = false;
    for (const test in wkData) {
        const xOffset = wkData[test][0];
        const yOffset = wkData[test][1];
        // console.log("testX", testX);
        // console.log("testY", testY);

        const success = wallKickCheck(grid, tetroTest, xOffset, yOffset);
        if (success) {
            rotateSuccess = true;
            tetroTest.x += wkData[test][0];
            tetroTest.y += wkData[test][1];
            break;
        }
    }

    if (rotateSuccess) {
        console.log(" rotate Success", tetroTest.x, tetroTest.y);

        return tetroTest;
    } else {
        return { ...tetro };
    }
}

export function wallKickCheck(grid: Array<string[]>, tetro: CurrentTetromino, xOffset: number, yOffset: number) {
    console.log(" shape:", tetro.shape);

    const newGrid = cleanGrid(JSON.parse(JSON.stringify(grid)));
    const xPos = tetro.x + xOffset;
    const yPos = tetro.y + yOffset;
    const tetroSize = tetro.shape.length;
    console.log("xPos", tetro.x, "+", xOffset);
    console.log("yPos", tetro.y, "+", yOffset);

    for (let y = 0; y < gameSettings.gridHeight - 1; y++) {
        if (y < yPos) continue; // If tetro is not passed yet
        if (y >= yPos + tetroSize) break; // If tetro was already passed
        const yWithOffset = y + yOffset;

        for (let x = 0; x < gameSettings.gridWidth - 1; x++) {
            if (x < xPos) continue;
            if (x >= xPos + tetroSize) continue;
            const xWithOffset = x + xOffset;

            console.log("y", y);
            console.log("x", x);
            console.log("yPos", yPos);
            console.log("xPos", xPos);
            const tetroCell = tetro.shape[y - yPos][x - xPos];
            const isAllowed =
                newGrid[yWithOffset] !== undefined && newGrid[yWithOffset][xWithOffset] !== undefined && newGrid[yWithOffset][xWithOffset] !== "X";

            console.log("newGrid[yWithOffset][xWithOffset]", newGrid[yWithOffset][xWithOffset], yWithOffset, xWithOffset);

            if (tetroCell === "O") {
                if (isAllowed) {
                    // newGrid[y][x] = "O";
                } else {
                    console.log("y", y);
                    console.log("x", x);
                    console.warn("Tetro cannot rotate, next test...");
                    // Is not allwed
                    return false;
                }
            } else {
                if (isAllowed) {
                    // newGrid[y][x] = "";
                }
            }
        }
    }
    return true;
}

export function moveTetro(dir: MoveDirection, tetro: CurrentTetromino) {
    return {
        ...tetro,
        x: dir === "left" ? tetro.x - 1 : dir === "right" ? tetro.x + 1 : tetro.x,
        y: dir === "down" ? tetro.y + 1 : tetro.y,
    };
}

export function updateGrid(grid: Array<string[]>, tetro: CurrentTetromino) {
    const newGrid = cleanGrid([...grid]);
    const xPos = tetro.x;
    const yPos = tetro.y;
    const tetroSize = tetro.shape.length;

    const startY = yPos;
    const endY = yPos + tetroSize;
    for (let y = startY; y < endY; y++) {
        for (let x = xPos; x < xPos + tetroSize; x++) {
            const tetroCell = tetro.shape[y - yPos][x - xPos];
            // Make sure tetroCell is not out of grid
            if (newGrid[y] !== undefined && newGrid[y][x] !== undefined) {
                if (tetroCell === "O") {
                    newGrid[y][x] = "O";
                } else {
                    newGrid[y][x] = "";
                }
            }
        }
    }
    return newGrid;
}

function cleanGrid(grid: Array<string[]>) {
    for (let y = 0; y < grid.length; y++) {
        const row = grid[y];
        for (let x = 0; x < row.length; x++) {
            const cell = row[x];
            if (cell === "O") {
                grid[y][x] = "";
            }
        }
    }

    return grid;
}

export function canMoveTo(dir: MoveDirection, grid: Array<string[]>) {
    const canMoveTo = {
        left: true,
        right: true,
        down: true,
    };

    for (let y = 0; y < grid.length; y++) {
        const row = grid[y];
        for (let x = 0; x < row.length; x++) {
            const cell = row[x];
            if (cell === "O") {
                const adjacentLeft = grid[y][x - 1];
                if (adjacentLeft === undefined || adjacentLeft === "X") {
                    canMoveTo.left = false;
                }
                const adjacentRight = grid[y][x + 1];
                if (adjacentRight === undefined || adjacentRight === "X") {
                    canMoveTo.right = false;
                }
                if (y === gameSettings.gridHeight - 1) {
                    canMoveTo.down = false;
                } else {
                    const adjacentDown = grid[y + 1][x];
                    if (adjacentDown === undefined || adjacentDown === "X") {
                        canMoveTo.down = false;
                    }
                }
            }
        }
    }

    return canMoveTo[dir];
}

// function checkCanMoveTo(dir: MoveDirection, tetro: CurrentTetromino, grid?: Array<string[]>): boolean {
//     console.log(tetro.x);

//     if (dir === MoveDirection.right) {
//         if (tetro.x < gameSettings.gridWidth - tetro.shape.length + (hasInnerOffset(tetro).right ? 1 : 0)) {
//             return true;
//         }
//     }
//     if (dir === MoveDirection.left) {
//         if (tetro.x > 0 - (hasInnerOffset(tetro).left ? 1 : 0)) {
//             return true;
//         }
//     }
//     if (dir === MoveDirection.down) {
//         if (tetro.y < gameSettings.gridHeight - tetro.shape.length + (hasInnerOffset(tetro).down ? 1 : 0)) {
//             return true;
//         }
//     }
//     return false;
// }

// function hasInnerOffset(tetro: CurrentTetromino, checkDoubleOffset?: boolean) {
//     const offsets: Offsets = {
//         left: true,
//         right: true,
//         down: true,
//     };

//     if (checkDoubleOffset) {
//         offsets.doubleLeft = true;
//     }

//     for (let y = 0; y < tetro.shape.length; y++) {
//         for (let x = 0; x < tetro.shape.length; x++) {
//             const cell = tetro.shape[y][x];

//             if (offsets.left === true && x === 0 && cell === "O") {
//                 offsets.left = false;
//             }
//             if (offsets.right === true && x === tetro.shape.length - 1 && cell === "O") {
//                 offsets.right = false;
//             }
//             if (offsets.down === true && y === tetro.shape.length - 1 && cell === "O") {
//                 offsets.down = false;
//             }
//         }
//     }
//     return offsets;
// }
