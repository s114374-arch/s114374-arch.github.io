let totalSeconds = 1500;

let timer;

let growthStage = 1;

let completed = 0;

const timerEl =
document.getElementById("timer");

const startBtn =
document.getElementById("startBtn");

const resetBtn =
document.getElementById("resetBtn");

const plantImage =
document.getElementById("plantImage");

const plantStage =
document.getElementById("plantStage");

const growthText =
document.getElementById("growthText");

/* 成長階段名稱 */

const stageNames = [

```
"種子",

"小嫩芽",

"中型多肉",

"繁茂多肉",

"完美開花"
```

];

function updateTimer(){

```
let min =
Math.floor(totalSeconds/60);

let sec =
totalSeconds%60;

timerEl.textContent =

String(min).padStart(2,"0")

+ ":"

+ String(sec).padStart(2,"0");
```

}

function updatePlant(){

```
plantImage.src =

`assets/plants/stage${growthStage}.png`;

plantStage.textContent =

stageNames[growthStage-1];

growthText.textContent =

`${growthStage-1} / 4`;
```

}

function growPlant(){

```
if(growthStage < 5){

    growthStage++;

    updatePlant();

    localStorage.setItem(
        "growthStage",
        growthStage
    );
}
```

}

function finishPomodoro(){

```
completed++;

document
.getElementById(
    "completedPomodoro"
)
.textContent =
completed + " 次";

localStorage.setItem(
    "completed",
    completed
);

growPlant();

alert(
"🎉 完成一次專注！\n多肉植物長大了！"
);
```

}

function startTimer(){

```
clearInterval(timer);

timer = setInterval(()=>{

    totalSeconds--;

    updateTimer();

    if(totalSeconds <= 0){

        clearInterval(timer);

        finishPomodoro();

        totalSeconds = 1500;

        updateTimer();
    }

},1000);
```

}

function resetTimer(){

```
clearInterval(timer);

totalSeconds = 1500;

updateTimer();
```

}

function loadData(){

```
const savedStage =
localStorage.getItem(
    "growthStage"
);

const savedCompleted =
localStorage.getItem(
    "completed"
);

if(savedStage){

    growthStage =
    Number(savedStage);
}

if(savedCompleted){

    completed =
    Number(savedCompleted);

    document
    .getElementById(
        "completedPomodoro"
    )
    .textContent =
    completed + " 次";
}

updatePlant();
```

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
