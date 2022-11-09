import { ShapeType } from "../../../../../utils/@types";

export default function Cell({ tetroType, cell }: { tetroType: ShapeType; cell: string }) {
    const shape = cell === "X" ? tetroType : cell;
    return <div className="Cell" style={{ ...styles.Cell, ...styles[shape] }}></div>;
}

const styles: { [className: string]: React.CSSProperties } = {
    Cell: { width: "40px", height: "40px", backgroundColor: "white", border: "1px solid #ededed" },
    I: { backgroundColor: "darkcyan" },
    J: { backgroundColor: "blue" },
    L: { backgroundColor: "orange" },
    O: { backgroundColor: "#eeee00" },
    S: { backgroundColor: "limegreen" },
    Z: { backgroundColor: "orangered" },
    T: { backgroundColor: "mediumvioletred" },
};
