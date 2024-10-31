import React from 'react';
import { Wall } from './Tetris';

type Props = {
    wall: Wall;
    className?: string;
};

function Wall({ wall, className }: Props) {
    return (
        <div className={className}>
            {wall.flat().map((brick, i) => (
                <div key={i} className="brick" style={{ backgroundColor: brick ? brick.color : 'transparent' }}></div>
            ))}
        </div>
    );
}

export default Wall;
