import { useEffect, useRef } from "react";

export default function useInterval(callback: () => void, delay: number | null) {
    let savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    });

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }

        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}
