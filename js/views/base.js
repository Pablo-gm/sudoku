export const elements = {
    board: document.querySelector('#board'),
    undoButton: document.querySelector('#undo'),
    redoButton: document.querySelector('#redo'),
    eraseButton: document.querySelector('#erase'),
    resetButton: document.querySelector('#reset'),
    resetSection: document.querySelector('#restartSection'),
    restartButton: document.querySelector('#restart'),
    hintsButton: document.querySelector('#hints'),
    newButton: document.querySelector('#new'),
    newSection: document.querySelector('#newSection'),
    generateButton: document.querySelector('#generate'),
    cancelButton: document.querySelector('#cancel'),
    difficultySection: document.querySelector('#difficultySection'),
    cancelRestartButton: document.querySelector('#cancelRestart'),
    optionChips: document.querySelectorAll('.chip__item'),
    messsageSection: document.querySelector('#messageSection'),
    messsage: document.querySelector('#message')
};

export const selectors = {
    difficulty: 'input[name="difficulty"]:checked',
    guideCells: '.board__cell--guide',
    filledCells: '.board__cell--filled',
    workingCells: '.board__cell--working',
}