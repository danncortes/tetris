import React, { ReactElement, useState, useEffect, useRef } from 'react';
import './app.css';

import { TetrisPiece, PiecePosition, Wall, Brick } from './types';
import { pieces } from './pieces';
import { pointsPerLine } from './pointsPerLine';
import { stopPiece, moveDown, moveLeft, moveRight, moveUp, blinkCompleteLines, isThereCompleteLine } from './helpers';

const App = (): ReactElement => {
    const [currentPiece, setCurrentPiece] = useState({
        ...pieces[Math.ceil(Math.random() * 7)]
    } as TetrisPiece);
    const [nextPiece, setNextPiece] = useState(Math.ceil(Math.random() * 7) as number);

    let initialWall: Wall = new Array(20).fill(new Array(10).fill(false)).map((row) => row.map((brk: Brick) => brk));
    const [wall, setWall] = useState(initialWall as Wall);
    const [score, setScore] = useState(0 as number);
    const [level, setLevel] = useState(1 as number);
    const [linesPerLevel, setLinesPerLevel] = useState(0 as number);
    const [totalLines, setTotalLines] = useState(0 as number);

    const refCurrentPiece = useRef(currentPiece);
    refCurrentPiece.current = currentPiece;

    const updateScore = (lines: number) => {
        let newLinesPerLevel = linesPerLevel + lines;
        let points = 0;
        let newLevel = level;

        if (newLinesPerLevel > 10) {
            const currentLevelLines = 10 - linesPerLevel;
            points = pointsPerLine[currentLevelLines] * level;
            newLevel = level + 1;
            const newLevelLines = lines - currentLevelLines;
            points = points + pointsPerLine[newLevelLines] * newLevel;
            newLinesPerLevel = newLevelLines;
        }

        if (newLinesPerLevel <= 10) {
            points = pointsPerLine[lines] * level;
            if (newLinesPerLevel === 10) {
                newLevel = level + 1;
                newLinesPerLevel = 0;
            }
        }

        setLevel(newLevel);
        setLinesPerLevel(newLinesPerLevel);
        setTotalLines(totalLines + lines);
        setScore(score + points);
    };

    const intervalFunc = () => {
        setCurrentPiece({
            ...pieces[nextPiece]
        });
        setNextPiece(Math.ceil(Math.random() * 7));
        const interval = setInterval(() => {
            let newPos: PiecePosition = [];
            const { pos, color } = refCurrentPiece.current;
            if (!stopPiece(pos, wall)) {
                for (let brk of pos) {
                    newPos.push([brk[0] + 1, brk[1]]);
                }
                setCurrentPiece({
                    ...refCurrentPiece.current,
                    pos: newPos
                });
            } else {
                clearInterval(interval);
                let newWall = [...wall];
                for (let brick of pos) {
                    newWall[brick[0]][brick[1]] = { color };
                }
                const completeLines = isThereCompleteLine(newWall);
                if (!!completeLines) {
                    newWall = blinkCompleteLines(newWall);
                    updateScore(completeLines);
                }

                setWall(newWall);
            }
        }, (Math.pow(0.8 - (level - 1) * 0.007, level - 1) * 1000) as number);
        return () => clearInterval(interval);
    };

    const removeCompleteLine = () => {
        let newWall = wall.filter((row) => row.some((brk) => !brk));
        let newRowsLength = 20 - newWall.length;
        setWall([
            ...new Array(newRowsLength).fill(new Array(10).fill(false)).map((row) => row.map((brk: Brick) => brk)),
            ...newWall
        ]);
    };

    useEffect(() => {
        if (isThereCompleteLine(wall)) {
            setTimeout(() => {
                removeCompleteLine();
            }, 150);
        } else {
            intervalFunc();
        }
    }, [wall]);

    const onKeyDown = (e: KeyboardEvent) => {
        const { code } = e;
        let newPos: PiecePosition;
        const { pos, posStateIndex } = refCurrentPiece.current;
        let newPosState = posStateIndex;
        if (code === 'ArrowLeft') {
            newPos = moveLeft(pos, wall);
        } else if (code === 'ArrowRight') {
            newPos = moveRight(pos, wall);
        } else if (code === 'ArrowDown') {
            newPos = moveDown(pos, wall);
        } else if (code === 'ArrowUp') {
            let res = moveUp(refCurrentPiece.current, wall);
            newPosState = res.posState;
            newPos = res.newPos;
        } else {
            newPos = pos;
        }
        setCurrentPiece({
            ...refCurrentPiece.current,
            pos: newPos,
            posStateIndex: newPosState
        });
    };

    useEffect(() => {
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    });

    const renderBricks = (brk: Brick, index: number) => {
        const isActive = currentPiece.pos.find((brk) => {
            return brk[0] * 10 + brk[1] === index;
        });
        return isActive ? (
            <div key={index} className="brick" style={{ backgroundColor: currentPiece.color }} />
        ) : typeof brk === 'object' ? (
            <div
                key={index}
                className={brk?.class ? `${brk.class} brick` : 'brick'}
                style={{ backgroundColor: brk.color }}
            />
        ) : (
            <div key={index} />
        );
    };

    return (
        <div className="tetris-cont">
            <div className="left-panel">
                <div className="info-block">
                    <p className="title">Score</p>
                    <p className="content">{score}</p>
                </div>
                <div className="info-block">
                    <p className="title">Lines</p>
                    <p className="content">{totalLines}</p>
                </div>
            </div>
            <div className="center-panel">
                <div className="tetris">
                    {wall.flat().map((brk: Brick, index: number) => {
                        return renderBricks(brk, index);
                    })}
                </div>
                <p className="left-lines">Next level in {10 - linesPerLevel} lines</p>
            </div>
            <div className="right-panel">
                <div className="info-block">
                    <p className="title">Level</p>
                    <p className="content">{level - 1}</p>
                </div>
                <div className="info-block">
                    <p className="title">Next</p>
                    <p className="content">{pieces[nextPiece].name}</p>
                </div>
            </div>
        </div>
    );
};

export default App;
