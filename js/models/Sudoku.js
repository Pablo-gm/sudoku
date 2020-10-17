export default class Sudoku {
    constructor(){
        this.baseBoard = [
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
        this.puzzleBoard;
        this.answerBoard;
        this.answers = {};
        this.toAnswer = 0;
    }

    getBoard(){
        return this.baseBoard;
    }

    getPuzzleBoard(){
        return this.puzzleBoard;
    }

    // Swap rows, valid values 0 - 8, use only rows on the same group
    swapRows(firstRow, secondRow){
        [this.puzzleBoard[firstRow], this.puzzleBoard[secondRow]] = [this.puzzleBoard[secondRow], this.  puzzleBoard[firstRow]];
    }

    // Swap row groups, valid values 0 - 2
    swapGroup(firstGroup, secondGroup){
        for(let index = 0; index < 3; index++){
            this.swapRows( firstGroup*3 + index, secondGroup*3 + index );
        }
    }

    // Mirror diagonally
    swapDiagonal(){
        for(let x = 0; x < 9; x++){
            for(let y = x; y < 9; y++){
                [this.puzzleBoard[x][y], this.puzzleBoard[y][x]] = [this.puzzleBoard[y][x], this.puzzleBoard[x][y]]
            }
        }
    }

    // min and max inclusive
    getRandomRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Generate random board
    generatePuzzle(){
        this.puzzleBoard =  this.baseBoard.map(ar => ar.slice());

        for(let i = 0; i < 2; i++){
            this.swapRows(this.getRandomRange(i*3, i*3 + 2), this.getRandomRange(i*3, i*3 + 2));
            this.swapRows(this.getRandomRange(i*3, i*3 + 2), this.getRandomRange(i*3, i*3 + 2));
        }

        for(let i = 0; i < 2; i++){
            this.swapGroup(this.getRandomRange(0, 2), this.getRandomRange(0, 2));
        }

        if(this.getRandomRange(0, 1)){
            this.swapDiagonal();
        }
    }

    // Create missing cells
    slicePuzzle(difficulty){

        if(!(difficulty && difficulty > 0 && difficulty < 5)){
            difficulty = 1;
        }

        // Remove values for each "quadrant"
        // let temp;
        // for(let i = 0; i < difficulty + 2; i++){
        //     for(let j = 0; j < 3; j++){
        //         temp = j * 3;
        //         this.puzzleBoard[this.getRandomRange(0, 2) ][this.getRandomRange(temp, temp + 2)] = 0;
        //         this.puzzleBoard[this.getRandomRange(3, 5) ][this.getRandomRange(temp, temp + 2)] = 0;
        //         this.puzzleBoard[this.getRandomRange(6, 8) ][this.getRandomRange(temp, temp + 2)] = 0;
        //     }
        // }

        // Remove random values
        for(let i = 0; i < difficulty * 1; i++){
            this.puzzleBoard[this.getRandomRange(0, 8)][this.getRandomRange(0, 8)] = 0;
        }

        this.setAnswers();

    }

    setAnswers(){
        // Check how many answers
        this.toAnswer = 0;
        let val;
        for(let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                val = this.puzzleBoard[i][j];
                if(val == 0) {
                    this.toAnswer++;
                }else{
                    if(!this.answers[val]){
                        this.answers[val] = 1;
                    }else{
                        this.answers[val]++;
                    }
                }
            }
        }
        // Set answer board
        this.answerBoard =  this.puzzleBoard.map(ar => ar.slice());
    }

    // Cell is updatable
    isUpdatable(x,y){
        return this.puzzleBoard[y][x] == 0;
    }

    // Cell is erasable
    isErasable(x,y){
        return !this.answerBoard[y][x] == 0;
    }

    // Fill cell with data
    fillCell(x, y, val){
        let currentAnswer = this.getAnswerValue(x,y);
        if(currentAnswer == 0){
            this.toAnswer--;
        }else{
            this.answers[currentAnswer]--;
        }

        if(this.answers[val]){
            this.answers[val]++;
        }else{
            this.answers[val] = 1;
        }

        this.answerBoard[y][x] = val;
    }

    // Remove cell content
    eraseCell(x, y) {
        if(this.getAnswerValue(x,y) !== 0){
            this.answers[this.answerBoard[y][x]]--;
            this.answerBoard[y][x] = 0;
            this.toAnswer++;
        }
    }

    getAnswers() {
        return this.answers; 
    }

    // Get answer at cell
    getAnswerValue(x, y) {
        return this.answerBoard[y][x];
    }

    // Get filled options given cell coordinates
    checkFilledOptions(x,y){
        let options = {};
        let tempX, tempY, tempQ;
        let quadrantX = (x/3|0)*3;
        let quadrantY = (y/3|0)*3;
    
        for(let i = 0; i < this.answerBoard.length; i++){
            tempY = this.answerBoard[i][x];
            tempX = this.answerBoard[y][i];
            tempQ = this.answerBoard[quadrantY + (i/3|0) ][quadrantX + (i % 3) ];

            if(!options[tempX]) options[tempX] = 1; 
            if(!options[tempY]) options[tempY] = 1;
            if(!options[tempQ]) options[tempQ] = 1;
        }
    
        return options;
    }

    // Check for a win or error
    isFull() {
        return this.toAnswer === 0;
    }

    // Check answer validity
    checkBoard(){ 
        console.log(this.answers);
        if(Object.keys(this.answers).length !== 9){
            return {type: 'error', message: 'Invalid values found.'};
        }

        for(let i = 1; i < 10; i++){
            if(this.answers[i] !== 9){
                if(this.answers[i] > 9){
                    return {type: 'error', message: `To many ${i} found...`};
                }else{
                    return {type: 'error', message: `To few ${i} found...`};
                }
            }
        }

        let xValues = {};
        let yValues = {};
        let qValues = {};
        let tempX, tempY, tempQ;
        
        // check rows and columns
        for(let i = 0; i < this.answerBoard.length; i++){
            xValues = {};
            yValues = {};
            for(let j = 0; j < this.answerBoard.length; j++){
                tempX = this.answerBoard[i][j];
                tempY = this.answerBoard[j][i];
                // Just in case
                if( tempX < 1 || tempX > 9 ){
                    return {type: 'error', message: 'Invalid values found.'};
                }else if(xValues[tempX] || yValues[tempY]){
                    return {type: 'error', message: 'Invalid answer.'};
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
                for(let t = 0; t < this.answerBoard.length; t++){
                    tempQ = this.answerBoard[(j*3) + (t/3|0) ][(i*3) + (t % 3) ];
                    if(qValues[tempQ]){ 
                        return {type: 'error', message: 'Invalid answer.'};
                    }else{
                        qValues[tempQ] = 1;
                    }
                }
            }
        }
    
        return {type: 'success', message: 'Well done!'};
    }

}