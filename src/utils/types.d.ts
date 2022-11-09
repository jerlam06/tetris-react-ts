interface CurrentTetromino {
    shape: Array<string[]>;
    shapeType: ShapeType;
    rotationIdx: number;
    x: number;
    y: number;
}

type CanMoveTo = {
    left: boolean;
    right: boolean;
    down: boolean;
};
