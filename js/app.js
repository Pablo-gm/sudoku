import Sudoku from './models/Sudoku.js';
import * as sudokuView from './views/sudokuView.js';
import { elements , selectors } from './views/base.js';

// To do
// chips to links?
// Comment more
// Use css comb
// Upload somewhere


const state = {};

const readyNewGame = () => {
    // Create a new Sudoku model object
    if (!state.sudoku) {
        state.sudoku = new Sudoku();
    }

    resetGameState();
    endGame();
}

const resetGameState = () => {
    state.gameOn = 0;
    state.showHints = 0;
    state.validOptions = {};
    state.undoActions = [];
    state.redoActions = [];
}

const resetGame = () => {
    resetGameState();
    endGame();
    sudokuView.enableUIChips();
    sudokuView.removeFilled();
    state.gameOn = 1;
    state.sudoku.setAnswers();
    sudokuView.dumpBoard(state.sudoku.getPuzzleBoard());
}

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

const newGame = () => {
    state.gameOn = 1;
    sudokuView.unreadyNewBtn();
    sudokuView.enableHintsBtn();
    sudokuView.enableResetBtn();

    sudokuView.removeFilled();
    sudokuView.removeGuides();
    sudokuView.cleanChips();
    sudokuView.enableUIChips();
    sudokuView.hideMessage();
}

const eraseCell = (x,y) => {
    state.sudoku.eraseCell(x, y);
    sudokuView.cleanCell(x, y);
}

const fillCell = (x,y,val) => {
    state.sudoku.fillCell(x, y, val);
    sudokuView.drawCell(x, y, val);
}

const manageHints = () => {
    state.validOptions = state.sudoku.checkFilledOptions(state.currentCell.x, state.currentCell.y);
    sudokuView.readyChips(state.validOptions);
}

elements.board.addEventListener('click', e => {
    if (state.gameOn){
        if (e.target.matches('td')){

            // If same cell, clean guides
            if( state.currentCell && state.currentCell.x === e.target.cellIndex && state.currentCell.y === e.target.parentElement.rowIndex ) {
                sudokuView.removeGuides();
                sudokuView.disableEraseBtn();
                if (state.showHints) {
                    sudokuView.cleanChips();
                }
            // Otherwise, prepare UI
            }else{
                state.currentCell = { x: e.target.cellIndex, y: e.target.parentElement.rowIndex };

                if (state.showHints) {
                    manageHints();
                }
    
                if(state.sudoku.isUpdatable(state.currentCell.x, state.currentCell.y)){
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


elements.optionChips.forEach( (chip) => {
    chip.addEventListener('click', () => { 
        if( state.gameOn && state.currentCell ) {

            // Fill cell actions
            fillCell(state.currentCell.x, state.currentCell.y, chip.dataset.number);

            // Undo actions
            state.undoActions.push({ action: 'add', x: state.currentCell.x, y: state.currentCell.y, value: chip.dataset.number });
            if(state.undoActions.length == 1) {
                sudokuView.enableUndoBtn();
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

elements.undoButton.addEventListener('click', e => {
    e.preventDefault();
    sudokuView.blurUndoBtn();

    if(state.undoActions.length) {
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

        if(state.undoActions.length == 0) {
            sudokuView.disableUndoBtn();
        }

        // Redo Actions
        state.redoActions.push(action);
        sudokuView.enableRedoBtn();

        // Disable erase
        sudokuView.disableEraseBtn();
    }
});

elements.redoButton.addEventListener('click', e => {
    e.preventDefault();
    sudokuView.blurRedoBtn();

    if(state.redoActions.length) {
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

        if(state.redoActions.length == 0) {
            sudokuView.disableRedoBtn();
        }

        // Undo Actions
        state.undoActions.push(action);
        sudokuView.enableUndoBtn();

        // Disable erase
        sudokuView.disableEraseBtn();
    }
});

elements.eraseButton.addEventListener('click', e => {
    e.preventDefault();
    sudokuView.blurEraseBtn();

    if( state.currentCell && state.sudoku.isErasable(state.currentCell.x, state.currentCell.y) ) {

        // Erase cell actions
        eraseCell(state.currentCell.x, state.currentCell.y);

        // Undo actions
        state.undoActions.push({ action: 'erase', x: state.currentCell.x, y: state.currentCell.y, value: state.sudoku.getAnswerValue(state.currentCell.x, state.currentCell.y) });
        if(state.undoActions.length == 1) {
            sudokuView.enableUndoBtn();
        }
        
        // Redo Actions
        state.redoActions = [];
        sudokuView.disableRedoBtn();

        sudokuView.disableEraseBtn();
    }
});

elements.resetButton.addEventListener('click', e => {
    e.preventDefault();
    if(state.gameOn){
        sudokuView.showReset();
    }
});

elements.cancelRestartButton.addEventListener('click', e => {
    e.preventDefault();
    sudokuView.hideReset();
});

elements.restartButton.addEventListener('click', e => {
    e.preventDefault();
    if(state.gameOn){
        resetGame();
        sudokuView.hideReset();
    }
});

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

elements.newButton.addEventListener('click', e => {
    e.preventDefault();
    sudokuView.showDifficulty();
});

elements.cancelButton.addEventListener('click', e => {
    e.preventDefault();
    sudokuView.hideDifficulty();
});

elements.generateButton.addEventListener('click', e => {
    e.preventDefault();
    sudokuView.hideDifficulty();
    state.sudoku.generatePuzzle();
    state.sudoku.slicePuzzle( parseInt(document.querySelector(selectors.difficulty).value));
    sudokuView.dumpBoard(state.sudoku.getPuzzleBoard());

    newGame();
});

elements.messsage.addEventListener('click', e => {
    e.preventDefault();
    if (e.target.matches('.alert__close')){
        sudokuView.hideMessage();
    }
});

readyNewGame();