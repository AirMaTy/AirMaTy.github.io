(() => {
  // ---------- Navigation / vues ----------
  const activities = Array.from(document.querySelectorAll('.activity'));
  const hero = document.querySelector('.hero');
  const navItems = Array.from(document.querySelectorAll('[data-target]'));
  const sidebar = document.querySelector('.nav-list');
  const toggle = document.querySelector('.nav-toggle');
  const refreshers = {};

  function showActivity(id) {
    activities.forEach(sec => sec.classList.toggle('active', sec.id === id));
    navItems.forEach(btn => btn.classList.toggle('active', btn.dataset.target === id));
    if (hero) hero.classList.toggle('hidden', id !== 'hub');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    refreshers[id]?.();
    if (sidebar && sidebar.classList.contains('open')) sidebar.classList.remove('open');
  }

  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-target]');
    if (!target) return;
    e.preventDefault();
    showActivity(target.dataset.target);
  });

  if (toggle) toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  showActivity('hub');

  // Utility
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  // ---------- Puissance 4 ----------
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
  function getAvailableRow(col) { for (let r = ROWS - 1; r >= 0; r--) if (cfBoard[r][col] === EMPTY) return r; return null; }
  function placePiece(row, col, player) { cfBoard[row][col] = player; }
  function renderBoard(animate = true) {
    boardEl.querySelectorAll('.piece').forEach(p => p.remove());
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) if (cfBoard[r][c] !== EMPTY) renderPiece(r, c, cfBoard[r][c], animate);
    }
    return null;
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
    if (cfBoard[0].every(v => v !== EMPTY)) return { finished: true, winner: null };
    return { finished: false };
  }
  function checkWin(row, col, player) {
    const dirs = [[0,1],[1,0],[1,1],[1,-1]];
    for (const [dr,dc] of dirs) {
      const line=[[row,col]];
      let r=row+dr,c=col+dc; while(r>=0&&r<ROWS&&c>=0&&c<COLS&&cfBoard[r][c]===player){line.push([r,c]);r+=dr;c+=dc;}
      r=row-dr;c=col-dc; while(r>=0&&r<ROWS&&c>=0&&c<COLS&&cfBoard[r][c]===player){line.unshift([r,c]);r-=dr;c-=dc;}
      if(line.length>=CONNECT) return line.slice(0,CONNECT);
    }
    return null;
  }
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
  function aiMoveWithDelay(){ setTimeout(()=>{ const best=computeBestMove(cfBoard,aiPlayer,aiPlayer); if(best!==null && !gameOver) playMove(best); },220); }
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
      let best=-Infinity;
      for(const m of moves){ const {nextBoard,row}=applyMove(state,m,player); const val=minimax(nextBoard,depth-1,false,alpha,beta,-player,row,m,perspective); best=Math.max(best,val); alpha=Math.max(alpha,val); if(beta<=alpha) break; }
      return best;
    } else {
      let best=Infinity;
      for(const m of moves){ const {nextBoard,row}=applyMove(state,m,player); const val=minimax(nextBoard,depth-1,true,alpha,beta,-player,row,m,perspective); best=Math.min(best,val); beta=Math.min(beta,val); if(beta<=alpha) break; }
      return best;
    }
    // fallback: choisir un déplacement sûr
    for(const[dX,dY] of dirs){ const nx=snake[0].x+dX, ny=snake[0].y+dY; if(nx>=0&&ny>=0&&nx<gridSize&&ny<gridSize&&!snake.some(p=>p.x===nx&&p.y===ny)) return {x:dX,y:dY}; }
    return direction;
  }
  function getLegalMoves(state){ return Array.from({length:COLS},(_,c)=>c).filter(c=>state[0][c]===EMPTY); }
  function applyMove(state,col,player){ const newBoard=state.map(r=>[...r]); let row=null; for(let r=ROWS-1;r>=0;r--){ if(newBoard[r][col]===EMPTY){ newBoard[r][col]=player; row=r; break; } } return {nextBoard:newBoard,row}; }
  function checkLastMoveWinner(board,row,col,player){
    const dirs=[[0,1],[1,0],[1,1],[1,-1]];
    for(const [dr,dc] of dirs){
      let count=1; let r=row+dr,c=col+dc; while(r>=0&&r<ROWS&&c>=0&&c<COLS&&board[r][c]===player){count++;r+=dr;c+=dc;}
      r=row-dr;c=col-dc; while(r>=0&&r<ROWS&&c>=0&&c<COLS&&board[r][c]===player){count++;r-=dr;c-=dc;}
      if(count>=CONNECT) return player;
    }
    return null;
  }
  const isBoardFullState=(state)=>state[0].every(v=>v!==EMPTY);
  function heuristicScore(board,perspective){
    let score=0;
    const lines=[];
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) lines.push(getWindow(r,c,0,1),getWindow(r,c,1,0),getWindow(r,c,1,1),getWindow(r,c,1,-1));
    for(const window of lines){
      if(!window||window.length<CONNECT) continue;
      const val=window.reduce((s,[r,c])=>s+board[r][c],0);
      const empties=window.filter(([r,c])=>board[r][c]===EMPTY).length;
      if(Math.abs(val)===CONNECT) score+= (val>0?1000:-1000)*(val===CONNECT?1:-1);
      else score+= (val*10) - empties*2;
    }
    return perspective===RED?score:-score;
  }
  function getWindow(r,c,dr,dc){ const coords=[]; for(let i=0;i<CONNECT;i++){ const nr=r+dr*i,nc=c+dc*i; if(nr<0||nr>=ROWS||nc<0||nc>=COLS) return null; coords.push([nr,nc]); } return coords; }

  refreshers.connect4 = () => { if(!boardEl.childElementCount) buildGrid(); updateStarterOptions(); resetGame(); };
  buildGrid(); bindEvents();

  // ---------- Snake ----------
  const snakeCanvas=document.getElementById('snakeCanvas');
  const sCtx=snakeCanvas.getContext('2d');
  const gridSize=21;
  let snake=[{x:10,y:10}];
  let dir={x:1,y:0};
  let food={x:15,y:10};
  let snakeInterval=null;
  let snakeMode='manual';
  const speed=120;
  const manualBtn=document.getElementById('snakeManual');
  const autoBtn=document.getElementById('snakeAuto');
  const resetSnake=document.getElementById('snakeReset');

  function drawCell(x,y,color){ const size=snakeCanvas.width/gridSize; sCtx.fillStyle=color; sCtx.fillRect(x*size,y*size,size-1,size-1); }
  function spawnFood(){ food={x:rand(0,gridSize-1), y:rand(0,gridSize-1)}; }
  function resetSnakeGame(){ snake=[{x:10,y:10}]; dir={x:1,y:0}; spawnFood(); clearInterval(snakeInterval); snakeInterval=setInterval(stepSnake,speed); }
  function setDir(nx,ny){ if(-nx===dir.x && -ny===dir.y) return; dir={x:nx,y:ny}; }

  document.addEventListener('keydown',(e)=>{
    const key=e.key.toLowerCase();
    if(key==='z' || e.key==='ArrowUp') setDir(0,-1);
    if(key==='s' || e.key==='ArrowDown') setDir(0,1);
    if(key==='q' || e.key==='ArrowLeft') setDir(-1,0);
    if(key==='d' || e.key==='ArrowRight') setDir(1,0);
  });
  manualBtn.addEventListener('click',()=>{ snakeMode='manual'; manualBtn.classList.add('ghost'); autoBtn.classList.remove('ghost'); });
  autoBtn.addEventListener('click',()=>{ snakeMode='auto'; autoBtn.classList.add('ghost'); manualBtn.classList.remove('ghost'); });
  resetSnake.addEventListener('click',resetSnakeGame);

  function aiDirection(){
    // simple greedy avoiding collisions
    const head=snake[0];
    const options=[{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}];
    const valid=options.filter(o=>!willCollide(head,o));
    valid.sort((a,b)=>distSq(head,a,food)-distSq(head,b,food));
    return valid[0]||dir;
  }
  function distSq(head,o,target){ const nx=head.x+o.x, ny=head.y+o.y; return (nx-target.x)**2+(ny-target.y)**2; }
  function willCollide(head,o){ const nx=head.x+o.x, ny=head.y+o.y; if(nx<0||ny<0||nx>=gridSize||ny>=gridSize) return true; return snake.some((s,i)=>i===snake.length-1?false:(s.x===nx&&s.y===ny)); }

  function stepSnake(){
    if(snakeMode==='auto') dir=aiDirection();
    const head={...snake[0]};
    head.x+=dir.x; head.y+=dir.y;
    if(head.x<0||head.y<0||head.x>=gridSize||head.y>=gridSize|| snake.some(s=>s.x===head.x&&s.y===head.y)) {
      resetSnakeGame();
      return;
    }
    snake.unshift(head);
    if(head.x===food.x && head.y===food.y) spawnFood(); else snake.pop();
    drawSnake();
  }
  function drawSnake(){
    sCtx.fillStyle='#0c0e15'; sCtx.fillRect(0,0,snakeCanvas.width,snakeCanvas.height);
    drawCell(food.x,food.y,'#6bffb2');
    snake.forEach((p,i)=>drawCell(p.x,p.y,i===0?'#ff6b6b':'#ff9f9f'));
  }
  refreshers.snake=()=>{ resetSnakeGame(); drawSnake(); };

  // ---------- 2048 ----------
  const gridEl=document.getElementById('grid2048');
  const status2048=document.getElementById('status2048');
  let grid2048; let aiTimer=null; const size=4;

  function init2048(){ grid2048=createGrid(); addTile(); addTile(); render2048(); status2048.textContent=''; }
  function createGrid(){ return Array.from({length:size},()=>Array(size).fill(0)); }
  function addTile(){ const empties=[]; grid2048.forEach((row,r)=>row.forEach((v,c)=>{ if(!v) empties.push([r,c]); })); if(!empties.length) return; const [r,c]=empties[rand(0,empties.length-1)]; grid2048[r][c]=Math.random()<0.9?2:4; }
  function render2048(){ gridEl.innerHTML=''; grid2048.forEach(row=>row.forEach(val=>{ const tile=document.createElement('div'); tile.className='tile'; tile.style.background=val?`linear-gradient(135deg, rgba(106,227,255,0.25), rgba(138,125,255,0.18))`:'#0c0e15'; tile.style.color= val>=128?'#fff':'#0f1117'; tile.innerHTML= val?`<span>${val}</span>`:''; tile.style.boxShadow= val? 'inset 0 0 0 1px rgba(255,255,255,0.06)': 'inset 0 0 0 1px var(--border)'; gridEl.appendChild(tile); })); }
  function compressRow(row){ const filtered=row.filter(v=>v); const res=[]; while(filtered.length){ if(filtered.length>1 && filtered[0]===filtered[1]){ res.push(filtered[0]*2); filtered.splice(0,2); } else { res.push(filtered.shift()); } } while(res.length<size) res.push(0); return res; }
  function transform(dir, matrix){
    const rotate=m=>m[0].map((_,i)=>m.map(row=>row[i]));
    const flip=m=>m.map(r=>[...r].reverse());
    let work=matrix.map(r=>[...r]);
    if(dir==='up'){ work=rotate(work); work=work.map(compressRow); work=rotate(work); }
    if(dir==='down'){ work=rotate(work); work=flip(work); work=work.map(compressRow); work=flip(work); work=rotate(work); }
    if(dir==='left'){ work=work.map(compressRow); }
    if(dir==='right'){ work=work.map(r=>compressRow([...r].reverse()).reverse()); }
    return work;
  }
  function move(dir){
    const work=transform(dir, grid2048);
    const moved = !gridsEqual(work, grid2048);
    if(moved){ grid2048=work; addTile(); render2048(); check2048(); }
  }
  function hasMoves(){
    for(let r=0;r<size;r++) for(let c=0;c<size;c++) if(grid2048[r][c]===0) return true;
    const dirs=[[1,0],[-1,0],[0,1],[0,-1]];
    for(let r=0;r<size;r++) for(let c=0;c<size;c++) for(const [dr,dc] of dirs){ const nr=r+dr,nc=c+dc; if(nr>=0&&nr<size&&nc>=0&&nc<size&&grid2048[r][c]===grid2048[nr][nc]) return true; }
    return false;
  }
  function check2048(){
    const flat=grid2048.flat();
    if(flat.includes(2048)) status2048.textContent='Victoire !';
    else if(!hasMoves()) status2048.textContent='Perdu.';
  }
  document.addEventListener('keydown',(e)=>{
    const key=e.key;
    if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','z','q','s','d','Z','Q','S','D'].includes(key)){
      if(key==='ArrowUp'||key==='z'||key==='Z') move('up');
      if(key==='ArrowDown'||key==='s'||key==='S') move('down');
      if(key==='ArrowLeft'||key==='q'||key==='Q') move('left');
      if(key==='ArrowRight'||key==='d'||key==='D') move('right');
    }
  });
  document.getElementById('reset2048').addEventListener('click',()=>{ clearInterval(aiTimer); aiTimer=null; init2048(); });
  document.getElementById('ai2048').addEventListener('click',()=>{ if(aiTimer) return; aiTimer=setInterval(aiStep,220); });
  document.getElementById('stopAI2048').addEventListener('click',()=>{ clearInterval(aiTimer); aiTimer=null; });
  function aiStep(){
    const dirs=['up','left','right','down'];
    for(const d of dirs){ const trial=transform(d, grid2048); if(!gridsEqual(trial, grid2048)){ grid2048=trial; addTile(); render2048(); check2048(); return; } }
    move(dirs[rand(0,3)]);
  }
  const gridsEqual=(a,b)=>a.every((row,r)=>row.every((v,c)=>v===b[r][c]));
  refreshers.game2048=()=>{ init2048(); };

  // ---------- Tetris ----------
  const tCanvas=document.getElementById('tetrisCanvas');
  const tCtx=tCanvas.getContext('2d');
  const tCols=10, tRows=20, tSize=32;
  const shapes={
    I:[[1,1,1,1]],
    O:[[1,1],[1,1]],
    T:[[0,1,0],[1,1,1]],
    L:[[1,0],[1,0],[1,1]],
    J:[[0,1],[0,1],[1,1]],
    S:[[0,1,1],[1,1,0]],
    Z:[[1,1,0],[0,1,1]]
  };
  const colors=['#6ae3ff','#ffd166','#8a7dff','#6bffb2','#ff6b6b','#9b8cff','#7fffd4'];
  let tBoard=createMatrix(tRows,tCols,0); let currentPiece=null; let dropCounter=0; let dropInterval=500; let lastTime=0; let tetrisId=null; let helpOn=true;
  function createMatrix(r,c,val){ return Array.from({length:r},()=>Array(c).fill(val)); }
  function createPiece(){ const keys=Object.keys(shapes); const shape=shapes[keys[rand(0,keys.length-1)]]; return {matrix:shape.map(row=>[...row]), pos:{x:3,y:0}, color:colors[rand(0,colors.length-1)]}; }
  function collide(board,piece){ for(let y=0;y<piece.matrix.length;y++) for(let x=0;x<piece.matrix[y].length;x++){ if(piece.matrix[y][x]){ const ny=y+piece.pos.y, nx=x+piece.pos.x; if(nx<0||nx>=tCols||ny>=tRows|| (ny>=0 && board[ny][nx])) return true; } } return false; }
  function merge(board,piece){ piece.matrix.forEach((row,y)=>row.forEach((v,x)=>{ if(v){ board[y+piece.pos.y][x+piece.pos.x]=piece.color; } })); }
  function rotate(matrix,dir){ const m=matrix.map((r,i)=>r.map((_,j)=>matrix[matrix.length-1-j][i])); return dir>0?m:m.map(r=>r.reverse()).reverse(); }
  function sweep(){ let lines=0; for(let y=tRows-1;y>=0;y--){ if(tBoard[y].every(v=>v)){ tBoard.splice(y,1); tBoard.unshift(Array(tCols).fill(0)); lines++; y++; } } dropInterval=Math.max(120, 500 - lines*20); }
  function drawTetris(){ tCtx.fillStyle='#0c0e15'; tCtx.fillRect(0,0,tCanvas.width,tCanvas.height); drawMatrix(tBoard,{x:0,y:0}); if(currentPiece){ drawMatrix(currentPiece.matrix,currentPiece.pos,currentPiece.color); if(helpOn){ const ghostPos=getGhostPosition(); drawMatrix(currentPiece.matrix,ghostPos,'rgba(255,255,255,0.25)',true); } } }
  function drawMatrix(matrix,offset,color,ghost=false){ matrix.forEach((row,y)=>row.forEach((v,x)=>{ if(v){ tCtx.fillStyle=color||tBoard[y+offset.y][x+offset.x]; const size= tCanvas.width/tCols; tCtx.globalAlpha=ghost?0.6:1; tCtx.fillRect((x+offset.x)*size,(y+offset.y)*size,size-1,size-1); tCtx.globalAlpha=1; } })); }
  function getGhostPosition(){ const ghost={...currentPiece,pos:{...currentPiece.pos}}; while(!collide(tBoard,{...ghost,pos:{...ghost.pos,y:ghost.pos.y+1}})) ghost.pos.y++; return ghost.pos; }
  function drop(time=0){ const delta=time-lastTime; lastTime=time; dropCounter+=delta; if(dropCounter>dropInterval){ currentPiece.pos.y++; if(collide(tBoard,currentPiece)){ currentPiece.pos.y--; merge(tBoard,currentPiece); sweep(); currentPiece=createPiece(); if(collide(tBoard,currentPiece)){ resetTetris(); return; } }
      dropCounter=0; }
    drawTetris(); tetrisId=requestAnimationFrame(drop);
  }
  function movePiece(dir){ currentPiece.pos.x+=dir; if(collide(tBoard,currentPiece)) currentPiece.pos.x-=dir; }
  function hardDrop(){ while(!collide(tBoard,{...currentPiece,pos:{...currentPiece.pos,y:currentPiece.pos.y+1}})) currentPiece.pos.y++; dropCounter=dropInterval+1; }
  function rotatePiece(){ const rotated=rotate(currentPiece.matrix,1); const prev=currentPiece.matrix; currentPiece.matrix=rotated; if(collide(tBoard,currentPiece)) currentPiece.matrix=prev; }
  document.addEventListener('keydown',(e)=>{
    if(!document.getElementById('tetris').classList.contains('active')) return;
    const key=e.key.toLowerCase();
    if(['arrowleft','q'].includes(key)) movePiece(-1);
    if(['arrowright','d'].includes(key)) movePiece(1);
    if(['arrowup','z'].includes(key)) rotatePiece();
    if(key===' '||key==='spacebar') hardDrop();
    if(['arrowdown','s'].includes(key)) { currentPiece.pos.y++; if(collide(tBoard,currentPiece)) currentPiece.pos.y--; }
    drawTetris();
  });
  function resetTetris(){ tBoard=createMatrix(tRows,tCols,0); currentPiece=createPiece(); dropCounter=0; dropInterval=500; cancelAnimationFrame(tetrisId); drop(); }
  document.getElementById('resetTetris').addEventListener('click',resetTetris);
  document.getElementById('helpToggle').addEventListener('click',(e)=>{ helpOn=!helpOn; e.target.textContent=`Aide IA : ${helpOn?'ON':'OFF'}`; });
  refreshers.tetris=()=>{ if(!currentPiece){ resetTetris(); } };

  // ---------- Échecs ----------
  const chessBoardEl=document.getElementById('chessBoard');
  const chessStatus=document.getElementById('chessStatus');
  const pieces={ p:'♟', P:'♙', r:'♜', R:'♖', n:'♞', N:'♘', b:'♝', B:'♗', q:'♛', Q:'♕', k:'♚', K:'♔' };
  const startPosition=[
    ['r','n','b','q','k','b','n','r'],
    ['p','p','p','p','p','p','p','p'],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    ['P','P','P','P','P','P','P','P'],
    ['R','N','B','Q','K','B','N','R'],
  ];
  let board=startPosition.map(r=>[...r]);
  let selected=null; let turn='white';

  function renderChess(){
    chessBoardEl.innerHTML='';
    for(let r=0;r<8;r++){
      for(let c=0;c<8;c++){
        const cell=document.createElement('div');
        cell.className='chess-cell ' + ((r+c)%2===0?'light':'dark');
        cell.dataset.r=r; cell.dataset.c=c;
        const val=board[r][c]; if(val) cell.textContent=pieces[val];
        if(selected && selected.r===r && selected.c===c) cell.classList.add('highlight');
        const moves= selected? legalMoves(selected.r,selected.c):[];
        if(moves.some(m=>m.r===r&&m.c===c)) cell.classList.add('highlight');
        chessBoardEl.appendChild(cell);
      }
    }
    chessStatus.textContent = `Trait aux ${turn==='white'?'blancs':'noirs'}`;
  }
  function legalMoves(r,c){
    const piece=board[r][c]; if(!piece) return [];
    const isWhite=piece===piece.toUpperCase(); if((isWhite && turn!=='white')||(!isWhite && turn!=='black')) return [];
    const moves=[];
    const push=(nr,nc)=>{ if(nr<0||nc<0||nr>=8||nc>=8) return; const target=board[nr][nc]; if(!target||isWhite!== (target===target.toUpperCase())) moves.push({r:nr,c:nc}); };
    const slide=(dr,dc)=>{ let nr=r+dr,nc=c+dc; while(nr>=0&&nc>=0&&nr<8&&nc<8){ if(board[nr][nc]){ if(isWhite!==(board[nr][nc]===board[nr][nc].toUpperCase())) moves.push({r:nr,c:nc}); break;} moves.push({r:nr,c:nc}); nr+=dr; nc+=dc; } };
    const knight=[[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]];
    switch(piece.toLowerCase()){
      case 'p': {
        const dir=isWhite?-1:1; const start=isWhite?6:1;
        if(!board[r+dir]?.[c]) moves.push({r:r+dir,c});
        if(r===start && !board[r+dir]?.[c] && !board[r+2*dir]?.[c]) moves.push({r:r+2*dir,c});
        [[dir,-1],[dir,1]].forEach(([dr,dc])=>{ const nr=r+dr,nc=c+dc; if(nr>=0&&nc>=0&&nr<8&&nc<8){ const target=board[nr][nc]; if(target && (target===target.toUpperCase())!==isWhite) moves.push({r:nr,c:nc}); }});
        break;
      }
      case 'r': slide(1,0); slide(-1,0); slide(0,1); slide(0,-1); break;
      case 'b': slide(1,1); slide(1,-1); slide(-1,1); slide(-1,-1); break;
      case 'q': slide(1,0); slide(-1,0); slide(0,1); slide(0,-1); slide(1,1); slide(1,-1); slide(-1,1); slide(-1,-1); break;
      case 'k': for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){ if(dr||dc) push(r+dr,c+dc);} break;
      case 'n': knight.forEach(([dr,dc])=>push(r+dr,c+dc)); break;
    }
    return moves;
  }
  chessBoardEl.addEventListener('click',(e)=>{
    const cell=e.target.closest('.chess-cell'); if(!cell) return; const r=Number(cell.dataset.r), c=Number(cell.dataset.c);
    if(selected){
      const moves=legalMoves(selected.r,selected.c); if(moves.some(m=>m.r===r && m.c===c)){ board[r][c]=board[selected.r][selected.c]; board[selected.r][selected.c]=0; turn=turn==='white'?'black':'white'; selected=null; renderChess(); return; }
    }
    if(board[r][c]){ selected={r,c}; renderChess(); }
  });
  document.getElementById('resetChess').addEventListener('click',()=>{ board=startPosition.map(r=>[...r]); turn='white'; selected=null; renderChess(); });
  refreshers.chess=()=>{ if(!chessBoardEl.childElementCount) renderChess(); };

  // ---------- Tri visuel ----------
  const barsEl=document.getElementById('bars');
  const algoSelect=document.getElementById('algoSelect');
  const shuffleBtn=document.getElementById('shuffleBars');
  const startSortBtn=document.getElementById('startSort');
  const pauseSortBtn=document.getElementById('pauseSort');
  let barValues=[]; let sortGen=null; let sortInterval=null; let paused=false;

  function initBars(){ barValues=Array.from({length:40},()=>rand(10,220)); renderBars(); }
  function renderBars(active=[]) {
    barsEl.innerHTML='';
    barValues.forEach((v,i)=>{
      const bar=document.createElement('div');
      bar.className='bar';
      if(active.includes(i)) bar.classList.add('active');
      bar.style.height=`${v}px`;
      barsEl.appendChild(bar);
    });
  }
  function* bubbleSort(){ let arr=barValues; let n=arr.length; for(let i=0;i<n;i++) for(let j=0;j<n-i-1;j++){ renderBars([j,j+1]); yield; if(arr[j]>arr[j+1]) [arr[j],arr[j+1]]=[arr[j+1],arr[j]]; } renderBars(); }
  function* insertionSort(){ let arr=barValues; for(let i=1;i<arr.length;i++){ let key=arr[i]; let j=i-1; while(j>=0 && arr[j]>key){ renderBars([j,j+1]); yield; arr[j+1]=arr[j]; j--; } arr[j+1]=key; } renderBars(); }
  function* mergeSort(arr=barValues, l=0, r=barValues.length-1){ if(l>=r) return; const m=Math.floor((l+r)/2); yield* mergeSort(arr,l,m); yield* mergeSort(arr,m+1,r); const left=arr.slice(l,m+1), right=arr.slice(m+1,r+1); let i=0,j=0,k=l; while(i<left.length||j<right.length){ renderBars([k]); yield; if(j>=right.length || (i<left.length && left[i]<=right[j])) arr[k++]=left[i++]; else arr[k++]=right[j++]; } }
  function* quickSort(l=0,r=barValues.length-1){ if(l>=r) return; let pivot=barValues[r], i=l; for(let j=l;j<r;j++){ renderBars([j,r]); yield; if(barValues[j]<pivot){ [barValues[i],barValues[j]]=[barValues[j],barValues[i]]; i++; } } [barValues[i],barValues[r]]=[barValues[r],barValues[i]]; yield* quickSort(l,i-1); yield* quickSort(i+1,r); }

  function startSort(){ if(sortInterval) clearInterval(sortInterval); const algo=algoSelect.value; if(algo==='bubble') sortGen=bubbleSort(); if(algo==='insertion') sortGen=insertionSort(); if(algo==='merge') sortGen=mergeSort(); if(algo==='quick') sortGen=quickSort(); sortInterval=setInterval(()=>{ const step=sortGen.next(); if(step.done){ clearInterval(sortInterval); renderBars(); } },80); }
  shuffleBtn.addEventListener('click',()=>{ initBars(); });
  startSortBtn.addEventListener('click',()=>{ paused=false; startSort(); });
  pauseSortBtn.addEventListener('click',()=>{ if(sortInterval){ clearInterval(sortInterval); sortInterval=null; } else startSort(); });
  refreshers.sorting=()=>{ initBars(); };

  // ---------- Labyrinthe ----------
  const mazeCanvas=document.getElementById('mazeCanvas');
  const mCtx=mazeCanvas.getContext('2d');
  const mazeSize=21; let mazeGrid=createMatrix(mazeSize,mazeSize,1); let start={x:1,y:1}; let goal={x:mazeSize-2,y:mazeSize-2}; let mazeTimer=null; let frontier=[]; let visited=new Map(); let path=[]; let algo='bfs';

  function generateMaze(){ mazeGrid=createMatrix(mazeSize,mazeSize,1); for(let y=1;y<mazeSize-1;y+=2){ for(let x=1;x<mazeSize-1;x+=2){ mazeGrid[y][x]=0; const dirs=[[0,2],[0,-2],[2,0],[-2,0]]; const [dx,dy]=dirs[rand(0,3)]; if(y+dy>0&&y+dy<mazeSize-1&&x+dx>0&&x+dx<mazeSize-1){ mazeGrid[y+dy/2][x+dx/2]=0; mazeGrid[y+dy][x+dx]=0; } } }
    drawMaze(); }
  function drawMaze(){ const size=mazeCanvas.width/mazeSize; mCtx.fillStyle='#0c0e15'; mCtx.fillRect(0,0,mazeCanvas.width,mazeCanvas.height); for(let y=0;y<mazeSize;y++) for(let x=0;x<mazeSize;x++){ if(mazeGrid[y][x]){ mCtx.fillStyle='#161925'; mCtx.fillRect(x*size,y*size,size,size); } }
    mCtx.fillStyle='#6bffb2'; mCtx.fillRect(start.x*size,start.y*size,size,size);
    mCtx.fillStyle='#ff6b6b'; mCtx.fillRect(goal.x*size,goal.y*size,size,size);
    frontier.forEach(({x,y})=>{ mCtx.fillStyle='rgba(106,227,255,0.5)'; mCtx.fillRect(x*size,y*size,size,size); });
    path.forEach(({x,y})=>{ mCtx.fillStyle='rgba(255,209,102,0.8)'; mCtx.fillRect(x*size,y*size,size,size); });
  }
  function startSearch(){ frontier=[{...start,g:0,f:heuristic(start)}]; visited=new Map([[`${start.x},${start.y}`,0]]); path=[]; clearInterval(mazeTimer); mazeTimer=setInterval(stepMaze,80); }
  function neighbors(node){ const dirs=[[1,0],[-1,0],[0,1],[0,-1]]; return dirs.map(([dx,dy])=>({x:node.x+dx,y:node.y+dy})).filter(({x,y})=>x>=0&&y>=0&&x<mazeSize&&y<mazeSize&&!mazeGrid[y][x]); }
  function heuristic(n){ return Math.abs(goal.x-n.x)+Math.abs(goal.y-n.y); }
  function stepMaze(){ if(!frontier.length){ clearInterval(mazeTimer); return; }
    if(algo==='astar') frontier.sort((a,b)=>a.f-b.f);
    const current = algo==='dfs'? frontier.pop(): frontier.shift();
    if(current.x===goal.x && current.y===goal.y){ path=reconstruct(current); clearInterval(mazeTimer); drawMaze(); return; }
    neighbors(current).forEach(n=>{ const key=`${n.x},${n.y}`; const g=current.g+1; if(!visited.has(key) || g<visited.get(key)){ visited.set(key,g); frontier.push({...n, g, f:g+heuristic(n), parent: current}); } });
    drawMaze();
  }
  function reconstruct(end){ const result=[]; let node=end; while(node){ result.push({x:node.x,y:node.y}); node=node.parent; } return result; }
  document.getElementById('genMaze').addEventListener('click',generateMaze);
  document.getElementById('startMaze').addEventListener('click',()=>{ algo=document.getElementById('mazeAlgo').value; startSearch(); });
  document.getElementById('resetMaze').addEventListener('click',()=>{ clearInterval(mazeTimer); frontier=[]; visited=new Set(); path=[]; drawMaze(); });
  refreshers.maze=()=>{ generateMaze(); };

  // ---------- Sphère 3D ----------
  const sphereContainer=document.getElementById('sphereContainer');
  let renderer,scene,camera,controls,sphereMesh,wireframe=false; let animId;

  function initSphere(){
    const width=sphereContainer.clientWidth; const height=sphereContainer.clientHeight || 420;
    renderer=new THREE.WebGLRenderer({antialias:true}); renderer.setSize(width,height); renderer.setPixelRatio(window.devicePixelRatio||1);
    sphereContainer.innerHTML=''; sphereContainer.appendChild(renderer.domElement);
    scene=new THREE.Scene(); scene.background=new THREE.Color(0x0f1117);
    camera=new THREE.PerspectiveCamera(45,width/height,0.1,100); camera.position.set(0,0,4);
    controls=new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping=true; controls.dampingFactor=0.05;
    const light=new THREE.PointLight(0xffffff,1.2); light.position.set(5,5,5); scene.add(light); scene.add(new THREE.AmbientLight(0x404040));
    const geo=new THREE.SphereGeometry(1,48,32);
    const mat=new THREE.MeshStandardMaterial({color:0x6ae3ff, metalness:0.1, roughness:0.3, wireframe});
    sphereMesh=new THREE.Mesh(geo,mat); scene.add(sphereMesh);
    animateSphere();
  }
  function animateSphere(){ animId=requestAnimationFrame(animateSphere); sphereMesh.rotation.y+=0.003; controls.update(); renderer.render(scene,camera); }
  document.getElementById('toggleWire').addEventListener('click',()=>{ wireframe=!wireframe; if(sphereMesh) sphereMesh.material.wireframe=wireframe; });
  document.getElementById('resetSphere').addEventListener('click',()=>{ cancelAnimationFrame(animId); initSphere(); });
  window.addEventListener('resize',()=>{ if(!sphereContainer.contains(renderer?.domElement)) return; const w=sphereContainer.clientWidth; const h=sphereContainer.clientHeight||420; renderer.setSize(w,h); camera.aspect=w/h; camera.updateProjectionMatrix(); });
  refreshers.sphere=()=>{ if(!renderer) initSphere(); };

  // Initial refreshers for first view
  refreshers.hub = ()=>{};
})();
