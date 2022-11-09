import { useEffect, useState } from "react";
import { MoveDirection } from "../../../utils/@types";
import { initialGrid } from "../../../utils/game-data";
import { canMoveTo, moveTetro, newTetro, rotateTetro, saveTetroOnGrid, updateGrid } from "../../../utils/utils";
import useInterval from "../../_hooks/useInterval";
import useUserInput from "../../_hooks/useUserInput";
import Row from "./Row/Row";

export default function GameGrid({ paused }: { paused: boolean }) {
    const [grid, setGrid] = useState(initialGrid);
    const [currentTetro, setCurrentTetro] = useState(newTetro());
    const [keyPressed, nextKey] = useUserInput();

    // Game Loop
    useInterval(
        () => {
            // console.log(grid);
            if (canMoveTo(MoveDirection.down, grid)) {
                setCurrentTetro((tetro) => moveTetro(MoveDirection.down, tetro));
            } else {
                setGrid((g) => saveTetroOnGrid(g, currentTetro));
                setCurrentTetro(newTetro());
            }
        },
        paused ? null : 700
    );

    useEffect(() => {
        setGrid((g) => updateGrid(g, currentTetro));
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

    if (paused && keyPressed !== null) {
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
                return <Row tetroType={currentTetro.shapeType} cells={row} key={idx} />;
            })}
        </div>
    );
}

const styles: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
};
