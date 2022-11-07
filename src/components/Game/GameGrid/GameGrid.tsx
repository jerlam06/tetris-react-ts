import { useEffect, useRef, useState } from "react";
import { MoveDirection, ShapeType } from "../../../utils/@types";
import { initialGrid, tetrominoes } from "../../../utils/game-data";
import { canMoveTo, moveTetro, rotateTetro, updateGrid } from "../../../utils/utils";
import useInterval from "../../_hooks/useInterval";
import useUserInput from "../../_hooks/useUserInput";
import Row from "./Row/Row";

const initialTetromino: CurrentTetromino = {
    shape: tetrominoes.J,
    shapeType: ShapeType.J,
    rotationIdx: 0,
    x: 2,
    y: 0,
    applyRotation: function () {
        if (this.rotationIdx === 3) {
            this.rotationIdx = 0;
        } else {
            this.rotationIdx++;
        }
    },
};

export default function GameGrid({ paused }: { paused: boolean }) {
    const [grid, setGrid] = useState(initialGrid);
    const [currentTetro, setCurrentTetro] = useState(initialTetromino);
    const [keyPressed, nextKey] = useUserInput();

    // Game Loop
    useInterval(
        () => {
            if (canMoveTo(MoveDirection.down, grid)) {
                setCurrentTetro((tetro) => moveTetro(MoveDirection.down, tetro));
            }
        },
        paused ? null : 800
    );

    useEffect(() => {
        setGrid(updateGrid(grid, currentTetro));
    }, [currentTetro]);

    function handleOnRotate() {
        setCurrentTetro(rotateTetro(currentTetro, grid));
    }

    function handleOnMove() {
        if (keyPressed === "left" && canMoveTo(MoveDirection.left, grid)) {
            setCurrentTetro((tetro) => moveTetro(MoveDirection.left, tetro));
        }
        if (keyPressed === "right" && canMoveTo(MoveDirection.right, grid)) {
            setCurrentTetro((tetro) => moveTetro(MoveDirection.right, tetro));
        }
        if (keyPressed === "down" && canMoveTo(MoveDirection.down, grid)) {
            setCurrentTetro((tetro) => moveTetro(MoveDirection.down, tetro));
        }
    }

    if (!paused && keyPressed !== null) {
        nextKey();
    } else if (keyPressed !== null) {
        switch (keyPressed) {
            case "up":
                handleOnRotate();
                break;
            case "left":
            case "right":
            case "down":
                handleOnMove();
                break;
        }
        nextKey();
    }

    return (
        <div className="GameGrid" style={styles}>
            {grid.map((row, idx) => {
                return <Row index={idx + 1} cells={row} key={idx} />;
            })}
        </div>
    );
}

const styles: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
};
