import React, { ReactElement, useState, useEffect, useRef } from 'react';
import './app.css';

import Tetris, { Brick } from './components/Tetris';
import { Piece } from './pieces';
import Wall from './components/Wall';

export type generalState = {
    nextPiece: Omit<Piece, 'orientation' | 'name'>;
    completedLines: number;
    level: number;
    score: number;
};

const App = (): ReactElement => {
    const [generalState, setGeneralState] = useState<generalState>();
    const [nextPieceWall, setNextPieceWall] = useState<Array<Array<Brick>>>(new Array(2).fill(new Array(4).fill(null)));

    const generalStateChanged = (newState: generalState) => {
        setGeneralState({ ...generalState, ...newState });
    };

    useEffect(() => {
        const newWall: Array<Array<Brick>> = nextPieceWall.map((row) => row.map(() => null));
        const nextPiece = generalState?.nextPiece;

        if (nextPiece) {
            nextPiece.position.forEach((brick: number[]) => {
                // (- 3) moves the piece 3 spaces to the left, normally it would be in the middle of the wall
                newWall[brick[0]][brick[1] - 3] = {
                    color: nextPiece.color,
                    isFixed: false
                };
            });
        }
        setNextPieceWall(newWall);
    }, [generalState]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const { score, completedLines, nextPiece, level } = generalState || {};

    return (
        <div className="tetris-cont">
            <div className="left-panel">
                <div className="info-block">
                    <p className="title">Score</p>
                    <p className="content">{score}</p>
                </div>
                <div className="info-block">
                    <p className="title">Lines</p>
                    <p className="content">{completedLines}</p>
                </div>
            </div>
            <div className="center-panel">
                <Tetris onGeneralStateChanges={generalStateChanged} />
            </div>
            <div className="right-panel">
                <div className="info-block">
                    <p className="title">Level</p>
                    <p className="content">{level}</p>
                </div>
                <div className="info-block info-block--piece">
                    <p className="title">Next</p>
                    <Wall wall={nextPieceWall} className="content" />
                </div>
            </div>
        </div>
    );
};

export default App;
