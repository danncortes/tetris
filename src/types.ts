export type Colors =
    | 'DeepSkyBlue'
    | 'Gold'
    | 'RoyalBlue'
    | 'DarkOrange'
    | 'GreenYellow'
    | 'Crimson'
    | 'MediumOrchid';

export type PieceBrickPosition = [number, number];

export type PiecePosition = Array<PieceBrickPosition>;

export type TetrisPiece = {
    posStateIndex: number;
    name: string;
    pos: PiecePosition;
    color: Colors;
};

export type Brick = boolean | { color: Colors; class?: string };

export type Wall = Array<Array<Brick>>;
