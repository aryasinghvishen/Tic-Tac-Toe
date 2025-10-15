// Game variables
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let gameMode = 'twoPlayer'; // 'twoPlayer' or 'vsComputer'
let scores = {
    X: 0,
    O: 0,
    tie: 0
};

// DOM elements
const statusDisplay = document.getElementById('status');
const cells = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restartBtn');
const twoPlayerBtn = document.getElementById('twoPlayerBtn');
const vsComputerBtn = document.getElementById('vsComputerBtn');
const scoreXDisplay = document.getElementById('scoreX');
const scoreODisplay = document.getElementById('scoreO');
const scoreTieDisplay = document.getElementById('scoreTie');

// Winning conditions
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Initialize the game
function initGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    
    // Reset cell displays
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'win');
    });
    
    updateStatus();
}

// Update game status display
function updateStatus() {
    if (gameActive) {
        statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

// Handle cell click
function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));
    
    // Check if cell is already played or game is not active
    if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
        return;
    }
    
    // Process player move
    processMove(clickedCellIndex, clickedCell);
    
    // If playing against computer and game is still active
    if (gameMode === 'vsComputer' && gameActive && currentPlayer === 'O') {
        setTimeout(makeComputerMove, 500); // Add slight delay for better UX
    }
}

// Process a move
function processMove(cellIndex, cellElement) {
    // Update game state
    gameBoard[cellIndex] = currentPlayer;
    cellElement.textContent = currentPlayer;
    cellElement.classList.add(currentPlayer.toLowerCase());
    
    // Check for win or draw
    const roundWon = checkWin();
    const roundDraw = checkDraw();
    
    if (roundWon) {
        handleWin();
    } else if (roundDraw) {
        handleDraw();
    } else {
        // Continue game
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateStatus();
    }
}

// Check for win
function checkWin() {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            // Highlight winning cells
            cells[a].classList.add('win');
            cells[b].classList.add('win');
            cells[c].classList.add('win');
            return true;
        }
    }
    return false;
}

// Check for draw
function checkDraw() {
    return !gameBoard.includes('');
}

// Handle win
function handleWin() {
    gameActive = false;
    statusDisplay.textContent = `Player ${currentPlayer} Wins!`;
    scores[currentPlayer]++;
    updateScoreDisplay();
}

// Handle draw
function handleDraw() {
    gameActive = false;
    statusDisplay.textContent = "Game ended in a draw!";
    scores.tie++;
    updateScoreDisplay();
}

// Update score display
function updateScoreDisplay() {
    scoreXDisplay.textContent = `Player X: ${scores.X}`;
    scoreODisplay.textContent = `Player O: ${scores.O}`;
    scoreTieDisplay.textContent = `Ties: ${scores.tie}`;
}

// Computer move logic
function makeComputerMove() {
    if (!gameActive) return;
    
    // Simple AI strategy:
    // 1. Try to win
    // 2. Block player from winning
    // 3. Take center if available
    // 4. Take a random available cell
    
    let move = findWinningMove('O') || 
               findWinningMove('X') || 
               takeCenter() || 
               takeRandomCell();
    
    if (move !== null) {
        const cellElement = cells[move];
        processMove(move, cellElement);
    }
}

// Find a winning move for the specified player
function findWinningMove(player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        const condition = [gameBoard[a], gameBoard[b], gameBoard[c]];
        
        // Count player marks and empty cells
        const playerCount = condition.filter(cell => cell === player).length;
        const emptyCount = condition.filter(cell => cell === '').length;
        
        if (playerCount === 2 && emptyCount === 1) {
            // Return the empty cell index to complete the win/block
            if (gameBoard[a] === '') return a;
            if (gameBoard[b] === '') return b;
            if (gameBoard[c] === '') return c;
        }
    }
    return null;
}

// Take center if available
function takeCenter() {
    return gameBoard[4] === '' ? 4 : null;
}

// Take a random available cell
function takeRandomCell() {
    const availableCells = gameBoard
        .map((cell, index) => cell === '' ? index : null)
        .filter(cell => cell !== null);
    
    if (availableCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        return availableCells[randomIndex];
    }
    return null;
}

// Set game mode
function setGameMode(mode) {
    gameMode = mode;
    
    // Update UI
    if (mode === 'twoPlayer') {
        twoPlayerBtn.classList.add('active');
        vsComputerBtn.classList.remove('active');
    } else {
        twoPlayerBtn.classList.remove('active');
        vsComputerBtn.classList.add('active');
    }
    
    // Reset game when changing mode
    initGame();
}

// Event listeners
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

restartBtn.addEventListener('click', initGame);

twoPlayerBtn.addEventListener('click', () => setGameMode('twoPlayer'));
vsComputerBtn.addEventListener('click', () => setGameMode('vsComputer'));

// Initialize the game when page loads
window.addEventListener('load', () => {
    initGame();
    updateScoreDisplay();
});