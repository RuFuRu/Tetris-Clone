import './style.css';
import playMainTheme from './mainTheme';
import colorRandomizer from './colorRandomizer';
import { ROWS, COLS, SHAPE } from './constants';
import { pieceInterface } from './interface';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const restartBtn = document.querySelector('.restart') as HTMLButtonElement;


playMainTheme();


let randomShape = Math.floor(Math.random() * 7);
let randomColour = colorRandomizer();
const gameboard = getGameBoard();
let interval = 1000;
let requestId: number;
let gameOverCheck = false;

const piece = {
    x: 0,
    y: 0,
    w: 30,
    h: 30,
}

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

function drawBoard(gameboard: number[][]) {
    gameboard.forEach((row, y) => {
        row.forEach((val, x) => {
            if(val > 0) {
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
    //drawBoard(gameboard);
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

function speedUp() {
    const level = document.querySelector('.level > p') as HTMLParagraphElement;
    setInterval(() => {
        interval -= 100;
        level.textContent = `${parseInt((level.textContent) as string) + 1}`
    },30000);
}

function timer() {
    const seconds = document.querySelector('#seconds') as HTMLSpanElement;
    const minutes = document.querySelector('#minutes') as HTMLSpanElement;
    setInterval(() => {
        if(parseInt(seconds.textContent as string) < 9) {
            seconds.textContent = `0${parseInt(seconds.textContent as string) + 1}`;
        } else {
            seconds.textContent = `${parseInt(seconds.textContent as string) + 1}`;
        }
        if(parseInt(seconds.textContent) >= 60) {
            seconds.textContent = '00';
            minutes.textContent = `${parseInt(minutes.textContent as string) + 1}`
        }
    },1000);
}

function getScore(lines: number): number {
    return lines === 1 ? 100 :
           lines === 2 ? 200 :
           lines === 3 ? 600 :
           lines === 4 ? 1000 :
           0
}

let lines = 0;
let score = 0;

function lineClear(gameboard: number[][]) {
    const scoreBoard = document.querySelector('.score > p') as HTMLParagraphElement;
    for (let y = gameboard.length - 1; y >= 0; y--) {
        if (gameboard[y].every(val => val > 0)) {
          lines++;
          for (let i = y; i > 0; i--) {
            gameboard[i] = gameboard[i - 1].slice();
          }
          gameboard[0] = Array(COLS).fill(0);
          y++; // skip the new row we just added
        }
      }
    if(lines > 0) {
        score += getScore(lines);
        scoreBoard.textContent = `${score}`;
        lines = 0;
    }
}

function gameOver() {
    gameOverCheck = true;
    const gameOverInfo = document.querySelector('.gameover') as HTMLDivElement;
    gameOverInfo.setAttribute('style', 'display: block;');
}

function update() {
    drawPiece(randomShape);
    speedUp();
    timer();
    let lastUpdateTime = Date.now();
    function gameLoop() {
        const currentTime = Date.now();
        const deltaTime = currentTime - lastUpdateTime;
        if(deltaTime >= interval) {
            lastUpdateTime = currentTime;
            if(!collisionCheck({x: piece.x, y: piece.y + 1}, gameboard, SHAPE[randomShape])) {
                movePiece({x: 0, y: 1});
                ctx.clearRect(0,0,canvas.width,canvas.height);
                drawBoard(gameboard)
                drawPiece(randomShape);
            } else {
                freeze(SHAPE[randomShape], gameboard, piece.x, piece.y);
                lineClear(gameboard);

                if(piece.y === 0) {
                    gameOver()
                }

                piece.x = 0;
                piece.y = 0;

                randomShape = Math.floor(Math.random() * 7);
                randomColour = colorRandomizer();

                drawBoard(gameboard);
                drawPiece(randomShape);
            }
        }
        if(!gameOverCheck) {
            requestAnimationFrame(gameLoop);
        }
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
        drawBoard(gameboard);
        drawPiece(randomShape);
    }
})

restartBtn.addEventListener('click', () => {
    location.reload();
})
