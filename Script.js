let board = ["","","","","","","","",""];
let level = 'easy';
let gameOver = false;

const win = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const boardDiv = document.getElementById("board");
const resultDiv = document.getElementById("result");
const statusDiv = document.getElementById("status");

for(let i=0;i<9;i++){
  let d = document.createElement("div");
  d.className="cell";
  d.id=i;
  d.onclick=()=>playerMove(i);
  boardDiv.appendChild(d);
}

function setLevel(l){
  level=l;
  document.getElementById("easyBtn").className = l=='easy'? 'active' : 'inactive';
  document.getElementById("hardBtn").className = l=='hard'? 'active' : 'inactive';
  resetGame();
}

function playerMove(i){
  if(board[i]!="" || gameOver) return;
  board[i]="X";
  draw();
  if(check("X")){ end("YOU WON! 🎉"); return; }
  if(!board.includes("")){ end("DRAW!"); return; }

  statusDiv.innerText="AI Thinking...";
  setTimeout(()=>{
    let ai = getAiMove();
    board[ai]="O";
    draw();
    if(check("O")){ end("AI WON!"); }
    else if(!board.includes("")){ end("DRAW!"); }
    else{ statusDiv.innerText="Your Turn - You are X"; }
  },300);
}

function getAiMove(){
  if(level=='easy' && Math.random()<0.6){
    let empty = board.map((v,i)=>v==""?i:null).filter(v=>v!=null);
    return empty[Math.floor(Math.random()*empty.length)];
  }
  return minimax(board,"O").index;
}

function check(p){
  return win.some(c=> board[c[0]]==p && board[c[1]]==p && board[c[2]]==p);
}

function draw(){
  board.forEach((v,i)=> document.getElementById(i).innerText=v);
}

function end(msg){
  resultDiv.style.display="block";
  resultDiv.innerText=msg;
  gameOver=true;
  statusDiv.innerText=msg;
}

function resetGame(){
  board=["","","","","","","","",""];
  gameOver=false;
  resultDiv.style.display="none";
  statusDiv.innerText="Your Turn - You are X";
  draw();
}

function minimax(b,p){
  let avail = b.map((v,i)=>v==""?i:null).filter(v=>v!=null);
  if(checkWin(b,"X")) return {score:-10};
  if(checkWin(b,"O")) return {score:10};
  if(avail.length==0) return {score:0};

  let moves=[];
  for(let i of avail){
    let move={};
    move.index=i;
    b[i]=p;
    move.score = p=="O"? minimax(b,"X").score : minimax(b,"O").score;
    b[i]="";
    moves.push(move);
  }
  let best = p=="O"? -100 : 100;
  let bestMove;
  for(let m of moves){
    if((p=="O" && m.score>best) || (p=="X" && m.score<best)){
      best=m.score; bestMove=m;
    }
  }
  return bestMove;
}
function checkWin(b,p){ return win.some(c=> b[c[0]]==p && b[c[1]]==p && b[c[2]]==p); }
