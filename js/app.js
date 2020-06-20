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

var baseBoard2 = [
    [1,2,0,4,5,6,7,8,9],
    [4,5,0,7,8,9,1,2,0],
    [0,8,9,1,2,3,4,5,6],
    [2,3,4,5,6,7,8,9,1],
    [5,6,7,8,9,1,2,3,4],
    [8,9,0,2,3,4,5,6,7],
    [3,4,5,6,7,8,9,1,2],
    [6,7,8,9,1,2,3,4,5],
    [9,1,2,3,4,5,6,7,8]
];

var board = baseBoard2;

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
            if(board[y][x]){
                cell.textContent = board[y][x];
            }
            x++;
        } );
        y++;
    });
}

// modify to return options and quadrants... or what's needed
function checkFilledOptions(x,y){
    let options = {};
    let tempX, tempY, tempQ;
    let quadrantX = (x/3|0)*3;
    let quadrantY = (y/3|0)*3;

    for(let i = 0; i < board.length; i++){
        tempY = board[i][x];
        tempX = board[y][i];
        tempQ = board[quadrantY + (i/3|0) ][quadrantX + (i % 3) ];

        if(!options[tempX]) options[tempX] = 1; 
        if(!options[tempY]) options[tempY] = 1;
        if(!options[tempQ]) options[tempQ] = 1;
    }

    var res = []
    Object.keys(options).forEach(function (item) {
        res.push(item);
    });
    console.log(res.sort());
    return options;
}

function evaluateBoard(){
    let xValues = {};
    let yValues = {};
    let qValues = {};
    let tempX, tempY, tempQ;
    
    // check rows and columns
    for(let i = 0; i < board.length; i++){
        xValues = {};
        yValues = {};
        for(let j = 0; j < board.length; j++){
            tempX = board[i][j];
            tempY = board[j][i];
            if(xValues[tempX] || yValues[tempY]){
                return false;
            }else{
                xValues[tempX] = 1;
                yValues[tempY] = 1;
            }
        }
    }

    // check value in quadrants
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            qValues = {};
            for(let t = 0; t < board.length; t++){
                tempQ = board[(j*3) + (t/3|0) ][(i*3) + (t % 3) ];
                if(qValues[tempQ]){ 
                    return false;
                }else{
                    qValues[tempQ] = 1;
                }
            }
        }
    }

    return true;
}

// min and max inclusive
function getRandomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}