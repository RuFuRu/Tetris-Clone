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

//console.table(getGameBoard());

let randomShape = Math.floor(Math.random() * 7);
let randomColour = colorRandomizer();
const gameboard = getGameBoard();

function drawBoard(gameboard: number[][]) {
    gameboard.forEach((row, y) => {
        row.forEach((val, x) => {
            if(val > 0) {
                //randomShape = Math.floor(Math.random() * 7);
                ctx.drawImage(randomColour,x,y,1,1)
            }
        })
    })
}


function drawPiece(shape: number) {
    SHAPE[shape].map((row, y) => {
        row.map((value, x) => {
            if(value !== 0) {
                ctx.drawImage(randomColour, piece.x + x, piece.y + y, 1, 1);
            }
        })
    })
    drawBoard(getGameBoard());
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

function rotatePiece(pieceShape: number[][]) {
    for(let i = 0; i < pieceShape.length; ++i) {
        for(let j = 0; j < i; ++j) {
            [pieceShape[i][j], pieceShape[j][i]] = [pieceShape[j][i], pieceShape[i][j]]
        }
    }

    pieceShape.forEach(row => row.reverse());
}

let newGameBoard: number[][] | null = null;

function freeze(pieceShape: number[][], gameBoard: number[][], pieceX: number, pieceY: number): number[][] {
    pieceShape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                gameBoard[pieceY + y][pieceX + x] = value;
            }
        });
    });
    drawBoard(gameBoard);
    return gameBoard;
}

function update() {
    drawPiece(randomShape);
    let lastUpdateTime = Date.now();
    function gameLoop() {
        const currentTime = Date.now();
        const deltaTime = currentTime - lastUpdateTime;
        if(deltaTime >= 1000) {
            lastUpdateTime = currentTime;
            if(!collisionCheck({x: piece.x, y: piece.y + 1}, gameboard, SHAPE[randomShape])) {
                movePiece({x: 0, y: 1});
                ctx.clearRect(0,0,canvas.width,canvas.height);
                drawPiece(randomShape);
            } else {
                freeze(SHAPE[randomShape], gameboard, piece.x, piece.y);

                piece.x = 0;
                piece.y = 0;

                randomShape = Math.floor(Math.random() * 7);
                randomColour = colorRandomizer();

                drawPiece(randomShape);
            }
        }
        requestAnimationFrame(gameLoop);
    }
    gameLoop();
}

update();


document.addEventListener('keydown', (e) => {
    let moved = false;
    switch(e.key) {
        case "ArrowDown":
            if(!collisionCheck({x: piece.x, y: piece.y + 1}, gameboard, SHAPE[randomShape])) {
                movePiece({x: 0, y: 1});
                moved = true;
            }
            break;
        case "ArrowLeft":
            if(!collisionCheck({x: piece.x - 1, y: piece.y}, gameboard, SHAPE[randomShape])) {
                movePiece({x: -1, y: 0});
                moved = true;
            }
            break; 
        case "ArrowRight":
            if(!collisionCheck({x: piece.x + 1, y: piece.y}, gameboard, SHAPE[randomShape])) {
                movePiece({x: 1, y: 0});
                moved = true;
            }
            break;
        case "ArrowUp":
            rotatePiece(SHAPE[randomShape]);
            break;
    }
    if (moved) {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        drawPiece(randomShape);
    }
})
