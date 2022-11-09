import { useState } from "react";
import GameGrid from "./GameGrid/GameGrid";

export default function Game() {
    const [gamePaused, setGamePaused] = useState(false);

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1>TETRIS</h1>
            <button onClick={() => setGamePaused(!gamePaused)}>{gamePaused ? "Play" : "Pause"}</button>
            <GameGrid paused={gamePaused} />
        </div>
    );
}
