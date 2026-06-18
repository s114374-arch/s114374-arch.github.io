// 開發者測試模式控制 (true: 25秒測試版 / false: 25分鐘正式作業版)
const DEV_MODE = true; 
const START_TIME = DEV_MODE ? 25 : 1500;

let timeLeft = START_TIME;
let isRunning = false;
let timerInterval = null;

// DOM 節點快取
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const plantEmoji = document.getElementById('plantEmoji');
const stageText = document.getElementById('stageText');
const nextStageText = document.getElementById('nextStageText');
const countdownText = document.getElementById('countdownText');
const progressText = document.getElementById('progressText');
const progressBar = document.getElementById('progressBar');
const totalPomodorosDisplay = document.getElementById('totalPomodoros');
const totalFocusTimeDisplay = document.getElementById('totalFocusTime');
const completedPlantsDisplay = document.getElementById('completedPlants');

// 載入本地快取資料結構（獨立儲存鍵，避免撞名）
let data = JSON.parse(localStorage.getItem('bloomodoro_v1_final_data')) || {
    growth: 0,
    totalPomodoros: 0,
    totalFocusTime: 0,
    completedPlants: 0
};

// 規格定義階段：配置臨界數值
const stages = [
    { thresh: 0, emoji: '🌰', name: '種子' },
    { thresh: 1, emoji: '🌱', name: '萌芽' },
    { thresh: 3, emoji: '🌿', name: '成長' },
    { thresh: 6, emoji: '🌸', name: '含苞' },
    { thresh: 10, emoji: '🌺', name: '盛開' }
];

function saveStorage() {
    localStorage.setItem('bloomodoro_v1_final_data', JSON.stringify(data));
}

function updateUI() {
    let currentStage = stages[0];
    let nextStage = stages[1];

    // 比對判斷當前所屬成長階段與下一階段
    for (let i = 0; i < stages.length; i++) {
        if (data.growth >= stages[i].thresh) {
            currentStage = stages[i];
            nextStage = stages[i + 1] || null;
        }
    }

    // 更新核心植物符號與狀態卡內容
    plantEmoji.textContent = currentStage.emoji;
    
    if (data.growth === 10) {
        stageText.textContent = `${currentStage.emoji} 已盛開`;
    } else {
        stageText.textContent = `${currentStage.emoji} ${currentStage.name}中`;
    }
    
    // 計算與渲染下一階段所需剩餘番茄數
    if (nextStage) {
        nextStageText.textContent = `${nextStage.emoji} ${nextStage.name}`;
        let remaining = nextStage.thresh - data.growth;
        countdownText.textContent = remaining;
    } else {
        nextStageText.textContent = "最高階段";
        countdownText.textContent = "0";
    }

    // 處理經驗條進度比例換算
    progressText.textContent = `${data.growth} / 10`;
    const percentage = Math.min((data.growth / 10) * 100, 100);
    progressBar.style.width = `${percentage}%`;

    // 數據看板更新
    totalPomodorosDisplay.textContent = `${data.totalPomodoros} 個`;
    totalFocusTimeDisplay.textContent = `${data.totalFocusTime} 分鐘`;
    completedPlantsDisplay.textContent = `${data.completedPlants} 盆`;

    // 控制右側進度追蹤明細的亮起狀態
    stages.forEach(s => {
        const stepElement = document.getElementById(`step${s.thresh}`);
        if (stepElement) {
            if (data.growth >= s.thresh) {
                stepElement.className = "active";
            } else {
                stepElement.className = "";
            }
        }
    });
}

function renderTimer() {
    let mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    let secs = String(timeLeft % 60).padStart(2, '0');
    timerDisplay.textContent = `${mins}:${secs}`;
}

// 綁定事件監聽器：開始/暫停
startBtn.onclick = () => {
    if (isRunning) {
        isRunning = false;
        startBtn.textContent = "開始";
        startBtn.classList.remove('running');
        clearInterval(timerInterval);
    } else {
        isRunning = true;
        startBtn.textContent = "暫停";
        startBtn.classList.add('running');
        timerInterval = setInterval(handleTick, 1000);
    }
};

// 綁定事件監聽器：重置計時器
resetBtn.onclick = () => {
    isRunning = false;
    clearInterval(timerInterval);
    startBtn.textContent = "開始";
    startBtn.classList.remove('running');
    timeLeft = START_TIME;
    renderTimer();
};

function handleTick() {
    if (!isRunning) return;
    timeLeft--;
    
    if (timeLeft <= 0) {
        timeLeft = START_TIME; // 重置內部時間計數
        
        let initialGrowth = data.growth;
        data.growth++;
        data.totalPomodoros++;
        data.totalFocusTime += DEV_MODE ? 1 : 25;

        // 停止計時線路切換狀態
        isRunning = false;
        clearInterval(timerInterval);
        startBtn.textContent = "開始";
        startBtn.classList.remove('running');

        // 依據規格判定動態回饋動畫種類
        if (initialGrowth === 0 && data.growth === 1) {
            // 第一次從種子到萌芽 (🌰 -> 🌱)：執行2.5秒土壤晃動動畫
            plantEmoji.className = 'pot main-plant soil-shake-animation';
            setTimeout(() => {
                plantEmoji.className = 'pot main-plant';
                executeNotification();
            }, 2500);
        } else {
            // 後續階段：執行0.8秒快速長葉子縮放動畫
            plantEmoji.className = 'pot main-plant leaf-grow-animation';
            setTimeout(() => {
                plantEmoji.className = 'pot main-plant';
                executeNotification();
            }, 800);
        }
        
        saveStorage();
        updateUI();
        renderTimer();
    }
    renderTimer();
}

function executeNotification() {
    if (data.growth >= 10) {
        alert('🎉 恭喜！熊童子已順利盛開 🌺！已獲得完成紀錄並將其解鎖至植物百科！點擊確定即可重新播種。');
        data.completedPlants++;
        data.growth = 0; // 盛開完成後歸零重新種植
        saveStorage();
        updateUI();
    } else {
        alert('🔔 完成一次番茄鐘！植物獲得了專注養分，繼續加油 🌱！');
    }
}

// 初始化調用
updateUI();
renderTimer();