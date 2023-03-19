import './style.css';
import playMainTheme from './mainTheme';
import colorRandomizer from './colorRandomizer';
import { ROWS, COLS, SHAPE, piece } from './constants';
import { pieceInterface } from './interface';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;


playMainTheme();


ctx.canvas.width = COLS * piece.w
ctx.canvas.height = ROWS * piece.h
ctx.scale(piece.w,piece.h);

function getGameBoard(): number[][] {
    return (
        Array.from(
            {length: ROWS}, () => Array(COLS).fill(0)
        )
    )
}

let randomShape = Math.floor(Math.random() * 5);
let randomColour = colorRandomizer();

function drawPiece() {
    SHAPE[randomShape].map((row, y) => {
        row.map((value, x) => {
            if(value !== 0) {
                ctx.drawImage(randomColour, piece.x + x, piece.y + y, 1, 1);
            }
        })
    })
}

function movePiece(p: pieceInterface) {
    piece.x += p.x;
    piece.y += p.y;
}

function collisionCheck(piece: pieceInterface, gameBoard: number[][], pieceShape: number[][]): boolean {
    for (let y = 0; y < pieceShape.length; y++) {
      for (let x = 0; x < pieceShape[y].length; x++) {
        if (pieceShape[y][x] !== 0) {
          const newX = piece.x + x;
          const newY = piece.y + y;
  
          if (newX < 0 || newX >= COLS || newY >= ROWS || gameBoard[newY][newX] !== 0) {
            return true;
          }
        }
      }
    }
    return false;
  }

function update() {
    getGameBoard();
    drawPiece();
    setInterval(() => {
        if(!collisionCheck({x: piece.x, y: piece.y + 1}, getGameBoard(), SHAPE[randomShape])) {
            movePiece({x: 0, y: 1});
            ctx.clearRect(0,0,canvas.width,canvas.height);
            drawPiece();
        }
    }, 1000)
}

update();

document.addEventListener('keydown', (e) => {
    let moved = false;
    switch(e.key) {
        case "ArrowDown":
            if(!collisionCheck({x: piece.x, y: piece.y + 1}, getGameBoard(), SHAPE[randomShape])) {
                movePiece({x: 0, y: 1});
                moved = true;
            }
            break;
        case "ArrowLeft":
            if(!collisionCheck({x: piece.x - 1, y: piece.y}, getGameBoard(), SHAPE[randomShape])) {
                movePiece({x: -1, y: 0});
                moved = true;
            }
            break; 
        case "ArrowRight":
            if(!collisionCheck({x: piece.x + 1, y: piece.y}, getGameBoard(), SHAPE[randomShape])) {
                movePiece({x: 1, y: 0});
                moved = true;
            }
            break;
    }
    if (moved) {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        drawPiece();
    }
})
