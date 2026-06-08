// ============================================
// 小三數學大對戰 - 遊戲邏輯核心
// ============================================

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

// ============ 題目資料庫 (50題) ============
const ITEM_POOL = [
    // == 分數 (1-13) ==
    {q: "1/3 _ 1/2", a: "<"}, {q: "1/4 _ 1/5", a: ">"}, {q: "2/4 _ 1/2", a: "="}, {q: "3/7 _ 5/7", a: "<"},
    {q: "6/6 _ 1", a: "="}, {q: "4/9 _ 2/9", a: ">"}, {q: "1/8 _ 1/6", a: "<"}, {q: "5/5 _ 8/8", a: "="},
    {q: "3/5 _ 2/5", a: ">"}, {q: "7/10 _ 9/10", a: "<"}, {q: "1/10 _ 1/12", a: ">"}, {q: "4/4 _ 3/4", a: ">"}, {q: "2/6 _ 3/6", a: "<"},
    // == 重量 (14-25) ==
    {q: "1 kg _ 900 g", a: ">"}, {q: "500 g _ 1/2 kg", a: "="}, {q: "2000 g _ 2 kg", a: "="}, {q: "3 kg _ 3500 g", a: "<"},
    {q: "4050 g _ 4 kg", a: ">"}, {q: "6 kg _ 600 g", a: ">"}, {q: "1 kg 200 g _ 1200 g", a: "="}, {q: "800 g _ 1 kg", a: "<"},
    {q: "7 kg _ 7000 g", a: "="}, {q: "2 kg 50 g _ 2500 g", a: "<"}, {q: "990 g _ 1 kg", a: "<"}, {q: "300 g + 700 g _ 1 kg", a: "="},
    // == 容量 (26-38) ==
    {q: "1 L _ 850 mL", a: ">"}, {q: "2000 mL _ 2 L", a: "="}, {q: "500 mL _ 1 L", a: "<"}, {q: "1 L 500 mL _ 1500 mL", a: "="},
    {q: "3 L _ 3050 mL", a: "<"}, {q: "4 L _ 400 mL", a: ">"}, {q: "750 mL _ 75 L", a: "<"}, {q: "6000 mL _ 6 L", a: "="},
    {q: "1 L 20 mL _ 1200 mL", a: "<"}, {q: "900 mL _ 1 L", a: "<"}, {q: "2 L 400 mL _ 2400 mL", a: "="}, {q: "5 L _ 4900 mL", a: ">"}, {q: "1500 mL _ 1 L", a: ">"},
    // == 長度 (39-50) ==
    {q: "1 m _ 99 cm", a: ">"}, {q: "200 cm _ 2 m", a: "="}, {q: "3 m _ 350 cm", a: "<"}, {q: "4 m 5 cm _ 450 cm", a: "<"},
    {q: "600 cm _ 6 m", a: "="}, {q: "8 m _ 80 cm", a: ">"}, {q: "1 m 20 cm _ 120 cm", a: "="}, {q: "50 cm _ 5 m", a: "<"},
    {q: "7 m 80 cm _ 708 cm", a: ">"}, {q: "900 cm _ 9 m", a: "="}, {q: "150 cm _ 1 m", a: ">"}, {q: "3 m 40 cm _ 340 cm", a: "="}
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
    itemPoolCopy: [...ITEM_POOL]
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
        selectedOp: "",
        currentQuizIndex: 0,
        monsterHp: GAME_CONFIG.MONSTER_HP,
        monsterName: "",
        monsterPic: "",
        isDamaged: false
    };
}

// ============ 畫面導航 ============
/**
 * 顯示指定的遊戲畫面
 * @param {string} screenId - 要顯示的畫面ID
 */
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    
    const timerElement = document.getElementById('timer');
    timerElement.style.display = screenId === 'screen-game' ? 'block' : 'none';
}

/**
 * 返回主菜單
 */
function goHome() {
    clearInterval(gameState.timerInterval);
    showScreen('screen-start');
}

// ============ 全屏控制 ============
/**
 * 切換全屏模式
 */
function toggleFullscreen() {
    const btn = document.getElementById('btn-fullscreen');
    
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            alert(`無法切換全屏: ${err.message}`);
        });
        btn.innerText = "退出全屏";
    } else {
        document.exitFullscreen();
        btn.innerText = "全屏顯示";
    }
}

// ============ 遊戲流程控制 ============
/**
 * 開始新遊戲
 */
function startGame() {
    gameState.p1 = initPlayer(1);
    gameState.p2 = initPlayer(2);
    gameState.timeLeft = GAME_CONFIG.GAME_DURATION;
    gameState.itemPoolCopy = [...ITEM_POOL];
    
    // 洗牌題目陣列
    shuffleArray(gameState.itemPoolCopy);
    
    // 設定起始題目索引
    gameState.p1.currentQuizIndex = 0;
    gameState.p2.currentQuizIndex = Math.floor(gameState.itemPoolCopy.length / 2);
    
    spawnMonster(1);
    spawnMonster(2);
    
    updateUI(1);
    updateUI(2);
    
    renderQuiz(1);
    renderQuiz(2);
    
    showScreen('screen-game');
    startTimer();
}

/**
 * 啟動倒數計時器
 */
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

/**
 * 更新計時器顯示
 */
function updateTimerDisplay() {
    const min = Math.floor(gameState.timeLeft / 60);
    const sec = gameState.timeLeft % 60;
    const timerText = `${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
    document.getElementById('timer').innerText = timerText;
}

// ============ 怪獸生成 ============
/**
 * 為玩家生成新的怪獸
 * @param {number} pId - 玩家ID (1或2)
 */
function spawnMonster(pId) {
    const p = pId === 1 ? gameState.p1 : gameState.p2;
    const monsterTemplate = MONSTER_TEMPLATES[Math.floor(Math.random() * MONSTER_TEMPLATES.length)];
    
    p.monsterName = monsterTemplate.name;
    p.monsterPic = monsterTemplate.pic;
    p.monsterHp = GAME_CONFIG.MONSTER_HP;
    
    document.getElementById(`p${pId}-m-name`).innerText = p.monsterName;
    document.getElementById(`p${pId}-monster-pic`).innerText = p.monsterPic;
}

// ============ 題目渲染 ============
/**
 * 渲染題目到UI
 * @param {number} pId - 玩家ID
 */
function renderQuiz(pId) {
    const p = pId === 1 ? gameState.p1 : gameState.p2;
    const item = gameState.itemPoolCopy[p.currentQuizIndex % gameState.itemPoolCopy.length];
    
    const parts = item.q.split('_');
    const quizHtml = `${parts[0]} <span class="slot" id="p${pId}-slot">_</span> ${parts[1]}`;
    document.getElementById(`p${pId}-quiz`).innerHTML = quizHtml;
    
    p.selectedOp = "";
    updateOperatorDisplay(pId);
}

// ============ 運算符輸入 ============
/**
 * 玩家輸入運算符
 * @param {number} pId - 玩家ID
 * @param {string} op - 運算符 ('>', '<', '=')
 */
function inputOp(pId, op) {
    const p = pId === 1 ? gameState.p1 : gameState.p2;
    p.selectedOp = op;
    updateOperatorDisplay(pId);
}

/**
 * 清除輸入
 * @param {number} pId - 玩家ID
 */
function clearOp(pId) {
    const p = pId === 1 ? gameState.p1 : gameState.p2;
    p.selectedOp = "";
    updateOperatorDisplay(pId);
}

/**
 * 更新運算符顯示
 * @param {number} pId - 玩家ID
 */
function updateOperatorDisplay(pId) {
    const p = pId === 1 ? gameState.p1 : gameState.p2;
    const slotElement = document.getElementById(`p${pId}-slot`);
    slotElement.innerText = p.selectedOp || "_";
}

// ============ 答案檢查 ============
/**
 * 檢查玩家答案
 * @param {number} pId - 玩家ID
 */
function checkAnswer(pId) {
    const p = pId === 1 ? gameState.p1 : gameState.p2;
    
    // 如果未輸入答案
    if (!p.selectedOp) {
        alert("請先選擇答案！");
        return;
    }
    
    // 獲取當前題目
    const item = gameState.itemPoolCopy[p.currentQuizIndex % gameState.itemPoolCopy.length];
    const isCorrect = p.selectedOp === item.a;
    
    // 處理正確/錯誤
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

/**
 * 處理正確答案
 * @param {number} pId - 玩家ID
 */
function handleCorrectAnswer(pId) {
    const p = pId === 1 ? gameState.p1 : gameState.p2;
    
    p.correctCount++;
    p.combo++;
    p.score += 10 + (p.combo > 0 ? p.combo * 2 : 0); // 基分+Combo加成
    
    if (p.combo > p.maxCombo) p.maxCombo = p.combo;
    
    // 攻擊怪獸
    p.monsterHp -= GAME_CONFIG.CORRECT_DAMAGE;
    
    // 顯示動效
    showHitEffect(pId);
    
    // 檢查怪獸是否被擊敗
    if (p.monsterHp <= 0) {
        p.kills++;
        spawnMonster(pId);
        p.combo = 0; // 重置 combo
    }
    
    // 檢查職業升級
    checkJobUpgrade(pId);
}

/**
 * 處理錯誤答案
 * @param {number} pId - 玩家ID
 */
function handleWrongAnswer(pId) {
    const p = pId === 1 ? gameState.p1 : gameState.p2;
    
    p.combo = 0; // 重置 combo
    p.hp -= GAME_CONFIG.WRONG_DAMAGE;
    
    // 顯示被攻擊效果
    showDamageEffect(pId);
    
    // 檢查遊戲是否結束（HP <= 0）
    if (p.hp <= 0) {
        p.hp = 0;
    }
}

/**
 * 檢查職業升級
 * @param {number} pId - 玩家ID
 */
function checkJobUpgrade(pId) {
    const p = pId === 1 ? gameState.p1 : gameState.p2;
    const jobList = JOB_TEMPLATES[p.jobType];
    const jobLevel = Math.floor(p.correctCount / GAME_CONFIG.CORRECT_TO_UPGRADE);
    const newJobIndex = Math.min(jobLevel, jobList.length - 1);
    
    if (p.currentJob !== jobList[newJobIndex]) {
        p.currentJob = jobList[newJobIndex];
        document.getElementById(`p${pId}-job`).innerText = p.currentJob;
    }
}

// ============ 動效反饋 ============
/**
 * 顯示命中動效
 * @param {number} pId - 玩家ID
 */
function showHitEffect(pId) {
    const stage = document.getElementById(`p${pId}-stage`);
    stage.classList.add('heal');
    setTimeout(() => stage.classList.remove('heal'), 400);
}

/**
 * 顯示被傷害動效
 * @param {number} pId - 玩家ID
 */
function showDamageEffect(pId) {
    const stage = document.getElementById(`p${pId}-stage`);
    stage.classList.add('hit');
    setTimeout(() => stage.classList.remove('hit'), 400);
}

// ============ UI 更新 ============
/**
 * 更新玩家UI
 * @param {number} pId - 玩家ID
 */
function updateUI(pId) {
    const p = pId === 1 ? gameState.p1 : gameState.p2;
    
    // 更新 HP 條
    const hpPercentage = Math.max(0, (p.hp / GAME_CONFIG.INITIAL_HP) * 100);
    document.getElementById(`p${pId}-hp`).style.width = hpPercentage + '%';
    
    // 更新分數
    document.getElementById(`p${pId}-score`).innerText = p.score;
    
    // 更新怪獸 HP 條
    const monsterHpPercentage = Math.max(0, (p.monsterHp / GAME_CONFIG.MONSTER_HP) * 100);
    document.getElementById(`p${pId}-m-hp`).style.width = monsterHpPercentage + '%';
    
    // 更新擊敗數
    document.getElementById(`p${pId}-kills`).innerText = p.kills;
    
    // 更新 Combo 顯示
    const comboBadge = document.getElementById(`p${pId}-combo`);
    if (p.combo >= GAME_CONFIG.COMBO_THRESHOLD) {
        comboBadge.innerText = `${p.combo} Combo`;
        comboBadge.style.display = 'block';
    } else {
        comboBadge.style.display = 'none';
    }
}

// ============ 遊戲結束 ============
/**
 * 結束遊戲並顯示結果
 */
function endGame() {
    clearInterval(gameState.timerInterval);
    
    const p1 = gameState.p1;
    const p2 = gameState.p2;
    
    // 確定勝者
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
    
    // 更新結果卡
    updateResultCard('p1', p1);
    updateResultCard('p2', p2);
    
    document.getElementById('winner-text').innerText = winnerText;
    
    if (winnerCard) {
        winnerCard.classList.add('winner');
    }
    
    showScreen('screen-result');
}

/**
 * 更新結果卡的內容
 * @param {string} pPrefix - 玩家前綴 ('p1' 或 'p2')
 * @param {object} p - 玩家對象
 */
function updateResultCard(pPrefix, p) {
    document.getElementById(`${pPrefix}-res-kills`).innerText = p.kills;
    document.getElementById(`${pPrefix}-res-job`).innerText = p.currentJob;
    document.getElementById(`${pPrefix}-res-score`).innerText = p.score;
}

// ============ 工具函數 ============
/**
 * Fisher-Yates 洗牌算法
 * @param {array} array - 要洗牌的陣列
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
