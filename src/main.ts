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
    if (keyUpPressed && keyRightPressed && piece.x + p.x + SHAPE[randomShape][0].length > COLS) {
        piece.x = COLS - SHAPE[randomShape][0].length;
    } else {
        piece.x += p.x;
    }
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

function rotatePiece(pieceShape: number[][], gameboard: number[][]) {
    for(let i = 0; i < pieceShape.length; ++i) {
        for(let j = 0; j < i; ++j) {
            [pieceShape[i][j], pieceShape[j][i]] = [pieceShape[j][i], pieceShape[i][j]]
        }
    }

    pieceShape.forEach(row => row.reverse());

    if(collisionCheck({x: piece.x, y: piece.y},gameboard,pieceShape)) {
        wallKick(piece,SHAPE[randomShape],gameboard);
    } else {
        return
    }
}

function wallKick(piece: pieceInterface, pieceShape: number[][], gameboard: number[][]) {
    const wallKicks = [
      [0, 0],
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
      [-2, 0],
      [2, 0],
      [0, -2],
      [0, 2]
    ];
  
    for (let i = 0; i < wallKicks.length; i++) {
      const [xOffset, yOffset] = wallKicks[i];
  
      // Attempt to move the piece to its new location
      piece.x += xOffset;
      piece.y += yOffset;
  
      // If the move is valid, return the new piece position
      if (!collisionCheck(piece, gameboard, pieceShape)) {
        return [piece.x, piece.y];
      }
  
      // Move is invalid, so undo the move
      piece.x -= xOffset;
      piece.y -= yOffset;
    }
  
    // All wall kicks failed, return null
    return null;
}

function handleSimultaneousKeyEvents(): boolean {
    if(keyUpPressed && keyRightPressed) {
        return true;
    }
    else {
        return false;
    }
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


let score = 0;

function lineClear(gameboard: number[][]) {
    const scoreBoard = document.querySelector('.score > p') as HTMLParagraphElement;
        
    
    const linesToClear: number[] = [];
    gameboard.forEach((row, index) => {
        if(row.every(val => val > 0)) {
            linesToClear.push(index);
        }
    })

    if(linesToClear.length > 0) {
        linesToClear.forEach((lineIndex) => {
            gameboard.splice(lineIndex,1);
            gameboard.unshift(new Array(gameboard[0].length).fill(0));
        })
        score += getScore(linesToClear.length);
        scoreBoard.textContent = `${score}`;
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


let keyUpPressed = false;
let keyRightPressed = false;

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
                keyRightPressed = true;
                moved = true;
            }
            break;
        case "ArrowUp":
            rotatePiece(SHAPE[randomShape], gameboard);
            moved = true;
            keyUpPressed = true;
            break;
    }
    if (moved) {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        drawBoard(gameboard);
        drawPiece(randomShape);
    }
})

document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case "ArrowUp":
            keyUpPressed = false;
            break;
        case "ArrowRight":
            keyRightPressed = false;
            break;
    }
})

restartBtn.addEventListener('click', () => {
    location.reload();
})