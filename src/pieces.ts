import { TetrisPiece } from './types';

export const pieces = {
    1: {
        name: 'i',
        posStateIndex: 0,
        pos: [
            [0, 3],
            [0, 4],
            [0, 5],
            [0, 6]
        ],
        color: 'DeepSkyBlue'
    },
    2: {
        name: 'o',
        posStateIndex: 0,
        pos: [
            [0, 4],
            [0, 5],
            [1, 4],
            [1, 5]
        ],
        color: 'Gold'
    },
    3: {
        name: 'j',
        posStateIndex: 0,
        pos: [
            [0, 3],
            [1, 3],
            [1, 4],
            [1, 5]
        ],
        color: 'RoyalBlue'
    },
    4: {
        name: 'l',
        posStateIndex: 0,
        pos: [
            [0, 6],
            [1, 4],
            [1, 5],
            [1, 6]
        ],
        color: 'DarkOrange'
    },
    5: {
        name: 's',
        posStateIndex: 0,
        pos: [
            [0, 4],
            [0, 5],
            [1, 3],
            [1, 4]
        ],
        color: 'GreenYellow'
    },
    6: {
        name: 'z',
        posStateIndex: 0,
        pos: [
            [0, 3],
            [0, 4],
            [1, 4],
            [1, 5]
        ],
        color: 'Crimson'
    },
    7: {
        name: 't',
        posStateIndex: 0,
        pos: [
            [0, 4],
            [1, 3],
            [1, 4],
            [1, 5]
        ],
        color: 'MediumOrchid'
    }
} as { [key: number]: TetrisPiece };

export const rotationInst = {
    i: {
        right: [
            [-1, 2],
            [0, 1],
            [1, 0],
            [2, -1]
        ],
        down: [
            [2, -2],
            [1, -1],
            [0, 0],
            [-1, 1]
        ],
        left: [
            [-2, 1],
            [-1, 0],
            [0, -1],
            [1, -2]
        ],
        default: [
            [1, -1],
            [0, 0],
            [-1, 1],
            [-2, 2]
        ]
    },
    o: {
        right: [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
        ],
        down: [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
        ],
        left: [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
        ],
        default: [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
        ]
    },
    j: {
        right: [
            [0, 1],
            [-1, 2],
            [0, 0],
            [1, -1]
        ],
        down: [
            [1, -1],
            [1, -1],
            [0, 1],
            [0, 1]
        ],
        left: [
            [-1, 1],
            [0, 0],
            [1, -2],
            [0, -1]
        ],
        default: [
            [0, -1],
            [0, -1],
            [-1, 1],
            [-1, 1]
        ]
    },
    l: {
        right: [
            [0, -1],
            [0, 1],
            [1, 0],
            [1, 0]
        ],
        down: [
            [1, -1],
            [0, 0],
            [-1, 1],
            [0, -2]
        ],
        left: [
            [-1, 0],
            [-1, 0],
            [0, -1],
            [0, 1]
        ],
        default: [
            [0, 2],
            [1, -1],
            [0, 0],
            [-1, 1]
        ]
    },
    s: {
        right: [
            [0, 0],
            [1, -1],
            [0, 2],
            [1, 1]
        ],
        down: [
            [1, 0],
            [0, 1],
            [1, -2],
            [0, -1]
        ],
        left: [
            [-1, -1],
            [0, -2],
            [-1, 1],
            [0, 0]
        ],
        default: [
            [0, 1],
            [-1, 2],
            [0, -1],
            [-1, 0]
        ]
    },
    z: {
        right: [
            [0, 2],
            [1, 0],
            [0, 1],
            [1, -1]
        ],
        down: [
            [1, -2],
            [0, 0],
            [1, -1],
            [0, 1]
        ],
        left: [
            [-1, 1],
            [0, -1],
            [-1, 0],
            [0, -2]
        ],
        default: [
            [0, -1],
            [-1, 1],
            [0, 0],
            [-1, 2]
        ]
    },
    t: {
        right: [
            [0, 0],
            [0, 1],
            [0, 1],
            [1, -1]
        ],
        down: [
            [1, -1],
            [0, 0],
            [0, 0],
            [0, 0]
        ],
        left: [
            [-1, 1],
            [0, -1],
            [0, -1],
            [0, 0]
        ],
        default: [
            [0, 0],
            [0, 0],
            [0, 0],
            [-1, 1]
        ]
    }
} as {
    [key: string]: {
        [key: string]: any;
    };
};

export const piecePosStates = ['default', 'right', 'down', 'left'];
