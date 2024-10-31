
import { Direction, Wall } from "./components/Tetris";
import { Piece } from "./pieces";
import { pieceOrientations } from "./pieces";

export function rotatePiece(piece: Piece, wall: Wall): Omit<Piece, 'name' | 'color'> {
    const { name, position, orientation } = piece;

    const newPosition: Piece['position'] = [];
    let newOrientation = orientation === 3 ? 0 : orientation + 1 as Piece['orientation'];

    const rotationParams = pieceOrientations[name][newOrientation];

    for (let index in Object.keys(position)) {
        newPosition.push([position[index][0] + rotationParams[index][0], position[index][1] + rotationParams[index][1]]);
    }

    if (
        newPosition.some((coord) => {
            return (wall[coord[0]] === undefined || wall[coord[0]][coord[1]] === undefined) || wall[coord[0]][coord[1]]?.isFixed;
        })
    ) {
        return { position, orientation };
    }

    return {
        position: newPosition,
        orientation: newOrientation
    }
}

export const getNewPiecePosition = ({ direction, position, wall }: { direction: Direction, position: Piece['position'], wall: Wall }) => {
    const actions = {
        right: {
            validateNewPosition(coord: number[]) {
                return (wall[coord[0]][coord[1] + 1] === undefined || wall[coord[0]][coord[1] + 1]?.isFixed);
            },
            mapNewPosition(arr: number[]) { return ([arr[0], arr[1] + 1]) }
        },
        left: {
            validateNewPosition(coord: number[]) {
                return (wall[coord[0]][coord[1] - 1] === undefined || wall[coord[0]][coord[1] - 1]?.isFixed);
            },
            mapNewPosition(arr: number[]) { return ([arr[0], arr[1] - 1]) }
        },
        down: {
            validateNewPosition(coord: number[]) {
                return (wall[coord[0] + 1] === undefined || wall[coord[0] + 1][coord[1]] === undefined) || wall[coord[0] + 1][coord[1]]?.isFixed;
            },
            mapNewPosition(arr: number[]) { return ([arr[0] + 1, arr[1]]) }
        }
    }

    if (
        position.some(actions[direction].validateNewPosition)
    ) {
        return false;
    }
    return position.map(actions[direction].mapNewPosition);
}

export function updateWallWithPiece(wall: Wall, piece: Piece): Wall {
    const newWall = wall.map((row) =>
        row.map((brick) => {
            if (brick && !brick.isFixed) {
                return null;
            }
            return brick;
        })
    );

    piece.position.forEach((brick) => {
        newWall[brick[0]][brick[1]] = {
            color: piece.color,
            isFixed: false
        };
    });

    return newWall;
}

export function getNewPieceSettings(pieces: Omit<Piece, 'orientation'>[], numberOfPieces: number): Piece {
    return {
        ...pieces[Math.ceil(Math.random() * numberOfPieces) - 1],
        orientation: 3
    };
};