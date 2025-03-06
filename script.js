const grid = document.getElementById('sudoku-grid');
const solvedGrid = document.getElementById('solved-grid');
const hintBtn = document.getElementById('hint-btn');
const resetBtn = document.getElementById('reset-btn');
const newGameBtn = document.getElementById('new-game-btn');
const checkSolutionBtn = document.getElementById('check-solution-btn');
const timerDisplay = document.getElementById('timer');
const messageDisplay = document.getElementById('message');
const dareMessageDisplay = document.getElementById('dare-message');
const skipsRemainingDisplay = document.getElementById('skips-remaining');
const hintsRemainingDisplay = document.getElementById('hints-remaining');
const dareScoreDisplay = document.getElementById('dare-score');

// Difficulty Pop-up Elements
const difficultyPopup = document.getElementById('difficulty-popup');
const easyBtn = document.getElementById('easy-btn');
const mediumBtn = document.getElementById('medium-btn');
const hardBtn = document.getElementById('hard-btn');

// Dare Pop-up Elements
const darePopup = document.getElementById('dare-popup');
const dareText = document.getElementById('dare-text');
const completeDareBtn = document.getElementById('complete-dare-btn');
const skipDareBtn = document.getElementById('skip-dare-btn');

// Number Input Pop-up Elements
const numberPopup = document.getElementById('number-popup');
const numberPad = document.querySelector('.number-pad');
const closeNumberPopupBtn = document.getElementById('close-number-popup');

let board = [];
let initialBoard = [];
let solvedBoard = [];
let startTime;
let timerInterval;
let skipsRemaining = 2;
let dareScore = 0;
let hintsRemaining = 5;
let currentDifficulty = 'easy'; // Default difficulty
let selectedCell = null; // Track the selected cell for number input

const dares = [
  "Send a romantic text to your partner.",
  "Compliment the person next to you.",
  "Do 10 jumping jacks.",
  "Sing a love song out loud.",
  "Write a short love poem.",
  "Dance for 30 seconds.",
  "Tell someone why you appreciate them.",
  "Share a funny story about yourself.",
  "Post a romantic quote on social media.",
  "Give someone a high-five.",
  "Draw a heart on a piece of paper and show it to someone.",
  "Say 'I love you' to someone in the room.",
  "Do a silly impression of a famous person.",
  "Tell a joke and make someone laugh.",
  "Share your favorite memory with someone.",
  "Write down three things you're grateful for.",
  "Take a selfie with someone and post it.",
  "Do a cartwheel or attempt one!",
  "Tell someone what you admire about them.",
  "Whisper a secret to someone."
];

const specialDares = [
  "Write a love letter to someone and read it out loud.",
  "Call someone and sing them a song.",
  "Post a romantic story on social media.",
  "Do 20 push-ups.",
  "Tell someone your deepest secret."
];

// Show Difficulty Pop-up on Load
difficultyPopup.style.display = 'block';

// Handle Difficulty Selection
easyBtn.addEventListener('click', () => {
  currentDifficulty = 'easy';
  difficultyPopup.style.display = 'none';
  generateRandomBoard(currentDifficulty);
  startTimer();
});

mediumBtn.addEventListener('click', () => {
  currentDifficulty = 'medium';
  difficultyPopup.style.display = 'none';
  generateRandomBoard(currentDifficulty);
  startTimer();
});

hardBtn.addEventListener('click', () => {
  currentDifficulty = 'hard';
  difficultyPopup.style.display = 'none';
  generateRandomBoard(currentDifficulty);
  startTimer();
});

// Generate a random Sudoku board
function generateRandomBoard(difficulty) {
  solvedBoard = generateSolvedBoard();
  const prefilledCells = difficulty === 'easy' ? 61 : difficulty === 'medium' ? 51 : 41;
  board = removeNumbers(solvedBoard, prefilledCells);
  initialBoard = JSON.parse(JSON.stringify(board));
  renderBoard();
  renderSolvedBoard();
}

// Generate a solved Sudoku board
function generateSolvedBoard() {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));
  solveSudoku(board);
  return board;
}

// Solve Sudoku using backtracking
function solveSudoku(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of numbers) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Check if a number is valid in a cell
function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i][j] === num) return false;
    }
  }
  return true;
}

// Shuffle an array (for random number selection)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Remove numbers to create a puzzle
function removeNumbers(board, prefilledCells) {
  const cellsToRemove = 81 - prefilledCells;
  const newBoard = JSON.parse(JSON.stringify(board));
  for (let i = 0; i < cellsToRemove; i++) {
    let row, col;
    do {
      row = Math.floor(Math.random() * 9);
      col = Math.floor(Math.random() * 9);
    } while (newBoard[row][col] === 0);
    newBoard[row][col] = 0;
  }
  return newBoard;
}

// Render the player's board
function renderBoard() {
  grid.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const cell = document.createElement('div');
      cell.textContent = board[i][j] === 0 ? '' : board[i][j];
      if (board[i][j] !== 0 && initialBoard[i][j] !== 0) {
        cell.classList.add('initial');
      }
      cell.addEventListener('click', () => handleCellClick(i, j));
      grid.appendChild(cell);
    }
  }
}

// Render the solved board
function renderSolvedBoard() {
  solvedGrid.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const cell = document.createElement('div');
      cell.textContent = solvedBoard[i][j];
      solvedGrid.appendChild(cell);
    }
  }
}

// Handle cell click
function handleCellClick(row, col) {
  if (initialBoard[row][col] !== 0) return; // Prevent editing initial cells
  selectedCell = { row, col }; // Track the selected cell
  numberPopup.style.display = 'block'; // Show the number input popup
}

// Handle number selection from the number pad
numberPad.addEventListener('click', (e) => {
  if (e.target.classList.contains('number-btn')) {
    const number = parseInt(e.target.getAttribute('data-number'));
    if (selectedCell) {
      board[selectedCell.row][selectedCell.col] = number; // Update the board
      renderBoard(); // Re-render the board
      checkWin(); // Check if the player has won
      numberPopup.style.display = 'none'; // Hide the number popup
    }
  }
});

// Close number popup
closeNumberPopupBtn.addEventListener('click', () => {
  numberPopup.style.display = 'none';
});

// Check if the player has won
function checkWin() {
  if (board.flat().every(cell => cell !== 0)) {
    clearInterval(timerInterval);
    messageDisplay.textContent = 'You win! 💖 Love is in the air!';
    messageDisplay.classList.add('win');
    playSound('win');
  }
}

// Start the timer
function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    timerDisplay.textContent = `⏰ Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);
}

// Reset the game
resetBtn.addEventListener('click', () => {
  board = JSON.parse(JSON.stringify(initialBoard));
  renderBoard();
  clearInterval(timerInterval);
  startTimer();
  messageDisplay.textContent = '';
  messageDisplay.classList.remove('win');
  skipsRemaining = 2;
  hintsRemaining = 5;
  updateSkips();
  updateHints();
  updateDareScore();
  solvedGrid.style.display = 'none';
});

// New Game
newGameBtn.addEventListener('click', () => {
  generateRandomBoard(currentDifficulty);
  startTimer();
  skipsRemaining = 2;
  hintsRemaining = 5;
  updateSkips();
  updateHints();
  updateDareScore();
  messageDisplay.textContent = '';
  messageDisplay.classList.remove('win');
  solvedGrid.style.display = 'none';
});

// Hint Button
hintBtn.addEventListener('click', () => {
  if (hintsRemaining <= 0) {
    messageDisplay.textContent = "No hints remaining! 💔";
    return;
  }

  if (skipsRemaining <= 0) {
    messageDisplay.textContent = "No skips remaining! Complete the dare to get a hint. 💖";
    return;
  }

  currentDareType = 'hint';
  const randomDare = dares[Math.floor(Math.random() * dares.length)];
  showDarePopup(randomDare);
});

// Check Solution Button
checkSolutionBtn.addEventListener('click', () => {
  currentDareType = 'checkSolution';
  const specialDare = specialDares[Math.floor(Math.random() * specialDares.length)];
  showDarePopup(specialDare);
});

// Provide a hint by filling in one correct number
function provideHint() {
  const emptyCells = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        emptyCells.push([i, j]);
      }
    }
  }

  if (emptyCells.length === 0) {
    messageDisplay.textContent = "No hints available! 💔";
    return;
  }

  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const validNumber = solvedBoard[row][col];
  board[row][col] = validNumber;
  renderBoard();
  const cell = grid.children[row * 9 + col];
  cell.classList.add('filled');
  messageDisplay.textContent = `Hint: Cell (${row + 1}, ${col + 1}) is ${validNumber}.`;
  playSound('hint');
}

// Show Dare Pop-up
function showDarePopup(dare) {
  dareText.textContent = dare;
  darePopup.style.display = 'block';
}

// Hide Dare Pop-up
function hideDarePopup() {
  darePopup.style.display = 'none';
}

// Handle Dare Completion
completeDareBtn.addEventListener('click', () => {
  hideDarePopup();
  if (currentDareType === 'hint') {
    hintsRemaining--;
    updateHints();
    provideHint();
    playSound('completeDare');
  } else if (currentDareType === 'checkSolution') {
    solvedGrid.style.display = 'grid';
    messageDisplay.textContent = "Here's the complete solution! 🎯";
  }
});

// Handle Dare Skip
skipDareBtn.addEventListener('click', () => {
  hideDarePopup();
  if (currentDareType === 'hint') {
    skipsRemaining--;
    updateSkips();
    messageDisplay.textContent = `Dare skipped! ${skipsRemaining} skips remaining.`;
    playSound('skipDare');
  } else if (currentDareType === 'checkSolution') {
    messageDisplay.textContent = "Complete the dare to see the solution! 💖";
  }
});

function updateSkips() {
  skipsRemainingDisplay.textContent = `⏭️ Skips Remaining: ${skipsRemaining}`;
}

function updateHints() {
  hintsRemainingDisplay.textContent = `💡 Hints Remaining: ${hintsRemaining}`;
}

function updateDareScore() {
  dareScoreDisplay.textContent = `💖 Dare Score: ${dareScore}`;
}

function playSound(soundType) {
  const sound = document.getElementById(`${soundType}Sound`);
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
}

// Initialize the game
document.getElementById('backgroundMusic').play();
