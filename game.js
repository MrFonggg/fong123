// ============================================
// 小三數學大對戰 - 遊戲邏輯核心 (150題版)
// ============================================

console.log("Game.js 已加載"); // 調試訊息

// ============ 遊戲常數 ============
const GAME_CONFIG = {
    GAME_DURATION: 120, // 遊戲時間（秒）
    INITIAL_HP: 100,
    MONSTER_HP: 100,
    CORRECT_DAMAGE: 20,
    WRONG_DAMAGE: 10,
    CORRECT_TO_UPGRADE: 5, // 答對幾題可升級
    COMBO_THRESHOLD: 3 // Combo 顯示門檻
};

// ============ 乘加/乘減混合計算題 (100題) ============
const CALCULATION_POOL = generateCalculationQuestions();

function generateCalculationQuestions() {
    const questions = [];
    
    // 生成100道乘加/乘減混合計算題
    for (let i = 0; i < 100; i++) {
        const a = Math.floor(Math.random() * 9) + 2; // 2-10
        const b = Math.floor(Math.random() * 9) + 2; // 2-10
        const c = Math.floor(Math.random() * 20) + 1; // 1-20
        const isAddition = Math.random() > 0.5;
        const correctAnswer = isAddition ? (a * b + c) : (a * b - c);
        
        // 生成四個選項
        const options = [correctAnswer];
        
        // 生成干擾項
        for (let j = 0; j < 3; j++) {
            let wrongAnswer;
            const errorType = Math.floor(Math.random() * 3);
            
            if (errorType === 0) {
                wrongAnswer = isAddition ? (a * b - c) : (a * b + c); // 反向操作
            } else if (errorType === 1) {
                wrongAnswer = a * b; // 遺漏加/減
            } else {
                wrongAnswer = correctAnswer + (Math.floor(Math.random() * 10) - 5); // 隨機偏差
            }
            
            if (!options.includes(wrongAnswer) && wrongAnswer > 0) {
                options.push(wrongAnswer);
            }
        }
        
        // 確保有4個選項
        while (options.length < 4) {
            const random = Math.floor(Math.random() * 100) + 1;
            if (!options.includes(random)) options.push(random);
        }
        
        // 打亂選項順序
        const shuffled = shuffleArray([...options]);
        const correctIndex = shuffled.indexOf(correctAnswer);
        
        const operationSign = isAddition ? '+' : '-';
        questions.push({
            q: `${a} × ${b} ${operationSign} ${c} = ?`,
            options: shuffled,
            correct: correctIndex,
            type: 'calc',
            displayOptions: shuffled.map(opt => opt.toString())
        });
    }
    
    return questions;
}

// ============ 比較題資料庫 (56題) ============
const COMPARISON_POOL = [
    // == 分數 (1-13) ==
    {q: "1/3 _ 1/2", options: ["<", ">", "="], correct: 0, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "1/4 _ 1/5", options: ["<", ">", "="], correct: 1, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "2/4 _ 1/2", options: ["<", ">", "="], correct: 2, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "3/7 _ 5/7", options: ["<", ">", "="], correct: 0, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "6/6 _ 1", options: ["<", ">", "="], correct: 2, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "4/9 _ 2/9", options: ["<", ">", "="], correct: 1, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "1/8 _ 1/6", options: ["<", ">", "="], correct: 0, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "5/5 _ 8/8", options: ["<", ">", "="], correct: 2, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "3/5 _ 2/5", options: ["<", ">", "="], correct: 1, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "7/10 _ 9/10", options: ["<", ">", "="], correct: 0, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "1/10 _ 1/12", options: ["<", ">", "="], correct: 1, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "4/4 _ 3/4", options: ["<", ">", "="], correct: 1, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "2/6 _ 3/6", options: ["<", ">", "="], correct: 0, type: 'comp', displayOptions: ["<", ">", "="]},
    
    // == 重量 (14-25) ==
    {q: "1 kg _ 900 g", options: ["<", ">", "="], correct: 1, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "500 g _ 1/2 kg", options: ["<", ">", "="], correct: 2, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "2000 g _ 2 kg", options: ["<", ">", "="], correct: 2, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "3 kg _ 3500 g", options: ["<", ">", "="], correct: 0, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "4050 g _ 4 kg", options: ["<", ">", "="], correct: 1, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "6 kg _ 600 g", options: ["<", ">", "="], correct: 1, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "1 kg 200 g _ 1200 g", options: ["<", ">", "="], correct: 2, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "800 g _ 1 kg", options: ["<", ">", "="], correct: 0, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "2 kg _ 1500 g", options: ["<", ">", "="], correct: 1, type: 'comp', displayOptions: ["<", ">", "="]},
    
    // == 容量 (26-38) ==
    {q: "1 L _ 850 mL", options: ["<", ">", "="], correct: 1, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "2000 mL _ 2 L", options: ["<", ">", "="], correct: 2, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "500 mL _ 1 L", options: ["<", ">", "="], correct: 0, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "1 L 500 mL _ 1500 mL", options: ["<", ">", "="], correct: 2, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "3 L _ 3050 mL", options: ["<", ">", "="], correct: 0, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "4 L _ 400 mL", options: ["<", ">", "="], correct: 1, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "750 mL _ 75 L", options: ["<", ">", "="], correct: 0, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "6000 mL _ 6 L", options: ["<", ">", "="], correct: 2, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "1 L 20 mL _ 1200 mL", options: ["<", ">", "="], correct: 0, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "900 mL _ 1 L", options: ["<", ">", "="], correct: 0, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "2 L 400 mL _ 2400 mL", options: ["<", ">", "="], correct: 2, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "5 L _ 4900 mL", options: ["<", ">", "="], correct: 1, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "3000 mL _ 3 L", options: ["<", ">", "="], correct: 2, type: 'comp', displayOptions: ["<", ">", "="]},
    
    // == 長度 (39-50) ==
    {q: "1 m _ 99 cm", options: ["<", ">", "="], correct: 1, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "200 cm _ 2 m", options: ["<", ">", "="], correct: 2, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "3 m _ 350 cm", options: ["<", ">", "="], correct: 0, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "4 m 5 cm _ 450 cm", options: ["<", ">", "="], correct: 0, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "600 cm _ 6 m", options: ["<", ">", "="], correct: 2, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "8 m _ 80 cm", options: ["<", ">", "="], correct: 1, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "1 m 20 cm _ 120 cm", options: ["<", ">", "="], correct: 2, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "50 cm _ 5 m", options: ["<", ">", "="], correct: 0, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "7 m 80 cm _ 708 cm", options: ["<", ">", "="], correct: 1, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "900 cm _ 9 m", options: ["<", ">", "="], correct: 2, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "150 cm _ 1 m", options: ["<", ">", "="], correct: 1, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "3 m 40 cm _ 340 cm", options: ["<", ">", "="], correct: 2, type: 'comp', displayOptions: ["<", ">", "="]},
    {q: "250 cm _ 2 m 50 cm", options: ["<", ">", "="], correct: 2, type: 'comp', displayOptions: ["<", ">", "="]},
];

// ============ 怪獸模板 ============
const MONSTER_TEMPLATES = [
    {name: "綠色史萊姆", pic: "🌱"}, {name: "淘氣小蝙蝠", pic: "🦇"}, {name: "迷你骷髏兵", pic: "💀"},
    {name: "紅帽小火精", pic: "🔥"}, {name: "石頭怪人", pic: "🗿"}, {name: "冰晶巨怪", pic: "❄️"},
    {name: "雙頭魔龍", pic: "🐲"}
];

// ============ 職業升級系統 ============
const JOB_TEMPLATES = {
    knight: [
        "見習騎士", "初級騎士", "中級騎士", "高級騎士", "主宰騎士", "傳奇聖騎士"
    ],
    mage: [
        "見習法師", "初級法師", "中級法師", "高級法師", "主宰法師", "傳奇大魔導師"
    ]
};

// ============ 遊戲狀態 ============
let gameState = {
    timerInterval: null,
    timeLeft: GAME_CONFIG.GAME_DURATION,
    p1: {},
    p2: {},
    questionPool: [], // 混合題目池
};

// ============ 初始化玩家 ============
function initPlayer(id) {
    const jobType = id === 1 ? 'knight' : 'mage';
    return {
        hp: GAME_CONFIG.INITIAL_HP,
        score: 0,
        combo: 0,
        maxCombo: 0,
        kills: 0,
        correctCount: 0,
        currentJob: JOB_TEMPLATES[jobType][0],
        jobType: jobType,
        selectedAnswer: -1,
        currentQuizIndex: 0,
        monsterHp: GAME_CONFIG.MONSTER_HP,
        monsterName: "",
        monsterPic: "",
        isDamaged: false,
        currentQuestion: null
    };
}

// ============ 畫面導航 ============
function showScreen(screenId) {
    console.log("切換到畫面: " + screenId);
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
    } else {
        console.error("找不到畫面: " + screenId);
    }
    
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.style.display = screenId === 'screen-game' ? 'block' : 'none';
    }
}

function goHome() {
    clearInterval(gameState.timerInterval);
    showScreen('screen-start');
}

// ============ 全屏控制 ============
function toggleFullscreen() {
    const btn = document.getElementById('btn-fullscreen');
    
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            alert(`無法切換全屏: ${err.message}`);
        });
        if (btn) btn.innerText = "退出全屏";
    } else {
        document.exitFullscreen();
        if (btn) btn.innerText = "全屏顯示";
    }
}

// ============ 遊戲流程控制 ============
function startGame() {
    console.log("遊戲開始");
    
    gameState.p1 = initPlayer(1);
    gameState.p2 = initPlayer(2);
    gameState.timeLeft = GAME_CONFIG.GAME_DURATION;
    
    // 建立混合題目池 (100計算題 + 56比較題)
    gameState.questionPool = [
        ...CALCULATION_POOL.map((q, i) => ({ ...q, poolIndex: i, isCalc: true })),
        ...COMPARISON_POOL.map((q, i) => ({ ...q, poolIndex: i, isCalc: false }))
    ];
    
    console.log("題目池大小: " + gameState.questionPool.length);
    
    // 洗牌題目陣列
    shuffleArray(gameState.questionPool);
    
    // 設定起始題目索引
    gameState.p1.currentQuizIndex = 0;
    gameState.p2.currentQuizIndex = Math.floor(gameState.questionPool.length / 2);
    
    spawnMonster(1);
    spawnMonster(2);
    
    updateUI(1);
    updateUI(2);
    
    renderQuiz(1);
    renderQuiz(2);
    
    showScreen('screen-game');
    startTimer();
}

function startTimer() {
    clearInterval(gameState.timerInterval);
    updateTimerDisplay();
    
    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;
        updateTimerDisplay();
        
        if(gameState.timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const min = Math.floor(gameState.timeLeft / 60);
    const sec = gameState.timeLeft % 60;
    const timerText = `${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
    const timerEl = document.getElementById('timer');
    if (timerEl) timerEl.innerText = timerText;
}

// ============ 怪獸生成 ============
function spawnMonster(pId) {
    const p = pId === 1 ? gameState.p1 : gameState.p2;
    const monsterTemplate = MONSTER_TEMPLATES[Math.floor(Math.random() * MONSTER_TEMPLATES.length)];
    
    p.monsterName = monsterTemplate.name;
    p.monsterPic = monsterTemplate.pic;
    p.monsterHp = GAME_CONFIG.MONSTER_HP;
    
    const nameEl = document.getElementById(`p${pId}-m-name`);
    const picEl = document.getElementById(`p${pId}-monster-pic`);
    
    if (nameEl) nameEl.innerText = p.monsterName;
    if (picEl) picEl.innerText = p.monsterPic;
}

// ============ 題目渲染 ============
function renderQuiz(pId) {
    const p = pId === 1 ? gameState.p1 : gameState.p2;
    const item = gameState.questionPool[p.currentQuizIndex % gameState.questionPool.length];
    
    console.log(`玩家 ${pId} 題目:`, item);
    
    // 清除選擇
    p.selectedAnswer = -1;
    
    // 更新題目
    const quizEl = document.getElementById(`p${pId}-quiz`);
    if (quizEl) quizEl.innerText = item.q;
    
    // 更新答案選項
    const optionsContainer = document.getElementById(`p${pId}-options`);
    if (optionsContainer) {
        const buttons = optionsContainer.querySelectorAll('.ans-btn');
        
        buttons.forEach((btn, idx) => {
            // 顯示實際答案內容（數字或符號）
            btn.innerText = item.displayOptions[idx] || '';
            btn.classList.remove('selected');
            btn.disabled = false;
            
            // 根據題目類型調整按鈕樣式
            if (item.type === 'comp') {
                btn.style.fontSize = '28px'; // 符號比較大
            } else {
                btn.style.fontSize = '18px'; // 數字正常大小
            }
        });
    }
    
    p.currentQuestion = item;
}

// ============ 答案選擇 ============
function selectAnswer(pId, optionIndex) {
    console.log(`玩家 ${pId} 選擇選項 ${optionIndex}`);
    
    const p = pId === 1 ? gameState.p1 : gameState.p2;
    p.selectedAnswer = optionIndex;
    
    // 更新UI - 標示選中的選項
    const optionsContainer = document.getElementById(`p${pId}-options`);
    if (optionsContainer) {
        const buttons = optionsContainer.querySelectorAll('.ans-btn');
        buttons.forEach((btn, idx) => {
            if (idx === optionIndex) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
    }
}

function clearAnswer(pId) {
    console.log(`玩家 ${pId} 取消選擇`);
    
    const p = pId === 1 ? gameState.p1 : gameState.p2;
    p.selectedAnswer = -1;
    
    const optionsContainer = document.getElementById(`p${pId}-options`);
    if (optionsContainer) {
        const buttons = optionsContainer.querySelectorAll('.ans-btn');
        buttons.forEach(btn => btn.classList.remove('selected'));
    }
}

// ============ 答案檢查 ============
function checkAnswer(pId) {
    const p = pId === 1 ? gameState.p1 : gameState.p2;
    
    if (p.selectedAnswer === -1) {
        alert("請先選擇答案！");
        return;
    }
    
    const item = gameState.questionPool[p.currentQuizIndex % gameState.questionPool.length];
    const isCorrect = p.selectedAnswer === item.correct;
    
    console.log(`玩家 ${pId}: 答案 ${p.selectedAnswer}, 正確答案 ${item.correct}, 結果: ${isCorrect}`);
    
    if (isCorrect) {
        handleCorrectAnswer(pId);
    } else {
        handleWrongAnswer(pId);
    }
    
    // 進入下一題
    p.currentQuizIndex++;
    renderQuiz(pId);
    updateUI(pId);
}

function handleCorrectAnswer(pId) {
    const p = pId === 1 ? gameState.p1 : gameState.p2;
    
    p.correctCount++;
    p.combo++;
    p.score += 10 + (p.combo > 0 ? p.combo * 2 : 0);
    
    if (p.combo > p.maxCombo) p.maxCombo = p.combo;
    
    p.monsterHp -= GAME_CONFIG.CORRECT_DAMAGE;
    
    showHitEffect(pId);
    
    if (p.monsterHp <= 0) {
        p.kills++;
        spawnMonster(pId);
        p.combo = 0;
    }
    
    checkJobUpgrade(pId);
}

function handleWrongAnswer(pId) {
    const p = pId === 1 ? gameState.p1 : gameState.p2;
    
    p.combo = 0;
    p.hp -= GAME_CONFIG.WRONG_DAMAGE;
    
    showDamageEffect(pId);
    
    if (p.hp <= 0) {
        p.hp = 0;
    }
}

function checkJobUpgrade(pId) {
    const p = pId === 1 ? gameState.p1 : gameState.p2;
    const jobList = JOB_TEMPLATES[p.jobType];
    const jobLevel = Math.floor(p.correctCount / GAME_CONFIG.CORRECT_TO_UPGRADE);
    const newJobIndex = Math.min(jobLevel, jobList.length - 1);
    
    if (p.currentJob !== jobList[newJobIndex]) {
        p.currentJob = jobList[newJobIndex];
        const jobEl = document.getElementById(`p${pId}-job`);
        if (jobEl) jobEl.innerText = p.currentJob;
    }
}

// ============ 動效反饋 ============
function showHitEffect(pId) {
    const stage = document.getElementById(`p${pId}-stage`);
    if (stage) {
        stage.classList.add('heal');
        setTimeout(() => stage.classList.remove('heal'), 400);
    }
}

function showDamageEffect(pId) {
    const stage = document.getElementById(`p${pId}-stage`);
    if (stage) {
        stage.classList.add('hit');
        setTimeout(() => stage.classList.remove('hit'), 400);
    }
}

// ============ UI 更新 ============
function updateUI(pId) {
    const p = pId === 1 ? gameState.p1 : gameState.p2;
    
    const hpPercentage = Math.max(0, (p.hp / GAME_CONFIG.INITIAL_HP) * 100);
    const hpBar = document.getElementById(`p${pId}-hp`);
    if (hpBar) hpBar.style.width = hpPercentage + '%';
    
    const scoreEl = document.getElementById(`p${pId}-score`);
    if (scoreEl) scoreEl.innerText = p.score;
    
    const monsterHpPercentage = Math.max(0, (p.monsterHp / GAME_CONFIG.MONSTER_HP) * 100);
    const monsterHpBar = document.getElementById(`p${pId}-m-hp`);
    if (monsterHpBar) monsterHpBar.style.width = monsterHpPercentage + '%';
    
    const killsEl = document.getElementById(`p${pId}-kills`);
    if (killsEl) killsEl.innerText = p.kills;
    
    const comboBadge = document.getElementById(`p${pId}-combo`);
    if (comboBadge) {
        if (p.combo >= GAME_CONFIG.COMBO_THRESHOLD) {
            comboBadge.innerText = `${p.combo} Combo`;
            comboBadge.style.display = 'block';
        } else {
            comboBadge.style.display = 'none';
        }
    }
}

// ============ 遊戲結束 ============
function endGame() {
    clearInterval(gameState.timerInterval);
    
    const p1 = gameState.p1;
    const p2 = gameState.p2;
    
    let winnerText = "";
    let winnerCard = null;
    
    if (p1.kills > p2.kills) {
        winnerText = "🎉 玩家1 (騎士) 獲勝！ 🎉";
        winnerCard = document.getElementById('p1-card');
    } else if (p2.kills > p1.kills) {
        winnerText = "🎉 玩家2 (法師) 獲勝！ 🎉";
        winnerCard = document.getElementById('p2-card');
    } else {
        winnerText = "🤝 平手！ 🤝";
    }
    
    updateResultCard('p1', p1);
    updateResultCard('p2', p2);
    
    const winnerEl = document.getElementById('winner-text');
    if (winnerEl) winnerEl.innerText = winnerText;
    
    if (winnerCard) {
        winnerCard.classList.add('winner');
    }
    
    showScreen('screen-result');
}

function updateResultCard(pPrefix, p) {
    const killsEl = document.getElementById(`${pPrefix}-res-kills`);
    const jobEl = document.getElementById(`${pPrefix}-res-job`);
    const scoreEl = document.getElementById(`${pPrefix}-res-score`);
    
    if (killsEl) killsEl.innerText = p.kills;
    if (jobEl) jobEl.innerText = p.currentJob;
    if (scoreEl) scoreEl.innerText = p.score;
}

// ============ 工具函數 ============
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ============ 初始化 ============
console.log("遊戲已準備完成，題目池大小: " + CALCULATION_POOL.length + " 計算 + " + COMPARISON_POOL.length + " 比較");