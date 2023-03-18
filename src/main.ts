import './style.css';
import playMainTheme from './mainTheme';
import colorRandomizer from './colorRandomizer';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;


playMainTheme();

const SHAPE = [
    [
        [1,0,0,0],
        [1,0,0,0],
        [1,0,0,0],
        [1,0,0,0]
    ],
    [
        [2,0,0],
        [2,0,0],
        [2,2,0]
    ],
    [
        [3,0,0],
        [3,3,0],
        [0,3,0],
    ],
    [
        [4,4,4],
        [0,4,0],
        [0,0,0],
    ],
    [
        [5,5],
        [5,5]
    ]
]

const COLS = 10
const ROWS = 20

const piece = {
    x: 0,
    y: 0,
    w: 30,
    h: 30,
    dx: 2,
    yx: 2,
    nextX: 0,
    nextY: 0
}

ctx.canvas.width = COLS * piece.w
ctx.canvas.height = ROWS * piece.h
ctx.scale(piece.w,piece.w);


function drawPiece() {
    const colour = colorRandomizer();
    const randomShape = Math.floor(Math.random() * 5);
    SHAPE[randomShape].map((row, y) => {
        row.map((value, x) => {
            if(value !== 0) {
                ctx.drawImage(colour,piece.x + x, piece.y + y, 1, 1);
            }
        })
    })
}

function clear() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
}

function update() {
    clear();
    drawPiece();
}

update();
