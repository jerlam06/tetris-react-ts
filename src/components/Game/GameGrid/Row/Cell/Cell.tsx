export default function Cell({ index, cell }: { index: number; cell: string }) {
    return <div className="Cell" style={{ ...styles.Cell, backgroundColor: cell ? "orange" : "white" }}></div>;
}

const styles: { [className: string]: React.CSSProperties } = {
    Cell: { width: "40px", height: "40px", backgroundColor: "white", border: "1px solid #ededed" },
};
