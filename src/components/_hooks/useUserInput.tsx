import { useEffect, useState } from "react";

const keys: { [key: string]: string } = {
    KeyA: "left",
    KeyD: "right",
    KeyW: "up",
    KeyS: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
    ArrowUp: "up",
    ArrowDown: "down",
    Space: "space",
};

export default function useUserInput(): [string | null, () => void] {
    const [keyPressed, setKeyPressed] = useState<string | null>(null);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    function handleKeyDown(event: KeyboardEvent) {
        // console.log("A key was pressed", event.code);
        if (keys[event.code]) {
            setKeyPressed(keys[event.code]);
        }
    }

    function nextKey() {
        setKeyPressed(null);
    }

    return [keyPressed, nextKey];
}
