import { MoveDirection, ShapeType } from "./@types";
import { tetrominoes, wallKickData, wallKickDataI } from "./game-data";
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

    function applyRotation(rotation: number) {
        if (rotation === 3) {
            return 0;
        }
        return rotation++;
    }
    const tetroTest = { ...tetro, shape: JSON.parse(JSON.stringify(tetro.shape)) };
    tetroTest.shape = rotateMatrix(tetro.shape);
    tetroTest.rotationIdx = applyRotation(tetroTest.rotationIdx);

    const wkData =
        tetroTest.shapeType === ShapeType.I
            ? wallKickDataI[tetroTest.rotationIdx]
            : wallKickData[tetroTest.rotationIdx];
    let rotateSuccess = false;

    for (let i = 0; i < wkData.length; i++) {
        const xOffset = wkData[i][0];
        const yOffset = -wkData[i][1];

        const success = wallKickCheck(grid, tetroTest, xOffset, yOffset);
        if (success) {
            rotateSuccess = true;
            tetroTest.x += xOffset;
            tetroTest.y += yOffset;
            break;
        }
    }

    if (rotateSuccess) {
        return tetroTest;
    } else {
        return { ...tetro };
    }
}

export function wallKickCheck(grid: Array<string[]>, tetro: CurrentTetromino, xOffset: number, yOffset: number) {
    const newGrid = cleanGrid(grid);
    const xPos = tetro.x;
    const yPos = tetro.y;
    const tetroSize = tetro.shape.length;

    const startY = yPos;
    const endY = yPos + tetroSize;
    for (let y = startY; y < endY; y++) {
        for (let x = xPos; x < xPos + tetroSize; x++) {
            const tetroCell = tetro.shape[y - yPos][x - xPos];

            if (tetroCell === "X") {
                if (newGrid[y + yOffset] === undefined || isCellBusy(newGrid[y + yOffset][x + xOffset])) {
                    return false;
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
                if (tetroCell === "X") {
                    newGrid[y][x] = "X";
                }
            }
        }
    }

    return newGrid;
}

function cleanGrid(grid: Array<string[]>) {
    const newGrid: Array<string[]> = [];
    for (let y = 0; y < grid.length; y++) {
        const row = grid[y];
        if (newGrid[y] === undefined) newGrid[y] = [];
        for (let x = 0; x < row.length; x++) {
            const cell = row[x];
            if (cell === "X") {
                newGrid[y][x] = "";
            } else {
                newGrid[y][x] = cell;
            }
        }
    }
    return newGrid;
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
            if (cell === "X") {
                const adjacentLeft = grid[y][x - 1];
                if (isCellBusy(adjacentLeft)) {
                    canMoveTo.left = false;
                }
                const adjacentRight = grid[y][x + 1];
                if (isCellBusy(adjacentRight)) {
                    canMoveTo.right = false;
                }
                if (y === gameSettings.gridHeight - 1) {
                    canMoveTo.down = false;
                } else {
                    const adjacentDown = grid[y + 1][x];
                    if (isCellBusy(adjacentDown)) {
                        canMoveTo.down = false;
                    }
                }
            }
        }
    }
    // console.log(canMoveTo);

    return canMoveTo[dir];
}

function isCellBusy(cell: string) {
    if (cell === undefined || (cell !== "" && cell !== "X")) return true;
    return false;
}

export function saveTetroOnGrid(grid: Array<string[]>, tetro: CurrentTetromino) {
    const newGrid: Array<string[]> = [];
    for (let y = 0; y < grid.length; y++) {
        const row = grid[y];
        if (newGrid[y] === undefined) newGrid[y] = [];
        for (let x = 0; x < row.length; x++) {
            const cell = row[x];
            if (cell === "X") {
                newGrid[y][x] = tetro.shapeType;
            } else {
                newGrid[y][x] = cell;
            }
        }
    }

    // Removes full lines
    const newGrid2 = [];
    for (let y = 0; y < newGrid.length; y++) {
        const row = newGrid[y];
        if (!row.some((c) => c === "")) {
            newGrid2.unshift(["", "", "", "", "", "", "", "", "", ""]);
            continue;
        }
        newGrid2.push(newGrid[y]);
    }
    return newGrid2;
}

export function newTetro(): CurrentTetromino {
    const shapes = [ShapeType.I, ShapeType.J, ShapeType.L, ShapeType.O, ShapeType.S, ShapeType.T, ShapeType.Z];
    const randShape = shapes[Math.floor(Math.random() * shapes.length)];

    return {
        shape: tetrominoes[randShape],
        shapeType: ShapeType[randShape],
        rotationIdx: 0,
        x: 2,
        y: 0,
    };
}
