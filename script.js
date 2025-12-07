// Morpion IA - trois modes avec IA imbattable et aide
// Code en JavaScript pur, commenté pour faciliter la lecture.

const boardEl = document.querySelector('.board');
const modeSelect = document.getElementById('mode');
const playerSymbolSelect = document.getElementById('player-symbol');
const starterSelect = document.getElementById('starter');
const turnLabel = document.getElementById('turn-label');
const resultLabel = document.getElementById('result');
const modeLabel = document.getElementById('mode-label');
const startLabel = document.getElementById('start-label');
const hintButton = document.getElementById('hint');
const resetButton = document.getElementById('reset');

const MODES = {
  AI: 'ia',
  ASSIST: 'assist',
  PVP: 'pvp'
};

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;
let humanSymbol = 'X';
let aiSymbol = 'O';
let currentMode = MODES.AI;
let suggestedIndex = null;

// --- Initialisation de la grille ---
function createBoardUI() {
  boardEl.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    cell.setAttribute('role', 'button');
    cell.setAttribute('aria-label', `Case ${i + 1}`);
    cell.addEventListener('click', onCellClick);

    const content = document.createElement('span');
    cell.appendChild(content);
    boardEl.appendChild(cell);
  }
}

// --- Gestion des clics sur la grille ---
function onCellClick(event) {
  const index = Number(event.currentTarget.dataset.index);

  if (gameOver || board[index]) return;

  // Impossible de jouer pour l'humain si ce n'est pas son tour dans les modes IA
  if (isAiTurn()) return;

  placeMove(index, currentPlayer);
  processTurn();
}

// Place un symbole dans l'état et l'UI
function placeMove(index, symbol) {
  board[index] = symbol;
  const cell = boardEl.querySelector(`[data-index="${index}"]`);
  if (cell) {
    cell.querySelector('span').textContent = symbol;
    cell.classList.remove('suggested');
  }
}

// Réinitialise le plateau et met à jour l'état
function resetGame() {
  board = Array(9).fill(null);
  gameOver = false;
  suggestedIndex = null;
  Array.from(boardEl.children).forEach(cell => {
    cell.querySelector('span').textContent = '';
    cell.classList.remove('suggested', 'disabled');
  });
  currentMode = modeSelect.value;
  humanSymbol = playerSymbolSelect.value;
  aiSymbol = humanSymbol === 'X' ? 'O' : 'X';
  currentPlayer = starterSelect.value;
  updateLabels();
  resultLabel.textContent = '';

  // Dans les modes IA, si l'IA commence, elle joue immédiatement
  if (isAiTurn() && !gameOver) {
    aiPlay();
  }
}

function updateLabels() {
  const modeText = {
    [MODES.AI]: 'IA imbattable',
    [MODES.ASSIST]: 'Aide IA + IA adverse',
    [MODES.PVP]: 'Joueur vs Joueur'
  }[currentMode];

  modeLabel.textContent = `Mode actuel : ${modeText}`;
  turnLabel.textContent = `Au tour de ${currentPlayer}`;
  startLabel.textContent = `Première pièce : ${starterSelect.value}`;

  hintButton.classList.toggle('hidden', currentMode !== MODES.ASSIST);
}

// Détecte un gagnant ou une égalité
function checkOutcome() {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] };
    }
  }

  if (board.every(Boolean)) {
    return { winner: null };
  }

  return null;
}

// Gère la suite d'un tour : vérifie fin, sinon passe la main/IA
function processTurn() {
  const outcome = checkOutcome();
  if (outcome) {
    endGame(outcome.winner);
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateLabels();

  if (isAiTurn() && !gameOver) {
    aiPlay();
  }
}

function endGame(winner) {
  gameOver = true;
  turnLabel.textContent = 'Partie terminée';
  if (winner) {
    resultLabel.textContent = `${winner} a gagné`;
  } else {
    resultLabel.textContent = 'Match nul';
  }
  // Empêche tout clic supplémentaire
  Array.from(boardEl.children).forEach(cell => cell.classList.add('disabled'));
}

function isAiTurn() {
  const isHumanTurn = currentMode === MODES.PVP ? true : currentPlayer === humanSymbol;
  return !isHumanTurn;
}

// --- IA : Minimax complet ---
// Évalue une position : +10 si l'IA gagne, -10 si l'humain gagne, 0 sinon
function evaluateBoard(boardState) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const [a, b, c] of lines) {
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      if (boardState[a] === aiSymbol) return 10;
      if (boardState[a] === humanSymbol) return -10;
    }
  }
  return 0;
}

// Liste les coups possibles
function availableMoves(boardState) {
  const moves = [];
  boardState.forEach((cell, idx) => {
    if (!cell) moves.push(idx);
  });
  return moves;
}

// Minimax récursif avec évaluation complète de l'arbre (plateau 3x3 -> faible complexité)
function minimax(boardState, depth, isMaximizing) {
  const score = evaluateBoard(boardState);
  if (score === 10 || score === -10) return score - depth * (score > 0 ? 1 : -1);
  if (availableMoves(boardState).length === 0) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (const move of availableMoves(boardState)) {
      boardState[move] = aiSymbol;
      best = Math.max(best, minimax(boardState, depth + 1, false));
      boardState[move] = null;
    }
    return best;
  } else {
    let best = Infinity;
    for (const move of availableMoves(boardState)) {
      boardState[move] = humanSymbol;
      best = Math.min(best, minimax(boardState, depth + 1, true));
      boardState[move] = null;
    }
    return best;
  }
}

// Calcule le meilleur coup pour un symbole donné (utilisé pour l'IA et pour le conseil)
function computeBestMove(forSymbol) {
  const isMaximizing = forSymbol === aiSymbol;
  let bestVal = isMaximizing ? -Infinity : Infinity;
  let bestMove = null;

  for (const move of availableMoves(board.slice())) {
    board[move] = forSymbol;
    const moveVal = minimax(board, 0, forSymbol !== aiSymbol);
    board[move] = null;

    if (isMaximizing) {
      if (moveVal > bestVal) {
        bestVal = moveVal;
        bestMove = move;
      }
    } else {
      if (moveVal < bestVal) {
        bestVal = moveVal;
        bestMove = move;
      }
    }
  }
  return bestMove;
}

function aiPlay() {
  if (gameOver) return;
  const move = computeBestMove(aiSymbol);
  if (move !== null && move !== undefined) {
    placeMove(move, aiSymbol);
    processTurn();
  }
}

function showSuggestion() {
  if (currentMode !== MODES.ASSIST || gameOver || isAiTurn()) return;
  // Retire les anciennes suggestions
  clearSuggestion();
  const best = computeBestMove(humanSymbol);
  if (best !== null && best !== undefined) {
    suggestedIndex = best;
    const cell = boardEl.querySelector(`[data-index="${best}"]`);
    if (cell) {
      cell.classList.add('suggested');
      resultLabel.textContent = 'Coup conseillé ici';
    }
  }
}

function clearSuggestion() {
  if (suggestedIndex !== null) {
    const old = boardEl.querySelector(`[data-index="${suggestedIndex}"]`);
    if (old) old.classList.remove('suggested');
  }
  suggestedIndex = null;
}

// --- Écouteurs ---
modeSelect.addEventListener('change', () => {
  // Le bouton d'aide n'est utile qu'en mode assisté
  resetGame();
});

playerSymbolSelect.addEventListener('change', resetGame);
starterSelect.addEventListener('change', resetGame);
resetButton.addEventListener('click', resetGame);
hintButton.addEventListener('click', showSuggestion);

// --- Lancement ---
createBoardUI();
resetGame();
