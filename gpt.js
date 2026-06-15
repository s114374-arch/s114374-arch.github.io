let totalSeconds = 1500;
let timer;
let growthStage = 1;
let completed = 0;

const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

function updateTimer(){

let min =
Math.floor(totalSeconds/60);

let sec =
totalSeconds%60;

timerEl.textContent =
String(min).padStart(2,"0")
+ ":" +
String(sec).padStart(2,"0");
}

function growPlant(){

if(growthStage < 5){

```
growthStage++;

document
  .getElementById("plantImage")
  .src =
  `assets/plants/stage${growthStage}.png`;

document
  .getElementById("growthText")
  .textContent =
  `${growthStage-1} / 4`;
```

}

localStorage.setItem(
"growthStage",
growthStage
);

}

function finishPomodoro(){

completed++;

document
.getElementById("completedPomodoro")
.textContent =
completed + " 次";

growPlant();

localStorage.setItem(
"completed",
completed
);

}

function startTimer(){

clearInterval(timer);

timer = setInterval(()=>{

```
totalSeconds--;

updateTimer();

if(totalSeconds <= 0){

  clearInterval(timer);

  finishPomodoro();

  totalSeconds = 1500;

  updateTimer();

}
```

},1000);

}

function resetTimer(){

clearInterval(timer);

totalSeconds = 1500;

updateTimer();

}

function loadData(){

const savedStage =
localStorage.getItem("growthStage");

const savedCompleted =
localStorage.getItem("completed");

if(savedStage){

```
growthStage =
  Number(savedStage);

document
  .getElementById("plantImage")
  .src =
  `assets/plants/stage${growthStage}.png`;
```

}

if(savedCompleted){

```
completed =
  Number(savedCompleted);

document
  .getElementById("completedPomodoro")
  .textContent =
  completed + " 次";
```

}

}

startBtn.addEventListener(
"click",
startTimer
);

resetBtn.addEventListener(
"click",
resetTimer
);

loadData();
updateTimer();
