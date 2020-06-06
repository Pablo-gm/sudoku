var baseBoard = [
    [1,2,3,4,5,6,7,8,9],
    [4,5,6,7,8,9,1,2,3],
    [7,8,9,1,2,3,4,5,6],
    [2,3,4,5,6,7,8,9,1],
    [5,6,7,8,9,1,2,3,4],
    [8,9,1,2,3,4,5,6,7],
    [3,4,5,6,7,8,9,1,2],
    [6,7,8,9,1,2,3,4,5],
    [9,1,2,3,4,5,6,7,8]
];

var board = baseBoard;

// Swap rows, valid values 0 - 8, use only rows on the same group
function swapRows(firstRow, secondRow){
    [board[firstRow], board[secondRow]] = [board[secondRow], board[firstRow]];
}

// Swap row groups, valid values 0 - 2
function swapGroup(firstGroup, secondGroup){
    for(let index = 0; index < 3; index++){
        swapRows( firstGroup*3 + index, secondGroup*3 + index );
    }
}

// Mirror diagonally
function swapDiagonal(){
    for(let x = 0; x < 9; x++){
        for(let y = x; y < 9; y++){
            [board[x][y], board[y][x]] = [board[y][x], board[x][y]]
        }
    }
}

// display board
function dumpBoard(){
    let rows = Array.from(document.getElementById('board').rows);
    let x,y = 0;
    rows.forEach( row => {
        let cells = Array.from(row.cells);
        x= 0;
        cells.forEach(cell => { 
            cell.textContent = board[y][x];
            x++;
        } );
        y++;
    });
}

function evaluateBoard(){
    let xValues = {};
    let yValues = {};
    let tempX, tempY;
    
    for(let i = 0; i < board.length; i++){
        xValues = {};
        yValues = {};
        for(let j = 0; j < board.length; j++){
            tempX = board[i][j];
            tempY = board[j][i];
            if(xValues[tempX] || yValues[tempY]){
                console.log(i);
                console.log(j);
                return false;
            }else{
                xValues[tempX] = 1;
                yValues[tempY] = 1;
            }
        }
    }

    return true;
}