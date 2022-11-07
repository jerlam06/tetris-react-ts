interface CurrentTetromino {
    shape: Array<string[]>;
    shapeType: ShapeType;
    rotationIdx: number;
    x: number;
    y: number;
    applyRotation: () => void;
}

type CanMoveTo = {
    left: boolean;
    right: boolean;
    down: boolean;
};
