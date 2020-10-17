
import { elements, selectors } from './base.js';

// Ready new button classes
export const unreadyNewBtn = () => {
    elements.newButton.classList.remove('btn--green');
}

export const readyNewBtn = () => {
    elements.newButton.classList.add('btn--green');
}

export const blurnewBtn = () => {
    elements.newButton.blur();
}

// Ready remove button classes
export const enableEraseBtn = () => {
    elements.eraseButton.classList.remove('btn--disabled');
}

export const disableEraseBtn = () => {
    elements.eraseButton.classList.add('btn--disabled');
}

export const blurEraseBtn = () => {
    elements.eraseButton.blur();
}

// Ready undo button classes
export const enableUndoBtn = () => {
    elements.undoButton.classList.remove('btn--disabled');
}

export const disableUndoBtn = () => {
    elements.undoButton.classList.add('btn--disabled');
}

export const blurUndoBtn = () => {
    elements.undoButton.blur();
}

// Ready redo button classes
export const enableRedoBtn = () => {
    elements.redoButton.classList.remove('btn--disabled');
}

export const disableRedoBtn = () => {
    elements.redoButton.classList.add('btn--disabled');
}

export const blurRedoBtn = () => {
    elements.redoButton.blur();
}

// Ready reset button classes
export const enableResetBtn = () => {
    elements.resetButton.classList.remove('btn--disabled');
}

export const disableResetBtn = () => {
    elements.resetButton.classList.add('btn--disabled');
}

export const blurResetBtn = () => {
    elements.resetButton.blur();
}

// Ready hints button classes
export const enableHintsBtn = () => {
    elements.hintsButton.classList.remove('btn--disabled');
}

export const disableHintsBtn = () => {
    elements.hintsButton.classList.add('btn--disabled');
    elements.hintsButton.classList.remove('btn--active');
}

export const toggleHintsBtn = () => {
    elements.hintsButton.classList.toggle('btn--active');
}

export const blurHintsBtn = () => {
    elements.hintsButton.blur();
}

// Show reset elements
export const showReset = () => {
    elements.newSection.classList.remove('animation--show-y');
    elements.newSection.classList.add('animation--hide-y');
    elements.resetSection.classList.remove('animation--hide-y');
    elements.resetSection.classList.add('animation--show-y');
}

// Hide reset  elements
export const hideReset = () => {
    elements.newSection.classList.remove('animation--hide-y');
    elements.newSection.classList.add('animation--show-y');
    elements.resetSection.classList.add('animation--hide-y');
    elements.resetSection.classList.remove('animation--show-y');
}

// Show difficulty selections elements
export const showDifficulty = () => {
    elements.newSection.classList.remove('animation--show-y');
    elements.newSection.classList.add('animation--hide-y');
    elements.difficultySection.classList.remove('animation--hide-y');
    elements.difficultySection.classList.add('animation--show-y');
}

// Hide difficulty selection elements
export const hideDifficulty = () => {
    elements.newSection.classList.remove('animation--hide-y');
    elements.newSection.classList.add('animation--show-y');
    elements.difficultySection.classList.add('animation--hide-y');
    elements.difficultySection.classList.remove('animation--show-y');
}

// Show which options are possible
export const readyChips = (options) => {
    let val;
    elements.optionChips.forEach( (chip) => {
        val = chip.dataset.number;
        if(options[val]){
            chip.classList.add('chip__item--done');
        }else{
            chip.classList.remove('chip__item--done');
        }
    });
}

// Clean possible chip options
export const cleanChips = (options) => {
    elements.optionChips.forEach( (chip) => {
        chip.classList.remove('chip__item--done');
    });
}

// Disable class on chip options
export const disableUIChips = (options) => {
    elements.optionChips.forEach( (chip) => {
        chip.classList.add('chip__item--disabled');
    });
}

// Clean disabled class on chip options
export const enableUIChips = (options) => {
    elements.optionChips.forEach( (chip) => {
        chip.classList.remove('chip__item--disabled');
    });
}

// Display board values
export const dumpBoard = (board) => {
    let rows = Array.from(elements.board.rows);
    let x,y = 0;
    rows.forEach( row => {
        let cells = Array.from(row.cells);
        x= 0;
        cells.forEach(cell => { 
            if(board[y][x]){
                cell.textContent = board[y][x];
                cell.classList.add('board__cell--prefill');
            }else{
                cell.textContent = '';
                cell.classList = '';
            }
            x++;
        } );
        y++;
    });
}

// Add cell value
export const drawCell = (x, y, val) => {
    let cell = elements.board.rows[y].cells[x];
    cell.textContent = val;
    cell.classList.add('board__cell--filled');
}

// Erase cell value
export const cleanCell = (x, y) => {
    let cell = elements.board.rows[y].cells[x];
    cell.textContent = '';
    cell.classList.classList  = '';
}

// Add guide classes to board
export const addGuides = (posX, posY) => {

    let rows = Array.from(elements.board.rows);
    let quadrantX = (posX/3|0)*3;
    let quadrantY = (posY/3|0)*3;

    for(let i = 0; i < 9; i++){
        rows[i].cells[posX].classList.add('board__cell--guide');
        rows[posY].cells[i].classList.add('board__cell--guide');
        rows[quadrantY + (i/3|0) ].cells[quadrantX + (i % 3)].classList.add('board__cell--guide');
    }

    //rows[posY].cells[posX].classList.remove('board__cell--filled');
    rows[posY].cells[posX].classList.add('board__cell--working');
}

// Remove guide classes to board
export const removeGuides = () => {
    document.querySelectorAll(selectors.guideCells).forEach(cell => { cell.classList.remove('board__cell--guide') });
    document.querySelectorAll(selectors.workingCells).forEach(cell => { cell.classList.remove('board__cell--working') });
}

// Remove guide classes to board
export const removeFilled = () => {
    document.querySelectorAll(selectors.filledCells).forEach(cell => { cell.classList.remove('board__cell--filled') });
}


export const setMessage = (type, message) => {
    let icon, text;
    let close = '<svg class="alert__close" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style=""><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
    if ( type == 'success'){
        icon = '<svg class="alert__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
        elements.messsage.classList = 'alert mb--2 alert--success';
    } else if ( type == 'error'){
        icon = '<svg class="alert__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
        elements.messsage.classList = 'alert mb--2 alert--error';
    }
    elements.messsage.innerHTML  = `${icon} ${message} ${close}`;
}

export const showMessage = () => {
    elements.messsageSection.classList.add('animation--show-y')
    elements.messsageSection.classList.remove('animation--hide-y');
}

export const hideMessage = () => {
    elements.messsageSection.classList.remove('animation--show-y')
    elements.messsageSection.classList.add('animation--hide-y');
}