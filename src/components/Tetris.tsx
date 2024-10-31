import React, { useEffect, useRef, useState } from 'react';
import { Colors, Piece, pieces } from '../pieces';
import { getNewPiecePosition, rotatePiece, updateWallWithPiece, getNewPieceSettings } from '../helpers';
import TetrisWall from './Wall';
import { generalState } from '../App';

export type Brick = {
    color: Colors;
    isFixed: boolean;
} | null;

export type Wall = Array<Array<Brick>>;

export type Direction = 'left' | 'right' | 'down';

const pointsPerLine = {
    1: 40,
    2: 100,
    3: 300,
    4: 1200
} as { [key: number]: number };

const GameOver = React.lazy(() => import('./GameOver'));

const Tetris = ({ onGeneralStateChanges }: { onGeneralStateChanges: (state: generalState) => void }) => {
    const baseInterval = 1000; // 2800 original - Starting interval time in ms
    const speedFactor = 0.8; // Decrease factor per level, adjust this to change speed increase rate

    const initialWall: Wall = new Array(20).fill(new Array(10).fill(null));

    const [completedLines, setCompletedLines] = useState(0);
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);

    const [gameOver, setGameOver] = useState(false);
    const gameOverRef = useRef(gameOver);

    const [wall, setWall] = useState(initialWall);
    const wallStateRef = useRef(wall);

    const numberOfPieces = pieces.length;

    const [currentPiece, setCurrentPiece] = useState<Piece>(getNewPieceSettings(pieces, numberOfPieces));
    const [newPiece, setNewPiece] = useState<Piece>();
    const newPieceRef = useRef(newPiece);

    useEffect(() => {
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    });

    useEffect(() => {
        if (canPieceBePlacedOnWall(currentPiece, wall)) {
            updateWall();
        } else {
            setGameOver(true);
        }
    }, [currentPiece]);

    useEffect(() => {
        wallStateRef.current = wall;
    }, [wall]);

    useEffect(() => {
        newPieceRef.current = newPiece;
        setLevel(Math.floor(completedLines / 10) + 1);

        newPiece &&
            onGeneralStateChanges({
                completedLines,
                level,
                score,
                nextPiece: {
                    position: newPiece.position,
                    color: newPiece.color
                }
            });
    }, [newPiece]);

    useEffect(() => {
        gameOverRef.current = gameOver;
    }, [gameOver]);

    useEffect(() => {
        startSetInterval(currentPiece);
    }, []);

    const startSetInterval = (currentPiece: Piece) => {
        setCurrentPiece({ ...currentPiece });

        setNewPiece(getNewPieceSettings(pieces, numberOfPieces));

        const interval = setInterval(
            async () => {
                if (gameOverRef.current) {
                    clearInterval(interval);
                } else {
                    const moved = await movePiece('down');
                    if (!moved) {
                        fixPieceOnWall();
                        await checkAndRemoveCompletedLines();
                        clearInterval(interval);
                        startSetInterval(newPieceRef.current!);
                    }
                }
            },
            baseInterval * Math.pow(speedFactor, level - 1)
        );

        return () => clearInterval(interval);
    };

    const fixPieceOnWall = () => {
        setWall((wall) => {
            return wall.map((row) =>
                row.map((brick) => {
                    if (brick) {
                        return {
                            ...brick,
                            isFixed: true
                        };
                    }
                    return null;
                })
            );
        });
    };

    const updateWall = () => {
        setWall(updateWallWithPiece(wall, currentPiece));
    };

    const onKeyDown = (e: KeyboardEvent) => {
        const { code } = e;

        const directions: { [key: string]: Direction } = {
            ArrowDown: 'down',
            ArrowRight: 'right',
            ArrowLeft: 'left'
        };

        if (code === 'ArrowUp') {
            rotate();
        } else {
            const direction = directions[code];
            direction && movePiece(direction);
        }
    };

    const rotate = (): void => {
        if (currentPiece) {
            const { position, orientation } = rotatePiece(currentPiece, wall);
            setCurrentPiece({ ...currentPiece, position, orientation });
        }
    };

    const movePiece = (direction: Direction) => {
        return new Promise((resolve) => {
            let position: Piece['position'] | boolean;

            setCurrentPiece((currentPiece) => {
                position = getNewPiecePosition({
                    direction,
                    position: currentPiece.position,
                    wall: wallStateRef.current
                });
                if (typeof position !== 'boolean') {
                    resolve(true);
                    return { ...currentPiece, position };
                }
                resolve(false);
                return currentPiece;
            });
        });
    };

    const checkAndRemoveCompletedLines = async () => {
        let removedLines = await new Promise<number>((resolve) => {
            setWall((wall) => {
                let removedLines = 0;
                const newWall: Brick[][] = [];

                wall.forEach((row) => {
                    if (row.every((brick) => brick?.isFixed)) {
                        newWall.unshift(new Array(10).fill(null));
                        removedLines++;
                    } else {
                        newWall.push(row);
                    }
                });
                resolve(removedLines);
                return newWall;
            });
        });

        if (removedLines) {
            setScore((score) => {
                return score + pointsPerLine[removedLines];
            });
        }
        setCompletedLines((lines) => lines + removedLines);
    };

    const canPieceBePlacedOnWall = (piece: Piece, wall: Wall): boolean => {
        return piece.position.every((coord) => {
            return !wall[coord[0]][coord[1]]?.isFixed;
        });
    };

    const restart = () => {
        setWall(initialWall);
        setCompletedLines(0);
        setLevel(1);
        setScore(0);
        setGameOver(false);
        startSetInterval(getNewPieceSettings(pieces, numberOfPieces));
    };

    return (
        <>
            {gameOver && <GameOver onRestart={restart} />}
            <TetrisWall wall={wall} className={`tetris-wall${gameOver ? ' tetris-wall--game-over' : ''}`} />
        </>
    );
};

export default Tetris;
