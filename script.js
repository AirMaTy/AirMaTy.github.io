// Hub d'activités : chaque module reste autonome mais partage le même thème.
(() => {
  const activities = document.querySelectorAll('.activity');
  const hubButtons = document.getElementById('hubButtons');
  hubButtons.addEventListener('click', (e) => {
    const target = e.target.closest('[data-target]');
    if (!target) return;
    const id = target.dataset.target;
    activities.forEach(sec => sec.classList.toggle('active', sec.id === id));
    window.scrollTo({ top: hubButtons.getBoundingClientRect().top + window.scrollY - 20, behavior: 'smooth' });
  });
  // Active la première section par défaut
  const first = activities[0];
  if (first) first.classList.add('active');

  // --------------------------- PUISSANCE 4 ---------------------------
  const ROWS = 6, COLS = 7, CONNECT = 4, EMPTY = 0, RED = 1, YELLOW = -1;
  const boardEl = document.getElementById('board');
  const modeSelect = document.getElementById('mode');
  const starterSelect = document.getElementById('starter');
  const modeStatus = document.getElementById('modeStatus');
  const turnStatus = document.getElementById('turnStatus');
  const messageEl = document.getElementById('message');
  const resetBtn = document.getElementById('reset');
  const adviceBtn = document.getElementById('advice');
  let cfBoard = createEmptyBoard();
  let currentPlayer = RED;
  let gameOver = false;
  let mode = 'ai';
  let suggestionCol = null;
  let suggestionRow = null;
  let aiPlayer = YELLOW;
  const MAX_DEPTH = 5;

  function createEmptyBoard() { return Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY)); }
  function buildGrid() {
    boardEl.innerHTML = '';
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
    starterSelect.addEventListener('change', resetGame);
    resetBtn.addEventListener('click', resetGame);
    adviceBtn.addEventListener('click', handleAdvice);
  }
  function handleModeChange() { mode = modeSelect.value; updateStarterOptions(); resetGame(); }
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
  }
  function resetGame() {
    cfBoard = createEmptyBoard();
    gameOver = false;
    suggestionCol = null;
    suggestionRow = null;
    clearSuggestion();
    clearWinnerHighlights();
    if (mode === 'pvp') {
      currentPlayer = starterSelect.value === 'human' ? RED : YELLOW;
    } else {
      aiPlayer = starterSelect.value === 'ai' ? RED : YELLOW;
      currentPlayer = RED;
    }
    updateModeStatus();
    renderBoard(false);
    updateTurnStatus();
    messageEl.textContent = '';
    if (mode === 'assist' && currentPlayer !== aiPlayer) provideSuggestionPreview();
    if (mode !== 'pvp' && currentPlayer === aiPlayer) aiMoveWithDelay();
  }
  function updateModeStatus() {
    const label = modeSelect.options[modeSelect.selectedIndex].textContent;
    modeStatus.textContent = `Mode : ${label}`;
  }
  function updateTurnStatus() {
    if (gameOver) return;
    let text = '';
    if (mode === 'pvp') text = currentPlayer === RED ? 'Au tour du joueur rouge' : 'Au tour du joueur jaune';
    else text = currentPlayer !== aiPlayer ? 'Au tour du joueur' : "Au tour de l'IA";
    turnStatus.textContent = text;
  }
  function handleBoardClick(e) {
    if (gameOver) return;
    const cell = e.target.closest('.cell');
    if (!cell) return;
    const col = Number(cell.dataset.col);
    if (mode !== 'pvp' && currentPlayer === aiPlayer) return;
    playMove(col);
  }
  function playMove(col) {
    if (suggestionCol !== null) clearSuggestion();
    const row = getAvailableRow(col);
    if (row === null) { flashMessage('Colonne pleine'); return; }
    placePiece(row, col, currentPlayer);
    renderPiece(row, col, currentPlayer);
    const outcome = evaluateOutcome(row, col, currentPlayer);
    if (outcome.finished) { endGame(outcome); return; }
    switchTurn();
    if (mode === 'assist' && currentPlayer !== aiPlayer && !gameOver) provideSuggestionPreview();
    if (mode !== 'pvp' && currentPlayer === aiPlayer && !gameOver) aiMoveWithDelay();
  }
  function getAvailableRow(col) {
    for (let r = ROWS - 1; r >= 0; r--) if (cfBoard[r][col] === EMPTY) return r;
    return null;
  }
  function placePiece(row, col, player) { cfBoard[row][col] = player; }
  function renderBoard(animate = true) {
    boardEl.querySelectorAll('.piece').forEach(p => p.remove());
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) if (cfBoard[r][c] !== EMPTY) renderPiece(r, c, cfBoard[r][c], animate);
    }
  }
  function renderPiece(row, col, player, animate = true) {
    const cell = boardEl.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (!cell) return;
    const piece = document.createElement('div');
    piece.className = `piece ${player === RED ? 'rouge' : 'jaune'}`;
    if (animate) piece.classList.add('drop');
    cell.appendChild(piece);
  }
  function evaluateOutcome(row, col, player) {
    const winLine = checkWin(row, col, player);
    if (winLine) { highlightWinners(winLine); return { finished: true, winner: player }; }
    if (isBoardFull()) return { finished: true, winner: null };
    return { finished: false };
  }
  function checkWin(row, col, player) {
    const dirs = [[0,1],[1,0],[1,1],[1,-1]];
    for (const [dr,dc] of dirs) {
      const line=[[row,col]];
      let r=row+dr,c=col+dc; while(isInside(r,c)&&cfBoard[r][c]===player){line.push([r,c]);r+=dr;c+=dc;}
      r=row-dr;c=col-dc; while(isInside(r,c)&&cfBoard[r][c]===player){line.unshift([r,c]);r-=dr;c-=dc;}
      if(line.length>=CONNECT) return line.slice(0,CONNECT);
    }
    return null;
  }
  const isInside=(r,c)=>r>=0&&r<ROWS&&c>=0&&c<COLS;
  const isBoardFull=()=>cfBoard[0].every(v=>v!==EMPTY);
  function switchTurn(){ currentPlayer=-currentPlayer; updateTurnStatus(); }
  function endGame({winner}){
    gameOver=true;
    if(winner===RED) turnStatus.textContent='Le joueur rouge a gagné';
    else if(winner===YELLOW) turnStatus.textContent= mode==='pvp'? 'Le joueur jaune a gagné' : "L'IA a gagné";
    else turnStatus.textContent='Match nul';
  }
  function flashMessage(text){ messageEl.textContent=text; setTimeout(()=>{ if(!gameOver) messageEl.textContent=''; },1200); }
  function highlightWinners(line){ clearWinnerHighlights(); line.forEach(([r,c])=>{ const cell=boardEl.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`); if(cell) cell.classList.add('winner'); }); }
  function clearWinnerHighlights(){ boardEl.querySelectorAll('.winner').forEach(el=>el.classList.remove('winner')); }
  function clearSuggestion(){ suggestionCol=null; suggestionRow=null; boardEl.querySelectorAll('.cell').forEach(cell=>cell.classList.remove('hint')); boardEl.querySelectorAll('.piece.preview').forEach(p=>p.remove()); }
  function highlightSuggestion(col,text){ clearSuggestion(); suggestionCol=col; boardEl.querySelectorAll(`.cell[data-col="${col}"]`).forEach(cell=>cell.classList.add('hint')); messageEl.textContent=text ?? `Coup conseillé : colonne ${col+1}`; }
  function provideSuggestionPreview(forceText){ if(mode!=='assist'||currentPlayer===aiPlayer||gameOver) return; const best=computeBestMove(cfBoard,currentPlayer,currentPlayer); if(best===null) return; const row=getAvailableRow(best); if(row===null) return; const msg=forceText?`Conseil actualisé : colonne ${best+1}`:`Coup conseillé pré-positionné : colonne ${best+1}`; highlightSuggestion(best,msg); suggestionRow=row; placePreviewPiece(row,best,currentPlayer); }
  function placePreviewPiece(row,col,player){ const cell=boardEl.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`); if(!cell) return; const preview=document.createElement('div'); preview.className=`piece preview ${player===RED?'rouge':'jaune'}`; cell.appendChild(preview); }
  function aiMoveWithDelay(){ setTimeout(()=>{ const best=computeBestMove(cfBoard,aiPlayer,aiPlayer); if(best!==null && !gameOver) playMove(best); },240); }
  function handleAdvice(){ if(mode!=='assist'||currentPlayer===aiPlayer||gameOver) return; provideSuggestionPreview(true); }

  function computeBestMove(state,player,perspective){
    const legal=getLegalMoves(state);
    let best=legal[0] ?? null;
    let bestScore=-Infinity;
    const ordered=[...legal].sort((a,b)=>Math.abs(b-3)-Math.abs(a-3));
    for(const move of ordered){
      const {nextBoard,row}=applyMove(state,move,player);
      const val=minimax(nextBoard,MAX_DEPTH-1,false,-Infinity,Infinity,-player,row,move,perspective);
      if(val>bestScore){ bestScore=val; best=move; }
    }
    return best;
  }
  function minimax(state,depth,maximizing,alpha,beta,player,lastRow,lastCol,perspective){
    const winner= lastRow!==undefined? checkLastMoveWinner(state,lastRow,lastCol,-player): null;
    if(winner===perspective) return 1000000+depth;
    if(winner===-perspective) return -1000000-depth;
    if(isBoardFullState(state)) return 0;
    if(depth===0) return heuristicScore(state,perspective);
    const moves=getLegalMoves(state).sort((a,b)=>Math.abs(a-3)-Math.abs(b-3));
    if(maximizing){
      let value=-Infinity;
      for(const move of moves){
        const {nextBoard,row}=applyMove(state,move,player);
        value=Math.max(value, minimax(nextBoard,depth-1,false,alpha,beta,-player,row,move,perspective));
        alpha=Math.max(alpha,value); if(alpha>=beta) break;
      }
      return value;
    } else {
      let value=Infinity;
      for(const move of moves){
        const {nextBoard,row}=applyMove(state,move,player);
        value=Math.min(value, minimax(nextBoard,depth-1,true,alpha,beta,-player,row,move,perspective));
        beta=Math.min(beta,value); if(alpha>=beta) break;
      }
      return value;
    }
  }
  const getLegalMoves=(state)=>{ const moves=[]; for(let c=0;c<COLS;c++) if(state[0][c]===EMPTY) moves.push(c); return moves; };
  const isBoardFullState=(state)=>state[0].every(v=>v!==EMPTY);
  function applyMove(state,col,player){ const next=state.map(r=>[...r]); for(let r=ROWS-1;r>=0;r--){ if(next[r][col]===EMPTY){ next[r][col]=player; return {nextBoard:next,row:r}; } } return {nextBoard:state,row:null}; }
  function checkLastMoveWinner(state,row,col,player){ const dirs=[[0,1],[1,0],[1,1],[1,-1]]; for(const[dr,dc] of dirs){ let count=1; count+=countDir(state,row,col,dr,dc,player); count+=countDir(state,row,col,-dr,-dc,player); if(count>=CONNECT) return player;} return null; }
  function countDir(state,row,col,dr,dc,player){ let r=row+dr,c=col+dc,count=0; while(r>=0&&r<ROWS&&c>=0&&c<COLS&&state[r][c]===player){count++; r+=dr; c+=dc;} return count; }
  function heuristicScore(state,player){ let score=0; const center=Math.floor(COLS/2); let centerCount=0; for(let r=0;r<ROWS;r++) if(state[r][center]===player) centerCount++; score+=centerCount*6; const windows=getAllWindows(state); for(const w of windows) score+=evaluateWindow(w,player); return score; }
  function getAllWindows(state){ const w=[]; for(let r=0;r<ROWS;r++) for(let c=0;c<=COLS-CONNECT;c++) w.push([state[r][c],state[r][c+1],state[r][c+2],state[r][c+3]]); for(let c=0;c<COLS;c++) for(let r=0;r<=ROWS-CONNECT;r++) w.push([state[r][c],state[r+1][c],state[r+2][c],state[r+3][c]]); for(let r=0;r<=ROWS-CONNECT;r++) for(let c=0;c<=COLS-CONNECT;c++) w.push([state[r][c],state[r+1][c+1],state[r+2][c+2],state[r+3][c+3]]); for(let r=CONNECT-1;r<ROWS;r++) for(let c=0;c<=COLS-CONNECT;c++) w.push([state[r][c],state[r-1][c+1],state[r-2][c+2],state[r-3][c+3]]); return w; }
  function evaluateWindow(window,player){ const opp=-player; const cp=window.filter(v=>v===player).length; const co=window.filter(v=>v===opp).length; const ce=window.filter(v=>v===EMPTY).length; if(cp===4) return 100000; if(cp===3&&ce===1) return 500; if(cp===2&&ce===2) return 60; if(cp===1&&ce===3) return 6; if(co===3&&ce===1) return -400; if(co===2&&ce===2) return -50; return 0; }

  buildGrid();
  bindEvents();
  resetGame();

  // --------------------------- SNAKE ---------------------------
  const snakeCanvas = document.getElementById('snakeCanvas');
  const sctx = snakeCanvas.getContext('2d');
  const snakeStatus = document.getElementById('snakeStatus');
  const snakeManualBtn = document.getElementById('snakeManual');
  const snakeAutoBtn = document.getElementById('snakeAuto');
  const snakeResetBtn = document.getElementById('snakeReset');
  const gridSize = 14;
  let snake = [];
  let food = { x: 5, y: 5 };
  let direction = { x: 1, y: 0 };
  let snakeTimer; let autoMode = true; let pendingDir = direction;

  function snakeInit(){
    snake=[{x:2,y:2},{x:1,y:2},{x:0,y:2}];
    direction={x:1,y:0}; pendingDir=direction; food=randFreeCell();
    clearInterval(snakeTimer);
    snakeTimer=setInterval(()=>snakeStep(),160);
    snakeStatus.textContent= autoMode? 'Mode IA continu' : 'Mode manuel';
    drawSnake();
  }
  function randFreeCell(){ let cell; do { cell={x:Math.floor(Math.random()*gridSize), y:Math.floor(Math.random()*gridSize)}; } while(snake.some(p=>p.x===cell.x&&p.y===cell.y)); return cell; }
  function drawSnake(){ sctx.clearRect(0,0,snakeCanvas.width,snakeCanvas.height); const size=snakeCanvas.width/gridSize; sctx.fillStyle='#111420'; sctx.fillRect(0,0,snakeCanvas.width,snakeCanvas.height); snake.forEach((seg,i)=>{ sctx.fillStyle=i===0? '#f25f5c':'#7ad7f0'; sctx.fillRect(seg.x*size+2, seg.y*size+2, size-4,size-4); }); sctx.fillStyle='#ffd166'; sctx.beginPath(); sctx.arc((food.x+0.5)*size,(food.y+0.5)*size,size*0.32,0,Math.PI*2); sctx.fill(); }
  function snakeStep(){ if(autoMode) pendingDir = snakeAI(); direction=pendingDir; const head={x:snake[0].x+direction.x, y:snake[0].y+direction.y}; if(head.x<0||head.x>=gridSize||head.y<0||head.y>=gridSize||snake.some(p=>p.x===head.x&&p.y===head.y)){ snakeStatus.textContent='Collision !'; clearInterval(snakeTimer); return; } snake.unshift(head); if(head.x===food.x&&head.y===food.y){ food=randFreeCell(); } else snake.pop(); drawSnake(); }
  function snakeAI(){ // BFS vers la nourriture, sinon mouvement sûr
    const dirs=[[1,0],[-1,0],[0,1],[0,-1]];
    const queue=[[snake[0],[]]]; const visited=new Set([`${snake[0].x},${snake[0].y}`]); const bodySet=new Set(snake.map(p=>`${p.x},${p.y}`));
    while(queue.length){ const [{x,y},path]=queue.shift(); if(x===food.x&&y===food.y&&path.length){ return path[0]; }
      for(const[dX,dY] of dirs){ const nx=x+dX, ny=y+dY; const key=`${nx},${ny}`; if(nx<0||ny<0||nx>=gridSize||ny>=gridSize) continue; if(bodySet.has(key) && !(nx===snake[snake.length-1].x && ny===snake[snake.length-1].y)) continue; if(!visited.has(key)){ visited.add(key); queue.push([{x:nx,y:ny}, [...path,{x:dX,y:dY}]]); }
      }
    }
    // fallback: choisir un déplacement sûr
    for(const[dX,dY] of dirs){ const nx=snake[0].x+dX, ny=snake[0].y+dY; if(nx>=0&&ny>=0&&nx<gridSize&&ny<gridSize&&!snake.some(p=>p.x===nx&&p.y===ny)) return {x:dX,y:dY}; }
    return direction;
  }
  document.addEventListener('keydown', e=>{
    if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
      autoMode=false; snakeStatus.textContent='Mode manuel';
      const map={ArrowUp:{x:0,y:-1}, ArrowDown:{x:0,y:1}, ArrowLeft:{x:-1,y:0}, ArrowRight:{x:1,y:0}};
      const nd=map[e.key]; if(nd.x!==-direction.x||nd.y!==-direction.y) pendingDir=nd;
    }
  });
  snakeManualBtn.addEventListener('click',()=>{autoMode=false; snakeStatus.textContent='Mode manuel';});
  snakeAutoBtn.addEventListener('click',()=>{autoMode=true; snakeStatus.textContent='Mode IA continu';});
  snakeResetBtn.addEventListener('click',snakeInit);
  snakeInit();

  // --------------------------- 2048 ---------------------------
  const gridEl = document.getElementById('grid2048');
  const scoreEl = document.getElementById('score');
  const solverToggle = document.getElementById('solverToggle');
  const gameResetBtn = document.getElementById('gameReset');
  let board2048 = Array.from({length:4},()=>Array(4).fill(0));
  let score=0; let solverInterval=null; let solverRunning=false;

  function setupGrid(){ gridEl.innerHTML=''; for(let i=0;i<16;i++){ const cell=document.createElement('div'); cell.className='tile2048'; const span=document.createElement('span'); cell.appendChild(span); gridEl.appendChild(cell);} }
  function reset2048(){ board2048=Array.from({length:4},()=>Array(4).fill(0)); score=0; addRandomTile(); addRandomTile(); render2048(); stopSolver(); }
  function addRandomTile(){ const empties=[]; for(let r=0;r<4;r++) for(let c=0;c<4;c++) if(board2048[r][c]===0) empties.push([r,c]); if(!empties.length) return; const [r,c]=empties[Math.floor(Math.random()*empties.length)]; board2048[r][c]=Math.random()<0.9?2:4; }
  function render2048(){ const tiles=[...gridEl.querySelectorAll('.tile2048 span')]; tiles.forEach((span,i)=>{ const r=Math.floor(i/4), c=i%4, val=board2048[r][c]; span.textContent=val||''; span.style.background=val?`linear-gradient(135deg, rgba(242,95,92,${0.25+Math.log2(val)/12}), rgba(122,215,240,${0.2+Math.log2(val)/14}))`:'transparent'; span.style.transform= val? 'scale(1)': 'scale(0.9)'; }); scoreEl.textContent=`Score : ${score}`; }
  function move(dir){ const rotated=rotateBoard(board2048,dir); let moved=false; for(let r=0;r<4;r++){ const row=rotated[r].filter(v=>v); for(let i=0;i<row.length-1;i++){ if(row[i]===row[i+1]){ row[i]*=2; score+=row[i]; row.splice(i+1,1);} }
      while(row.length<4) row.push(0); if(row.some((v,i)=>v!==rotated[r][i])) moved=true; rotated[r]=row; }
    board2048=rotateBoard(rotated,(4-dir)%4); if(moved){ addRandomTile(); render2048(); }
  }
  function rotateBoard(mat,times){ let res=mat.map(row=>[...row]); for(let t=0;t<times;t++){ const n=res.length; const m=Array.from({length:n},()=>Array(n).fill(0)); for(let r=0;r<n;r++) for(let c=0;c<n;c++) m[c][n-1-r]=res[r][c]; res=m; } return res; }
  function bestMove(){ const dirs=[0,1,2,3]; let best=null; let bestScore=-Infinity; for(const d of dirs){ const copy=board2048.map(r=>[...r]); const before=JSON.stringify(copy); const rotated=rotateBoard(copy,d); let gained=0; for(let r=0;r<4;r++){ const row=rotated[r].filter(v=>v); for(let i=0;i<row.length-1;i++){ if(row[i]===row[i+1]){ row[i]*=2; gained+=row[i]; row.splice(i+1,1);} }
        while(row.length<4) row.push(0); rotated[r]=row; }
      const restored=rotateBoard(rotated,(4-d)%4); if(JSON.stringify(restored)===before) continue; const h=heuristic2048(restored)+gained; if(h>bestScore){bestScore=h; best=d;}
    }
    return best;
  }
  function heuristic2048(mat){ const empty = mat.flat().filter(v=>v===0).length*100; const max=Math.max(...mat.flat()); const mono=mat.reduce((acc,row)=>acc+ row.reduce((s,v,i)=> s+(i? Math.abs(v-row[i-1]):0),0),0); return empty*2 + max*2 - mono;
  }
  function startSolver(){ if(solverRunning) return; solverRunning=true; solverToggle.textContent='Arrêter l\'IA'; solverInterval=setInterval(()=>{ const mv=bestMove(); if(mv===null){ stopSolver(); return; } move(mv); },230); }
  function stopSolver(){ solverRunning=false; solverToggle.textContent='Démarrer l\'IA'; clearInterval(solverInterval); }
  document.addEventListener('keydown',e=>{ const map={ArrowUp:0, ArrowRight:1, ArrowDown:2, ArrowLeft:3}; if(map[e.key]!==undefined && document.getElementById('game2048').classList.contains('active')){ move(map[e.key]); } });
  solverToggle.addEventListener('click',()=>{ solverRunning? stopSolver(): startSolver(); });
  gameResetBtn.addEventListener('click',reset2048);
  setupGrid(); reset2048();

  // --------------------------- TETRIS ---------------------------
  const tetCanvas=document.getElementById('tetrisCanvas');
  const tctx=tetCanvas.getContext('2d');
  const tetrisScoreEl=document.getElementById('tetrisScore');
  const tetrisHelpToggle=document.getElementById('tetrisHelp');
  const tetrisResetBtn=document.getElementById('tetrisReset');
  const tWidth=10, tHeight=20, cell=24;
  const shapes={
    I:[[1,1,1,1]],
    O:[[1,1],[1,1]],
    T:[[1,1,1],[0,1,0]],
    S:[[0,1,1],[1,1,0]],
    Z:[[1,1,0],[0,1,1]],
    J:[[1,0,0],[1,1,1]],
    L:[[0,0,1],[1,1,1]]
  };
  let tBoard, current, tScore=0, tInterval;
  function newPiece(){ const keys=Object.keys(shapes); const type=keys[Math.floor(Math.random()*keys.length)]; return {type, shape:shapes[type].map(r=>[...r]), x:3, y:0}; }
  function resetTetris(){ tBoard=Array.from({length:tHeight},()=>Array(tWidth).fill(0)); current=newPiece(); tScore=0; updateTetrisScore(); clearInterval(tInterval); tInterval=setInterval(()=>tick(),430); drawTetris(); }
  function collide(shape,x,y){ for(let r=0;r<shape.length;r++) for(let c=0;c<shape[0].length;c++) if(shape[r][c]){ const nx=x+c, ny=y+r; if(nx<0||nx>=tWidth||ny>=tHeight|| (ny>=0&&tBoard[ny][nx])) return true; } return false; }
  function merge(){ current.shape.forEach((row,r)=> row.forEach((v,c)=>{ if(v && current.y+r>=0) tBoard[current.y+r][current.x+c]=1; })); }
  function rotate(mat){ const n=mat.length,m=mat[0].length; const res=Array.from({length:m},()=>Array(n).fill(0)); for(let r=0;r<n;r++) for(let c=0;c<m;c++) res[c][n-1-r]=mat[r][c]; return res; }
  function clearLines(){ let lines=0; tBoard=tBoard.filter(row=>row.some(v=>!v)); lines=tHeight - tBoard.length; while(tBoard.length<tHeight) tBoard.unshift(Array(tWidth).fill(0)); if(lines) tScore+=lines*100; }
  function drawTetris(){ tctx.fillStyle='#0f1320'; tctx.fillRect(0,0,tetCanvas.width,tetCanvas.height); const renderCell=(x,y,color)=>{ tctx.fillStyle=color; tctx.fillRect(x*cell+2,y*cell+2,cell-4,cell-4); };
    for(let y=0;y<tHeight;y++) for(let x=0;x<tWidth;x++) if(tBoard[y][x]) renderCell(x,y,'#7ad7f0');
    current.shape.forEach((row,r)=> row.forEach((v,c)=>{ if(v){ renderCell(current.x+c,current.y+r,'#f25f5c'); }}));
    if(tetrisHelpToggle.checked){ const ghost=findBestPlacement(); if(ghost){ ghost.shape.forEach((row,r)=>row.forEach((v,c)=>{ if(v){ tctx.strokeStyle='rgba(255,209,102,0.8)'; tctx.strokeRect((ghost.x+c)*cell+3,(ghost.y+r)*cell+3,cell-6,cell-6); } })); }
    }
  }
  function findBestPlacement(){ let best=null, bestScore=-Infinity; const rotations=[current.shape]; for(let i=0;i<3;i++) rotations.push(rotate(rotations[rotations.length-1])); const unique=[]; rotations.forEach(shape=>{ if(!unique.some(s=>JSON.stringify(s)===JSON.stringify(shape))) unique.push(shape); });
    for(const shape of unique){ for(let x=-2;x<tWidth;x++){ let y=0; while(!collide(shape,x,y)) y++; y--; if(y<0) continue; const score=scorePlacement(shape,x,y); if(score>bestScore){bestScore=score; best={shape,x,y};} } }
    return best;
  }
  function scorePlacement(shape,x,y){ // heuristique classique
    let temp=tBoard.map(r=>[...r]); shape.forEach((row,r)=>row.forEach((v,c)=>{ if(v) temp[y+r][x+c]=1; }));
    let holes=0; for(let c=0;c<tWidth;c++){ let block=false; for(let r=0;r<tHeight;r++){ if(temp[r][c]) block=true; else if(block) holes++; }}
    let heightSum=0; for(let r=0;r<tHeight;r++) for(let c=0;c<tWidth;c++) if(temp[r][c]) heightSum+= (tHeight-r);
    return -holes*10 - heightSum*0.1;
  }
  function tick(){ if(!current) return; if(!collide(current.shape,current.x,current.y+1)) current.y++; else { merge(); clearLines(); current=newPiece(); if(collide(current.shape,current.x,current.y)) { clearInterval(tInterval); tScore-=50; } }
    updateTetrisScore(); drawTetris(); }
  function move(dx){ if(!collide(current.shape,current.x+dx,current.y)){ current.x+=dx; drawTetris(); }}
  function drop(){ while(!collide(current.shape,current.x,current.y+1)) current.y++; tick(); }
  function rotateCurrent(){ const rot=rotate(current.shape); if(!collide(rot,current.x,current.y)) current.shape=rot; drawTetris(); }
  document.addEventListener('keydown',e=>{ if(!document.getElementById('tetris').classList.contains('active')) return; if(e.key==='ArrowLeft') move(-1); if(e.key==='ArrowRight') move(1); if(e.key==='ArrowUp') rotateCurrent(); if(e.key==='ArrowDown') tick(); if(e.code==='Space'){ e.preventDefault(); drop(); }});
  function updateTetrisScore(){ tetrisScoreEl.textContent=`Score : ${tScore}`; }
  tetrisResetBtn.addEventListener('click',resetTetris); resetTetris();

  // --------------------------- CHESS ---------------------------
  const chessBoardEl=document.getElementById('chessBoard');
  const chessStatus=document.getElementById('chessStatus');
  const chessResetBtn=document.getElementById('chessReset');
  const pieces={r:'♜',n:'♞',b:'♝',q:'♛',k:'♚',p:'♟',R:'♖',N:'♘',B:'♗',Q:'♕',K:'♔',P:'♙'};
  let chessBoard, whiteTurn=true, selected=null;
  function initChess(){ chessBoard=[
      ['r','n','b','q','k','b','n','r'],
      ['p','p','p','p','p','p','p','p'],
      Array(8).fill(''),Array(8).fill(''),Array(8).fill(''),Array(8).fill(''),
      ['P','P','P','P','P','P','P','P'],
      ['R','N','B','Q','K','B','N','R']
    ]; whiteTurn=true; selected=null; renderChess(); updateChessStatus(); }
  function renderChess(){ chessBoardEl.innerHTML=''; for(let r=0;r<8;r++){ for(let c=0;c<8;c++){ const sq=document.createElement('div'); sq.className=`square ${(r+c)%2?'dark':'light'}`; sq.dataset.pos=`${r}-${c}`; sq.textContent=pieces[chessBoard[r][c]]||''; chessBoardEl.appendChild(sq);} }
  }
  function updateChessStatus(){ chessStatus.textContent= whiteTurn? 'Au tour des blancs' : 'Au tour des noirs'; }
  const isWhite=(p)=>p && p===p.toUpperCase();
  const isBlack=(p)=>p && p===p.toLowerCase();
  chessBoardEl.addEventListener('click', e=>{
    const sq=e.target.closest('.square'); if(!sq) return; const [r,c]=sq.dataset.pos.split('-').map(Number); const piece=chessBoard[r][c];
    if(selected){ const moves=legalMoves(...selected); if(moves.some(([mr,mc])=>mr===r&&mc===c)){ movePiece(selected,[r,c]); } selected=null; renderChess(); updateChessStatus(); return; }
    if(piece && ((whiteTurn && isWhite(piece)) || (!whiteTurn && isBlack(piece)))){ selected=[r,c]; highlightMoves(legalMoves(r,c)); }
  });
  function highlightMoves(moves){ renderChess(); moves.forEach(([r,c])=>{ const sq=chessBoardEl.querySelector(`[data-pos="${r}-${c}"]`); if(sq) sq.classList.add('move-option'); }); if(selected){ const sq=chessBoardEl.querySelector(`[data-pos="${selected[0]}-${selected[1]}"]`); if(sq) sq.classList.add('highlight'); }
  }
  function movePiece([r,c],[r2,c2]){ chessBoard[r2][c2]=chessBoard[r][c]; chessBoard[r][c]=''; whiteTurn=!whiteTurn; }
  function baseMoves(r,c){ const piece=chessBoard[r][c]; if(!piece) return []; const dirs=[]; const res=[]; const add=(rr,cc)=>{ if(rr<0||rr>=8||cc<0||cc>=8) return false; const target=chessBoard[rr][cc]; if(target && ((isWhite(piece)&&isWhite(target))||(isBlack(piece)&&isBlack(target)))) return false; res.push([rr,cc]); return !target; };
    const side=isWhite(piece)?1:-1;
    switch(piece.toLowerCase()){
      case 'p': {
        const start=isWhite(piece)?6:1; if(!chessBoard[r-side]?.[c]){ add(r-side,c); if(r===start && !chessBoard[r-2*side]?.[c]) add(r-2*side,c); }
        [[r-side,c-1],[r-side,c+1]].forEach(([rr,cc])=>{ if(rr>=0&&rr<8&&cc>=0&&cc<8){ const target=chessBoard[rr][cc]; if(target && ((isWhite(piece)&&isBlack(target))||(isBlack(piece)&&isWhite(target)))) res.push([rr,cc]); }});
        break; }
      case 'r': dirs.push([1,0],[-1,0],[0,1],[0,-1]); break;
      case 'b': dirs.push([1,1],[1,-1],[-1,1],[-1,-1]); break;
      case 'q': dirs.push([1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]); break;
      case 'k': [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([dr,dc])=>add(r+dr,c+dc)); break;
      case 'n': [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]].forEach(([dr,dc])=>add(r+dr,c+dc)); break;
    }
    if(['r','b','q'].includes(piece.toLowerCase())){ for(const [dr,dc] of dirs){ let rr=r+dr, cc=c+dc; while(add(rr,cc)) { rr+=dr; cc+=dc; } }
    }
    return res;
  }
  function legalMoves(r,c){ const moves=baseMoves(r,c); return moves.filter(([rr,cc])=>!wouldExposeKing(r,c,rr,cc)); }
  function findKing(white){ for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(chessBoard[r][c]===(white?'K':'k')) return [r,c]; return null; }
  function wouldExposeKing(r,c,rr,cc){ const piece=chessBoard[r][c]; const backup=chessBoard[rr][cc]; chessBoard[rr][cc]=piece; chessBoard[r][c]=''; const kingPos=findKing(isWhite(piece)); const danger=isInCheck(kingPos[0],kingPos[1], isWhite(piece)); chessBoard[r][c]=piece; chessBoard[rr][cc]=backup; return danger; }
  function isInCheck(kr,kc,white){ for(let r=0;r<8;r++) for(let c=0;c<8;c++){ const p=chessBoard[r][c]; if(!p || (white?isWhite(p):isBlack(p))) continue; const moves=baseMoves(r,c); if(moves.some(([mr,mc])=>mr===kr && mc===kc)) return true; } return false; }
  chessResetBtn.addEventListener('click',initChess); initChess();

  // --------------------------- AVATAR ---------------------------
  const avatarCanvas=document.getElementById('avatarCanvas');
  const actx=avatarCanvas.getContext('2d');
  const avatarGenerate=document.getElementById('avatarGenerate');
  const avatarDownload=document.getElementById('avatarDownload');
  function generateAvatar(){ const colors=['#f25f5c','#7ad7f0','#ffd166','#9aa2b1']; actx.fillStyle='#0f1320'; actx.fillRect(0,0,avatarCanvas.width,avatarCanvas.height); for(let i=0;i<6;i++){ const size=Math.random()*120+30; const x=Math.random()*avatarCanvas.width; const y=Math.random()*avatarCanvas.height; actx.fillStyle=colors[Math.floor(Math.random()*colors.length)] + '88'; actx.beginPath(); actx.arc(x,y,size,0,Math.PI*2); actx.fill(); }
    // visage abstrait
    actx.fillStyle='rgba(255,255,255,0.1)'; actx.fillRect(40,40,160,160);
    actx.fillStyle=colors[Math.floor(Math.random()*colors.length)]; actx.beginPath(); actx.arc(90,110,18,0,Math.PI*2); actx.arc(150,110,18,0,Math.PI*2); actx.fill();
    actx.strokeStyle='#e8ecf1'; actx.lineWidth=4; actx.beginPath(); actx.arc(120,150,36,0,Math.PI); actx.stroke();
  }
  avatarGenerate.addEventListener('click',generateAvatar);
  avatarDownload.addEventListener('click',()=>{ const link=document.createElement('a'); link.download='avatar.png'; link.href=avatarCanvas.toDataURL('image/png'); link.click(); });
  generateAvatar();

  // --------------------------- SORTING ---------------------------
  const sortCanvas=document.getElementById('sortCanvas');
  const sortCtx=sortCanvas.getContext('2d');
  const sortAlgo=document.getElementById('sortAlgo');
  const sortShuffle=document.getElementById('sortShuffle');
  const sortStart=document.getElementById('sortStart');
  const sortSpeed=document.getElementById('sortSpeed');
  let arr=[], steps=[], stepIndex=0, sorting=false, sortTimer;
  function initArray(){ arr=Array.from({length:60},()=>Math.random()); steps=[]; stepIndex=0; drawArray(); }
  function drawArray(highlight=[]){ sortCtx.fillStyle='#0f1320'; sortCtx.fillRect(0,0,sortCanvas.width,sortCanvas.height); const w=sortCanvas.width/arr.length; arr.forEach((v,i)=>{ sortCtx.fillStyle= highlight.includes(i)? '#f25f5c' : '#7ad7f0'; sortCtx.fillRect(i*w+1, sortCanvas.height - v*sortCanvas.height, w-2, v*sortCanvas.height); }); }
  function recordSteps(algo){ steps=[]; const a=[...arr]; const swap=(i,j)=>{ [a[i],a[j]]=[a[j],a[i]]; steps.push({a:[...a], h:[i,j]}); };
    if(algo==='bubble'){ for(let i=0;i<a.length;i++) for(let j=0;j<a.length-i-1;j++){ if(a[j]>a[j+1]) swap(j,j+1); else steps.push({a:[...a],h:[j,j+1]}); } }
    else if(algo==='insertion'){ for(let i=1;i<a.length;i++){ let j=i; while(j>0&&a[j]<a[j-1]){ swap(j,j-1); j--; } steps.push({a:[...a],h:[j]}); } }
    else if(algo==='merge'){ const mergeSort=(l,r)=>{ if(r-l<=1) return; const m=Math.floor((l+r)/2); mergeSort(l,m); mergeSort(m,r); const left=a.slice(l,m), right=a.slice(m,r); let i=0,j=0; for(let k=l;k<r;k++){ if(j>=right.length || (i<left.length && left[i]<=right[j])) a[k]=left[i++]; else a[k]=right[j++]; steps.push({a:[...a],h:[k]}); } }; mergeSort(0,a.length); }
    else if(algo==='quick'){ const qs=(l,r)=>{ if(l>=r) return; let i=l, j=r, pivot=a[Math.floor((l+r)/2)]; while(i<=j){ while(a[i]<pivot) i++; while(a[j]>pivot) j--; if(i<=j){ swap(i,j); i++; j--; } steps.push({a:[...a],h:[i,j]}); } if(l<j) qs(l,j); if(i<r) qs(i,r); }; qs(0,a.length-1); }
    steps.unshift({a:[...arr],h:[]}); arr=[...a];
  }
  function playSteps(){ sorting=!sorting; if(!sorting){ clearInterval(sortTimer); return; } const speed=+sortSpeed.value; sortTimer=setInterval(()=>{ if(stepIndex>=steps.length) { clearInterval(sortTimer); sorting=false; return; } const step=steps[stepIndex++]; drawArray(step.h); arr=[...step.a]; }, speed);
  }
  sortShuffle.addEventListener('click',()=>{ sorting=false; clearInterval(sortTimer); initArray(); });
  sortStart.addEventListener('click',()=>{ recordSteps(sortAlgo.value); stepIndex=0; playSteps(); });
  sortSpeed.addEventListener('input',()=>{ if(sorting){ clearInterval(sortTimer); playSteps(); }});
  initArray();

  // --------------------------- TURING MACHINE ---------------------------
  const turingTapeEl=document.getElementById('turingTape');
  const turingStatus=document.getElementById('turingStatus');
  const turingStepBtn=document.getElementById('turingStep');
  const turingRunBtn=document.getElementById('turingRun');
  const turingResetBtn=document.getElementById('turingReset');
  let tape=[], head=5, state='q0', turingInterval;
  const rules={ // incrément binaire sur 6 bits
    q0:{ '1':['1','L','q0'], '0':['0','L','q0'], '_':['_', 'R','q1'] },
    q1:{ '1':['0','L','q1'], '0':['1','H','halt'], '_':['1','H','halt'] }
  };
  function initTape(){ tape=Array(12).fill('0'); head=tape.length-1; tape[head]='1'; state='q0'; renderTape(); updateTuringStatus(); }
  function renderTape(){ turingTapeEl.innerHTML=''; tape.forEach((val,i)=>{ const cell=document.createElement('div'); cell.className='turing-cell'; if(i===head) cell.classList.add('active'); cell.textContent=val; turingTapeEl.appendChild(cell); }); }
  function stepTuring(){ const symbol=tape[head] ?? '_'; const trans=rules[state]?.[symbol]; if(!trans) { state='halt'; updateTuringStatus(); return; } const [write, move, next]=trans; tape[head]=write; if(move==='R') head=Math.min(tape.length-1, head+1); else if(move==='L') head=Math.max(0, head-1); state=next; renderTape(); updateTuringStatus(); if(state==='halt') stopTuring(); }
  function updateTuringStatus(){ turingStatus.textContent=`État : ${state}`; }
  function runTuring(){ stopTuring(); turingInterval=setInterval(stepTuring,400); }
  function stopTuring(){ clearInterval(turingInterval); }
  turingStepBtn.addEventListener('click',stepTuring);
  turingRunBtn.addEventListener('click',()=>{ if(state==='halt'){ initTape(); } runTuring(); });
  turingResetBtn.addEventListener('click',initTape);
  initTape();

  // --------------------------- MAZE SOLVER ---------------------------
  const mazeCanvas=document.getElementById('mazeCanvas');
  const mctx=mazeCanvas.getContext('2d');
  const mazeAlgo=document.getElementById('mazeAlgo');
  const mazeGenerate=document.getElementById('mazeGenerate');
  const mazeStart=document.getElementById('mazeStart');
  const mazeReset=document.getElementById('mazeReset');
  const mSize=21; let mazeGrid=[], mStart={x:1,y:1}, mGoal={x:mSize-2,y:mSize-2}, frontier=[], visitedSet, mazeTimer, running=false;
  function generateMaze(){ mazeGrid=Array.from({length:mSize},()=>Array(mSize).fill(1)); const carve=(x,y)=>{ mazeGrid[y][x]=0; const dirs=[[2,0],[-2,0],[0,2],[0,-2]].sort(()=>Math.random()-0.5); for(const[dX,dY] of dirs){ const nx=x+dX, ny=y+dY; if(nx>0&&ny>0&&nx<mSize-1&&ny<mSize-1 && mazeGrid[ny][nx]===1){ mazeGrid[ny][nx]=0; mazeGrid[y+dY/2][x+dX/2]=0; carve(nx,ny); } } }; carve(1,1); drawMaze(); visitedSet=new Set(); frontier=[mStart]; }
  function drawMaze(path=[]){ const cs=mazeCanvas.width/mSize; mctx.fillStyle='#0f1320'; mctx.fillRect(0,0,mazeCanvas.width,mazeCanvas.height); for(let y=0;y<mSize;y++) for(let x=0;x<mSize;x++){ if(mazeGrid[y][x]){ mctx.fillStyle='#111'; mctx.fillRect(x*cs,y*cs,cs,cs); }} mctx.fillStyle='#7ad7f0'; mctx.fillRect(mGoal.x*cs,mGoal.y*cs,cs,cs); mctx.fillStyle='#f25f5c'; mctx.fillRect(mStart.x*cs,mStart.y*cs,cs,cs); path.forEach(p=>{ mctx.fillStyle='rgba(255,209,102,0.7)'; mctx.fillRect(p.x*cs+2,p.y*cs+2,cs-4,cs-4); }); }
  function neighbors(x,y){ return [[1,0],[-1,0],[0,1],[0,-1]].map(([dx,dy])=>({x:x+dx,y:y+dy})).filter(p=>p.x>=0&&p.y>=0&&p.x<mSize&&p.y<mSize&&!mazeGrid[p.y][p.x]); }
  function stepMaze(){ if(!frontier.length){ stopMaze(); return; } const algo=mazeAlgo.value; let node; if(algo==='dfs') node=frontier.pop(); else node=frontier.shift(); if(visitedSet.has(`${node.x},${node.y}`)) return; visitedSet.add(`${node.x},${node.y}`); if(node.x===mGoal.x&&node.y===mGoal.y){ drawMaze(reconstructPath(node)); stopMaze(); return; }
    neighbors(node.x,node.y).forEach(nb=>{ if(!visitedSet.has(`${nb.x},${nb.y}`)){ nb.prev=node; if(algo==='astar'){ nb.f=manhattan(nb,mGoal); insertPriority(nb); } else frontier.push(nb); } });
    drawMaze(); visitedSet.forEach(key=>{ const [x,y]=key.split(',').map(Number); mctx.fillStyle='rgba(122,215,240,0.2)'; const cs=mazeCanvas.width/mSize; mctx.fillRect(x*cs+3,y*cs+3,cs-6,cs-6); });
  }
  function insertPriority(node){ let i=0; while(i<frontier.length && (frontier[i].f??0) < node.f) i++; frontier.splice(i,0,node); }
  const manhattan=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
  function reconstructPath(node){ const path=[]; let n=node; while(n){ path.push({x:n.x,y:n.y}); n=n.prev; } return path; }
  function runMaze(){ stopMaze(); running=true; mazeTimer=setInterval(stepMaze,120); }
  function stopMaze(){ running=false; clearInterval(mazeTimer); }
  mazeGenerate.addEventListener('click',generateMaze);
  mazeStart.addEventListener('click',()=>{ running? stopMaze(): runMaze(); });
  mazeReset.addEventListener('click',()=>{ stopMaze(); generateMaze(); });
  generateMaze();

  // --------------------------- SPHERE 3D ---------------------------
  const sphereContainer=document.getElementById('sphereContainer');
  const wireframeToggle=document.getElementById('wireframeToggle');
  const renderer=new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setSize(sphereContainer.clientWidth, sphereContainer.clientHeight);
  sphereContainer.appendChild(renderer.domElement);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(45, sphereContainer.clientWidth/sphereContainer.clientHeight, 0.1, 1000); camera.position.z=3;
  const light=new THREE.PointLight(0xffffff,1); light.position.set(5,5,5); scene.add(light);
  const geometry=new THREE.SphereGeometry(1,48,32);
  const material=new THREE.MeshStandardMaterial({ color:0x7ad7f0, emissive:0x112233, metalness:0.3, roughness:0.2 });
  const sphere=new THREE.Mesh(geometry,material); scene.add(sphere);
  const controls={ rotating:false, lastX:0, lastY:0 };
  sphereContainer.addEventListener('mousedown',e=>{ controls.rotating=true; controls.lastX=e.clientX; controls.lastY=e.clientY; });
  window.addEventListener('mouseup',()=>controls.rotating=false);
  window.addEventListener('mousemove',e=>{ if(!controls.rotating) return; const dx=e.clientX-controls.lastX; const dy=e.clientY-controls.lastY; controls.lastX=e.clientX; controls.lastY=e.clientY; sphere.rotation.y+=dx*0.01; sphere.rotation.x+=dy*0.01; });
  sphereContainer.addEventListener('wheel',e=>{ camera.position.z+=e.deltaY*0.002; camera.position.z=Math.min(6,Math.max(2,camera.position.z)); });
  wireframeToggle.addEventListener('change',()=>{ material.wireframe=wireframeToggle.checked; });
  function animate(){ requestAnimationFrame(animate); sphere.rotation.y+=0.003; renderer.render(scene,camera); }
  animate();
})();
