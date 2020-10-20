import Sudoku from './models/Sudoku.js';
import * as sudokuView from './views/sudokuView.js';
import { elements , selectors } from './views/base.js';

// Hold different game states and objects
const state = {};

// Create sudoku object and call helper functions
const readyNewGame = () => {
    // Create a new Sudoku model object
    if (!state.sudoku) {
        state.sudoku = new Sudoku();
    }

    resetGameState();
    endGame();
}

// Reset game states
const resetGameState = () => {
    state.gameOn = 0;
    state.showHints = 0;
    state.currentCell = {};
    state.validOptions = {};
    state.undoActions = [];
    state.redoActions = [];
}

// Reset game state, clean UI and redo Sudoku board
const resetGame = () => {
    resetGameState();
    endGame();
    sudokuView.unreadyNewBtn();
    sudokuView.removeFilled();
    sudokuView.enableHintsBtn();
    state.gameOn = 1;
    state.sudoku.setAnswers();
    sudokuView.dumpBoard(state.sudoku.getPuzzleBoard());
}

// Clean game state and disable neccesary UI
const endGame = () => {
    state.gameOn = 0;
    sudokuView.readyNewBtn();
    sudokuView.disableUndoBtn();
    sudokuView.disableRedoBtn();
    sudokuView.disableEraseBtn();
    sudokuView.disableResetBtn();
    sudokuView.disableHintsBtn();
    sudokuView.removeGuides();
    sudokuView.cleanChips();
    sudokuView.disableUIChips();
}

// Prepare game state and UI for new game
const newGame = () => {
    state.gameOn = 1;
    state.showHints = 0;
    state.currentCell = {};
    sudokuView.unreadyNewBtn();
    sudokuView.clearHintsBtn();
    sudokuView.enableHintsBtn();

    sudokuView.removeFilled();
    sudokuView.removeGuides();
    sudokuView.cleanChips();
    sudokuView.disableUIChips();
    sudokuView.hideMessage();
}

// Erase cell value on game state and UI
const eraseCell = (x,y) => {
    // Get value before erase it
    let toUpdate = new Object();
    let cellValue = state.sudoku.getAnswerValue(x, y);

    state.sudoku.eraseCell(x, y);
    sudokuView.cleanCell(x, y);

    // Now ge get answers
    toUpdate[cellValue] =  state.sudoku.getAnswers(cellValue);
    sudokuView.updateHintCounter(toUpdate);
}

// Fill cell value on game state and UI
const fillCell = (x,y,val) => {
    state.sudoku.fillCell(x, y, val);
    sudokuView.drawCell(x, y, val);
    
    let toUpdate = new Object();
    toUpdate[val] = state.sudoku.getAnswers(val);
    sudokuView.updateHintCounter(toUpdate);
}

// Get and ready valid options according to current cell
const manageHints = () => {
    state.validOptions = state.sudoku.checkFilledOptions(state.currentCell.x, state.currentCell.y);
    sudokuView.readyChips(state.validOptions);
}

// Event listener for board cells
elements.board.addEventListener('click', e => {
    if (state.gameOn){
        if (e.target.matches('td')){
            let cellX = e.target.cellIndex;
            let cellY = e.target.parentElement.rowIndex;

            // Is a valid cell
            if(state.sudoku.isUpdatable(cellX, cellY)){
                // If same cell as current state, clean guides, disable erase btn
                if( state.currentCell && state.currentCell.x === cellX && state.currentCell.y === cellY ) {
                    sudokuView.removeGuides();
                    sudokuView.disableEraseBtn();
                    if (state.showHints) {
                        sudokuView.cleanChips();
                    }
                    sudokuView.disableUIChips();
                // Otherwise, prepare UI and set current cell state
                }else{
                    state.currentCell = { x: cellX, y: cellY };

                    sudokuView.enableUIChips();

                    if (state.showHints) {
                        manageHints();
                    }
        
                    sudokuView.removeGuides();
                    sudokuView.addGuides(state.currentCell.x, state.currentCell.y);

                    if(state.sudoku.isErasable(state.currentCell.x, state.currentCell.y)){
                        sudokuView.enableEraseBtn();
                    }else{
                        sudokuView.disableEraseBtn();
                    }
                }
            }
        }
    }
});

// Event listener for option chips
elements.optionChips.forEach( (chip) => {
    chip.addEventListener('click', (e) => { 
        e.preventDefault();
        chip.blur();

        if( state.gameOn && state.currentCell ) {

            // Fill cell actions
            fillCell(state.currentCell.x, state.currentCell.y, chip.dataset.number);

            // Undo actions
            state.undoActions.push({ action: 'add', x: state.currentCell.x, y: state.currentCell.y, value: chip.dataset.number });
            if(state.undoActions.length == 1) {
                sudokuView.enableUndoBtn();

                // Enable reset button
                sudokuView.enableResetBtn();
            }
            
            // Redo Actions
            state.redoActions = [];
            sudokuView.disableRedoBtn();

            // Enable erase button
            sudokuView.enableEraseBtn();

            // Check if game is finished?
            if(state.sudoku.isFull()){
                let answer = state.sudoku.checkBoard();
                sudokuView.setMessage(answer.type, answer.message);
                sudokuView.showMessage();

                if(answer.type === 'success'){
                    state.gameOn = 0;
                    endGame();
                }
            }

        }
    } );
});

// Event listener for undo button
elements.undoButton.addEventListener('click', e => {
    e.preventDefault();
    sudokuView.blurUndoBtn();

    if( state.gameOn && state.undoActions.length) {
        let action = state.undoActions.pop();

        // Clean UI and states
        state.currentCell = '';
        sudokuView.removeGuides();

        if ( action.action === 'add'){
            // Erase cell actions
            eraseCell(action.x, action.y);
        } else if ( action.action === 'erase') {
            // Fill cell actions
            fillCell(action.x, action.y, action.value);
        }

        // Disable button if neccesary
        if(state.undoActions.length == 0) {
            sudokuView.disableUndoBtn();
        }

        // Redo Actions
        state.redoActions.push(action);
        sudokuView.enableRedoBtn();

        // Disable erase
        sudokuView.disableEraseBtn();

        // Disable chips
        sudokuView.disableUIChips();
    }
});

// Event listener for option chips
elements.redoButton.addEventListener('click', e => {
    e.preventDefault();
    sudokuView.blurRedoBtn();

    if( state.gameOn && state.redoActions.length) {
        let action = state.redoActions.pop();

        // Clean UI and states
        state.currentCell = '';
        sudokuView.removeGuides();

        if ( action.action === 'add'){
            // Fill cell actions
            fillCell(action.x, action.y, action.value);
        } else if ( action.action === 'erase') {
            // Erase cell actions
            eraseCell(action.x, action.y);
        }

        // Disable button if neccesary
        if(state.redoActions.length == 0) {
            sudokuView.disableRedoBtn();
        }

        // Undo Actions
        state.undoActions.push(action);
        sudokuView.enableUndoBtn();

        // Disable erase
        sudokuView.disableEraseBtn();

        // Disable chips
        sudokuView.disableUIChips();
    }
});

// Event listener for option chips
elements.eraseButton.addEventListener('click', e => {
    e.preventDefault();
    sudokuView.blurEraseBtn();

    if( state.gameOn &&  state.currentCell && state.sudoku.isErasable(state.currentCell.x, state.currentCell.y) ) {

        // Undo actions
        state.undoActions.push({ action: 'erase', x: state.currentCell.x, y: state.currentCell.y, value: state.sudoku.getAnswerValue(state.currentCell.x, state.currentCell.y) });

        // Erase cell actions
        eraseCell(state.currentCell.x, state.currentCell.y);
        
        // Disable erase button
        sudokuView.disableEraseBtn();
    }
});

// Event listener for reset button --> show restart section
elements.resetButton.addEventListener('click', e => {
    e.preventDefault();
    if( state.gameOn && (state.undoActions.length || state.redoActions.length) ){
        sudokuView.showReset();
    }
});

// Event listener for cancel restart button --> hide restart section
elements.cancelRestartButton.addEventListener('click', e => {
    e.preventDefault();
    sudokuView.hideReset();
});

// Event listener for restart button
elements.restartButton.addEventListener('click', e => {
    e.preventDefault();
    if(state.gameOn){
        resetGame();
        sudokuView.hideReset();
    }
});

// Event listener for hints button --> show/hide hints when choosing cell options
elements.hintsButton.addEventListener('click', e => {
    e.preventDefault();
    sudokuView.blurHintsBtn();

    if(state.gameOn){
        state.showHints = !state.showHints;
        sudokuView.toggleHintsBtn();
        if(!state.showHints){
            sudokuView.cleanChips();
        }else if(state.currentCell){
            manageHints();
        }
    }
});

// Event listener for new button --> show generate section
elements.newButton.addEventListener('click', e => {
    e.preventDefault();
    if( state.gameOn && (state.undoActions.length || state.redoActions.length) ){
        sudokuView.showNewMessage();
    }else{
        sudokuView.hideNewMessage();
    }
    sudokuView.showDifficulty();
});

// Event listener for cancel new button --> hide generate section
elements.cancelButton.addEventListener('click', e => {
    e.preventDefault();
    sudokuView.hideDifficulty();
});

// Event listener for generate new sudoku
elements.generateButton.addEventListener('click', e => {
    e.preventDefault();

    // Generate new board
    state.sudoku.generatePuzzle();
    state.sudoku.slicePuzzle( parseInt(document.querySelector(selectors.difficulty).value));

    // Manage new board UI
    sudokuView.hideDifficulty();
    sudokuView.changeTitle(state.sudoku.getDifficulty());
    sudokuView.dumpBoard(state.sudoku.getPuzzleBoard());
    sudokuView.updateHintCounter(state.sudoku.getAnswers());

    // Update new game state
    endGame();
    resetGameState();
    newGame();
});

// Event listener for alert --> hide alert on 'x' click
elements.messsage.addEventListener('click', e => {
    e.preventDefault();
    if (e.target.closest('.alert__close')){
        sudokuView.hideMessage();
    }
});

// Ready game state on load
readyNewGame();