import { ShapeType } from "../../../../utils/@types";
import Cell from "./Cell/Cell";

export default function Row({ tetroType, cells }: { tetroType: ShapeType; cells: Array<string> }) {
    return (
        <div className="Row" style={styles}>
            {cells.map((cell, idx) => {
                return <Cell tetroType={tetroType} cell={cell} key={idx} />;
            })}
        </div>
    );
}

const styles: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
};
