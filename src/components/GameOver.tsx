import React from 'react';
import gameOverImg from '../assets/game-over.avif';

export default function GameOver({ onRestart }: { onRestart: () => void }) {
    return (
        <div className="game-over">
            <img width="220px" height="119px" src={gameOverImg} alt="" />

            <button onClick={onRestart}>Restart</button>
        </div>
    );
}
