import Cell from "./Cell/Cell";

export default function Row({ index, cells }: { index: number; cells: Array<string> }) {
    return (
        <div className="Row" style={styles}>
            {cells.map((cell, idx) => {
                return <Cell index={idx + 1} cell={cell} key={idx} />;
            })}
        </div>
    );
}

const styles: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
};
