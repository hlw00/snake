const playboard = document.querySelector('.play-board');
const scoreElement = document.querySelector('.score');
const highScoreElement = document.querySelector('.high-score');
const controls = document.querySelectorAll('.controls i'); //選取所有在 .controls 類別下的 <i> 標籤元素
// console.log("JavaScript 載入成功！");
const wallToggle = document.getElementById('wall-toggle')
const selfHitToggle = document.getElementById('self-hit-toggle');
const speedControl = document.getElementById('speed-control');
const pausebutton = document.getElementById('pause-button');

let gameOver = false; //紀錄遊戲是否結束
let foodX, foodY; //食物位置
let snakeX = 5, snakeY = 5; //蛇頭部位置
let snakeBody = []; //紀錄蛇的身體位置(為二維陣列)
let velocityX = 0, velocityY = 0; //移動方向 X=-1向左, X=1向右, Y=1向上, Y=-1向下
let setIntervalid; //計時器變數
let score = 0; //分數
let html;
let highScore = parseInt(localStorage.getItem('high-score')) || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

let gamePaused = false;

const UpdateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30 + 1);
    foodY = Math.floor(Math.random() * 30 + 1);
}
//當這個函數被呼叫時，它會執行裡面的程式碼來更新食物的位置
UpdateFoodPosition()

//偵測貪吃蛇的移動方向
const changeDirection = e => {
    if (e.key == 'ArrowUp') {
        velocityX = 0;
        velocityY = -1; //y軸向上是負值
    } else if (e.key == 'ArrowDown') {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key == 'ArrowRight') {
        velocityX = 1;
        velocityY = 0;
    } else if (e.key == 'ArrowLeft') {
        velocityX = -1;
        velocityY = 0;
    }
    //console.log(e.key)
}

//偵測畫面按鈕點擊
controls.forEach(button => button.addEventListener('click', () => changeDirection({ key: button.dataset.key })))
//controls 是一個包含所有按鈕的陣列或類似陣列的物件

//偵測鍵盤點擊
document.addEventListener('keyup', changeDirection)

//遊戲中
const initGame = () => {
    if (gameOver) return handleGameOver();
    html = `<div class="food" style="grid-area:${foodY}/${foodX}"></div>`//將食物放置於畫面中

    //檢查貪吃蛇是否碰到食物
    if (snakeX === foodX && snakeY === foodY) {
        UpdateFoodPosition();
        snakeBody.push([foodX, foodY]);//把食物推進蛇的陣列
        score++;
        highScore = score > highScore ? score : highScore;
        //condition ? value_if_true : value_if_false;
        localStorage.setItem('high-score', highScore);//存入storage
        scoreElement.innerText = `Score:${score}`;//更新分數
        highScoreElement.innerText = `High Score: ${highScore}`;//更新最高分
    }
    //根據當前方向控制蛇頭的位置
    snakeX += velocityX;
    snakeY += velocityY;

    //若在牆外，遊戲結束
    if (wallToggle.checked) {
        if (snakeX <= 0) snakeX = 30;
        if (snakeX > 30) snakeX = 1;
        if (snakeY <= 0) snakeY = 30;
        if (snakeY > 30) snakeY = 1;
    } else {
        if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
            return gameOver = true;
        }
    }


    //將貪吃蛇陣列值移動一位(移動蛇的身體)
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1]
    }
    //將頭部座標擺入陣列的第0個位置
    snakeBody[0] = [snakeX, snakeY];

    //蛇吃掉食物後身體添加div
    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area:${snakeBody[i][1]}/${snakeBody[i][0]}"></div>`;
        //檢查頭是否撞到身體
        if(!selfHitToggle.checked){
            if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
                gameOver = true;
            }
        }
        
    }
    playboard.innerHTML = html;


    console.log(snakeBody[0]);
}

//設定遊戲開始
setIntervalid = setInterval(initGame, 100);
//遊戲結束
const handleGameOver = () => {
    clearInterval(setIntervalid);
    alert('遊戲結束，按下確定重新開始');
    location.reload();
}

pausebutton.addEventListener('click',()=>{
    gamePaused=!gamePaused;
    if(gamePaused){
        pausebutton.textContent='繼續'
        clearInterval(setIntervalid);
        console.log('stop');
    }else{
        pausebutton.textContent='暫停'
        setIntervalid =setInterval(initGame,parseInt(speedControl.value));
    }
})

//監聽速度變更 先清除再更新數字
function speedChange(){
    if(gamePaused){
        clearInterval(setIntervalid);
    }else{
        clearInterval(setIntervalid);
        setIntervalid =setInterval(initGame,parseInt(speedControl.value));
    }   
}
speedControl.addEventListener('input',speedChange);
