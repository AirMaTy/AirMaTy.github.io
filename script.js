// Constantes principales
const ROWS = 6;
const COLS = 7;
const CONNECT = 4;
const EMPTY = 0;
const RED = 1; // joueur 1
const YELLOW = -1; // joueur 2

// Éléments du DOM
const boardEl = document.getElementById('board');
const modeSelect = document.getElementById('mode');
const starterSelect = document.getElementById('starter');
const modeStatus = document.getElementById('modeStatus');
const turnStatus = document.getElementById('turnStatus');
const messageEl = document.getElementById('message');
const resetBtn = document.getElementById('reset');
const adviceBtn = document.getElementById('advice');

// État du jeu
let board = createEmptyBoard();
let currentPlayer = RED;
let gameOver = false;
let mode = 'ai';
let suggestionCol = null;
let aiPlayer = YELLOW; // mis à jour selon le premier joueur

init();

function init() {
  buildGrid();
  bindEvents();
  resetGame();
}

function createEmptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));
}

function buildGrid() {
  boardEl.innerHTML = '';
  boardEl.style.setProperty('--rows', ROWS);
  boardEl.style.setProperty('--cols', COLS);

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = r;
      cell.dataset.col = c;
      boardEl.appendChild(cell);
    }
  }
}

function bindEvents() {
  boardEl.addEventListener('click', handleBoardClick);
  modeSelect.addEventListener('change', handleModeChange);
  starterSelect.addEventListener('change', handleStarterChange);
  resetBtn.addEventListener('click', resetGame);
  adviceBtn.addEventListener('click', handleAdvice);
}

function handleModeChange() {
  mode = modeSelect.value;
  updateStarterOptions();
  resetGame();
}

function handleStarterChange() {
  resetGame();
}

function updateStarterOptions() {
  starterSelect.innerHTML = '';
  if (mode === 'pvp') {
    starterSelect.insertAdjacentHTML('beforeend', '<option value="human">Joueur 1 (rouge)</option>');
    starterSelect.insertAdjacentHTML('beforeend', '<option value="ai">Joueur 2 (jaune)</option>');
    adviceBtn.disabled = true;
    adviceBtn.classList.add('ghost');
  } else {
    starterSelect.insertAdjacentHTML('beforeend', '<option value="human">Humain</option>');
    starterSelect.insertAdjacentHTML('beforeend', '<option value="ai">IA</option>');
    adviceBtn.disabled = mode !== 'assist';
    adviceBtn.classList.toggle('ghost', mode !== 'assist');
  }

  adviceBtn.disabled = mode !== 'assist';
  adviceBtn.classList.toggle('ghost', mode !== 'assist');
}

function resetGame() {
  board = createEmptyBoard();
  gameOver = false;
  suggestionCol = null;
  clearSuggestion();
  clearWinnerHighlights();
  if (mode === 'pvp') {
    currentPlayer = starterSelect.value === 'human' ? RED : YELLOW;
  } else {
    aiPlayer = starterSelect.value === 'ai' ? RED : YELLOW;
    // Le rouge est toujours le premier joueur : humain si sélectionné, sinon l'IA.
    currentPlayer = RED;
  }
  updateModeStatus();
  renderBoard();
  updateTurnStatus();
  messageEl.textContent = '';
  if (mode !== 'pvp' && currentPlayer === aiPlayer) {
    aiMoveWithDelay();
  }
}

function updateModeStatus() {
  const label = modeSelect.options[modeSelect.selectedIndex].textContent;
  modeStatus.textContent = `Mode : ${label}`;
}

function updateTurnStatus() {
  if (gameOver) return;
  let text = '';
  if (mode === 'pvp') {
    text = currentPlayer === RED ? 'Au tour du joueur rouge' : 'Au tour du joueur jaune';
  } else {
    const isHumanTurn = currentPlayer !== aiPlayer;
    text = isHumanTurn ? 'Au tour du joueur (couleur rouge si premier, sinon jaune)' : 'Au tour de l\'IA';
  }
  turnStatus.textContent = text;
}

function handleBoardClick(e) {
  if (gameOver) return;
  const cell = e.target.closest('.cell');
  if (!cell) return;
  const col = Number(cell.dataset.col);

  if (mode !== 'pvp' && currentPlayer === aiPlayer) {
    return; // empêcher clic pendant le tour de l'IA
  }

  playMove(col);
}

function playMove(col) {
  if (suggestionCol !== null) clearSuggestion();
  const row = getAvailableRow(col);
  if (row === null) {
    flashMessage('Colonne pleine');
    return;
  }

  placePiece(row, col, currentPlayer);
  renderPiece(row, col, currentPlayer);
  const outcome = evaluateOutcome(row, col, currentPlayer);

  if (outcome.finished) {
    endGame(outcome);
    return;
  }

  switchTurn();

  if (mode !== 'pvp' && currentPlayer === aiPlayer && !gameOver) {
    aiMoveWithDelay();
  }
}

function getAvailableRow(col) {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === EMPTY) return r;
  }
  return null;
}

function placePiece(row, col, player) {
  board[row][col] = player;
}

function renderBoard() {
  boardEl.querySelectorAll('.piece').forEach(p => p.remove());
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] !== EMPTY) {
        renderPiece(r, c, board[r][c]);
      }
    }
  }
}

function renderPiece(row, col, player) {
  const cell = boardEl.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
  if (!cell) return;
  const piece = document.createElement('div');
  piece.className = `piece ${player === RED ? 'rouge' : 'jaune'}`;
  cell.appendChild(piece);
}

function evaluateOutcome(row, col, player) {
  const winLine = checkWin(row, col, player);
  if (winLine) {
    highlightWinners(winLine);
    return { finished: true, winner: player };
  }
  if (isBoardFull()) {
    return { finished: true, winner: null };
  }
  return { finished: false };
}

function checkWin(row, col, player) {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (const [dr, dc] of directions) {
    const line = [[row, col]];
    // avant
    let r = row + dr;
    let c = col + dc;
    while (isInside(r, c) && board[r][c] === player) {
      line.push([r, c]);
      r += dr;
      c += dc;
    }
    // arrière
    r = row - dr;
    c = col - dc;
    while (isInside(r, c) && board[r][c] === player) {
      line.unshift([r, c]);
      r -= dr;
      c -= dc;
    }
    if (line.length >= CONNECT) {
      return line.slice(0, CONNECT);
    }
  }
  return null;
}

function isInside(r, c) {
  return r >= 0 && r < ROWS && c >= 0 && c < COLS;
}

function isBoardFull() {
  return board[0].every(cell => cell !== EMPTY);
}

function switchTurn() {
  currentPlayer = -currentPlayer;
  updateTurnStatus();
}

function endGame({ winner }) {
  gameOver = true;
  if (winner === RED) {
    turnStatus.textContent = 'Le joueur rouge a gagné';
  } else if (winner === YELLOW) {
    turnStatus.textContent = mode === 'pvp' ? 'Le joueur jaune a gagné' : 'L\'IA a gagné';
  } else {
    turnStatus.textContent = 'Match nul';
  }
}

function flashMessage(text) {
  messageEl.textContent = text;
  setTimeout(() => {
    if (!gameOver) messageEl.textContent = '';
  }, 1200);
}

function highlightWinners(line) {
  clearWinnerHighlights();
  for (const [r, c] of line) {
    const cell = boardEl.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
    if (cell) cell.classList.add('winner');
  }
}

function clearWinnerHighlights() {
  boardEl.querySelectorAll('.winner').forEach(el => el.classList.remove('winner'));
}

function clearSuggestion() {
  suggestionCol = null;
  boardEl.classList.remove('suggestion');
  boardEl.querySelectorAll('.cell').forEach(cell => cell.style.boxShadow = '');
  messageEl.textContent = '';
}

function highlightSuggestion(col) {
  clearSuggestion();
  suggestionCol = col;
  boardEl.classList.add('suggestion');
  boardEl.querySelectorAll(`.cell[data-col="${col}"]`).forEach(cell => {
    cell.style.boxShadow = '0 0 0 2px rgba(247,178,103,0.8)';
  });
  messageEl.textContent = `Coup conseillé : colonne ${col + 1}`;
}

function aiMoveWithDelay() {
  setTimeout(() => {
    const best = computeBestMove(board, aiPlayer);
    if (best !== null && !gameOver) {
      playMove(best);
    }
  }, 220);
}

function handleAdvice() {
  if (mode !== 'assist' || currentPlayer === aiPlayer || gameOver) return;
  const best = computeBestMove(board, currentPlayer);
  if (best !== null) highlightSuggestion(best);
}

// ----------- IA MINIMAX -----------
// L'IA repose sur un Minimax avec élagage alpha-bêta.
// L'évaluation donne un score positif si la position favorise l'IA, négatif sinon.
const MAX_DEPTH = 6;

function computeBestMove(state, player) {
  const legalMoves = getLegalMoves(state);
  let bestScore = -Infinity;
  let bestMove = legalMoves[0] ?? null;

  // Priorité au centre pour des solutions plus solides
  const orderedMoves = legalMoves.sort((a, b) => Math.abs(b - 3) - Math.abs(a - 3));

  for (const move of orderedMoves) {
    const { nextBoard, row } = applyMove(state, move, player);
    const result = minimax(nextBoard, MAX_DEPTH - 1, false, -Infinity, Infinity, -player, row, move);
    if (result > bestScore) {
      bestScore = result;
      bestMove = move;
    }
  }
  return bestMove;
}

function minimax(state, depth, maximizing, alpha, beta, player, lastRow, lastCol) {
  const winner = lastRow !== undefined ? checkLastMoveWinner(state, lastRow, lastCol, -player) : null;
  if (winner === aiPlayer) return 1000000 + depth; // plus tôt = mieux
  if (winner === -aiPlayer) return -1000000 - depth;
  if (isBoardFullState(state)) return 0;
  if (depth === 0) return heuristicScore(state, aiPlayer);

  const moves = getLegalMoves(state);
  // tri par proximité du centre
  moves.sort((a, b) => Math.abs(a - 3) - Math.abs(b - 3));

  if (maximizing) {
    let value = -Infinity;
    for (const move of moves) {
      const { nextBoard, row } = applyMove(state, move, player);
      const evalScore = minimax(nextBoard, depth - 1, false, alpha, beta, -player, row, move);
      value = Math.max(value, evalScore);
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break; // élagage
    }
    return value;
  } else {
    let value = Infinity;
    for (const move of moves) {
      const { nextBoard, row } = applyMove(state, move, player);
      const evalScore = minimax(nextBoard, depth - 1, true, alpha, beta, -player, row, move);
      value = Math.min(value, evalScore);
      beta = Math.min(beta, value);
      if (alpha >= beta) break;
    }
    return value;
  }
}

function getLegalMoves(state) {
  const moves = [];
  for (let c = 0; c < COLS; c++) {
    if (state[0][c] === EMPTY) moves.push(c);
  }
  return moves;
}

function isBoardFullState(state) {
  return state[0].every(v => v !== EMPTY);
}

function applyMove(state, col, player) {
  const nextBoard = state.map(row => [...row]);
  for (let r = ROWS - 1; r >= 0; r--) {
    if (nextBoard[r][col] === EMPTY) {
      nextBoard[r][col] = player;
      return { nextBoard, row: r };
    }
  }
  return { nextBoard: state, row: null };
}

function checkLastMoveWinner(state, row, col, player) {
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];
  for (const [dr, dc] of directions) {
    let count = 1;
    count += countDirection(state, row, col, dr, dc, player);
    count += countDirection(state, row, col, -dr, -dc, player);
    if (count >= CONNECT) return player;
  }
  return null;
}

function countDirection(state, row, col, dr, dc, player) {
  let r = row + dr;
  let c = col + dc;
  let count = 0;
  while (r >= 0 && r < ROWS && c >= 0 && c < COLS && state[r][c] === player) {
    count++;
    r += dr;
    c += dc;
  }
  return count;
}

// Évaluation heuristique :
// on parcourt toutes les fenêtres de 4 cases pour attribuer un score
function heuristicScore(state, player) {
  let score = 0;
  // Bonus pour contrôler le centre
  const centerCol = Math.floor(COLS / 2);
  let centerCount = 0;
  for (let r = 0; r < ROWS; r++) {
    if (state[r][centerCol] === player) centerCount++;
  }
  score += centerCount * 6;

  const windows = getAllWindows(state);
  for (const window of windows) {
    score += evaluateWindow(window, player);
  }
  return score;
}

function getAllWindows(state) {
  const windows = [];
  // Horizontales
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS - CONNECT; c++) {
      windows.push([state[r][c], state[r][c + 1], state[r][c + 2], state[r][c + 3]]);
    }
  }
  // Verticales
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r <= ROWS - CONNECT; r++) {
      windows.push([state[r][c], state[r + 1][c], state[r + 2][c], state[r + 3][c]]);
    }
  }
  // Diagonales ↘︎
  for (let r = 0; r <= ROWS - CONNECT; r++) {
    for (let c = 0; c <= COLS - CONNECT; c++) {
      windows.push([state[r][c], state[r + 1][c + 1], state[r + 2][c + 2], state[r + 3][c + 3]]);
    }
  }
  // Diagonales ↗︎
  for (let r = CONNECT - 1; r < ROWS; r++) {
    for (let c = 0; c <= COLS - CONNECT; c++) {
      windows.push([state[r][c], state[r - 1][c + 1], state[r - 2][c + 2], state[r - 3][c + 3]]);
    }
  }
  return windows;
}

function evaluateWindow(window, player) {
  const opp = -player;
  const countPlayer = window.filter(v => v === player).length;
  const countOpp = window.filter(v => v === opp).length;
  const countEmpty = window.filter(v => v === EMPTY).length;

  // Scores inspirés des heuristiques classiques pour Puissance 4
  if (countPlayer === 4) return 100000;
  if (countPlayer === 3 && countEmpty === 1) return 500;
  if (countPlayer === 2 && countEmpty === 2) return 60;
  if (countPlayer === 1 && countEmpty === 3) return 6;

  if (countOpp === 3 && countEmpty === 1) return -400;
  if (countOpp === 2 && countEmpty === 2) return -50;

  return 0;
}
// ---------------------------------
