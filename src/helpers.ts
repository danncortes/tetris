import { TetrisPiece, PiecePosition, Wall, Colors, PieceBrickPosition } from './types';

import { rotationInst, piecePosStates } from './pieces';

export const stopPiece = (currentPiecePos: PiecePosition, wall: Wall) => {
    return (
        currentPiecePos.some((pos: PieceBrickPosition) => {
            return pos[0] === 19;
        }) ||
        (() => {
            let blockerBricks: PiecePosition = [];
            for (let brick of currentPiecePos) {
                if (!currentPiecePos.find((brk) => brk[0] === brick[0] + 1 && brk[1] === brick[1]))
                    blockerBricks.push(brick);
            }
            return blockerBricks.some((pos) => {
                return wall[pos[0] + 1][pos[1]] !== false;
            });
        })()
    );
};

export const moveLeft = (pos: PiecePosition, wall: Wall): PiecePosition => {
    const newPos: PiecePosition = [];
    if (
        pos.some((brk) => {
            return brk[1] - 1 < 0 || !!wall[brk[0]][brk[1] - 1];
        })
    ) {
        return pos;
    }
    for (let brk of pos) {
        newPos.push([brk[0], brk[1] - 1]);
    }
    return newPos;
};

export const moveRight = (pos: PiecePosition, wall: Wall): PiecePosition => {
    const newPos: PiecePosition = [];
    if (
        pos.some((brk) => {
            return brk[1] + 1 > 9 || !!wall[brk[0]][brk[1] + 1];
        })
    ) {
        return pos;
    }
    for (let brk of pos) {
        newPos.push([brk[0], brk[1] + 1]);
    }
    return newPos;
};

export const moveDown = (pos: PiecePosition, wall: Wall): PiecePosition => {
    const newPos: PiecePosition = [];
    if (stopPiece(pos, wall)) {
        return pos;
    }
    for (let brk of pos) {
        newPos.push([brk[0] + 1, brk[1]]);
    }
    return newPos;
};

export const moveUp = (currentPiece: TetrisPiece, wall: Wall): { newPos: PiecePosition; posState: number } => {
    const { posStateIndex, name, pos } = currentPiece;
    let newPos: PiecePosition = [];
    let newPosStateIndex = posStateIndex + 1 > 3 ? 0 : posStateIndex + 1;
    const rotation = rotationInst[name][piecePosStates[newPosStateIndex]];

    for (let index in Object.keys(pos)) {
        newPos.push([pos[index][0] + rotation[index][0], pos[index][1] + rotation[index][1]]);
    }

    if (
        newPos.some((brk) => {
            return wall[brk[0]][brk[1]] !== false;
        })
    ) {
        return { newPos: pos, posState: posStateIndex };
    }

    return { newPos, posState: newPosStateIndex };
};

export const blinkCompleteLines = (wall: Wall) => {
    const newWall = [];
    for (let row of wall) {
        if (row.every((brk) => !!brk)) {
            newWall.push(
                row.map((brk) => {
                    let brick = brk as { color: Colors; class: string };
                    return {
                        ...brick,
                        class: 'blink-brick'
                    };
                })
            );
        } else {
            newWall.push(row);
        }
    }
    return newWall;
};

export const isThereCompleteLine = (wall: Wall) => {
    return wall.filter((row) => row.every((brk) => !!brk)).length;
};
