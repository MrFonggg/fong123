// ============================================
// 小三數學大對戰 - 遊戲邏輯核心 (150題版)
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
            displayOptions: shuffled.map(opt => opt.toString()) // 顯示數字
        });
    }
    
    return questions;
}

// ============ 比較題資料庫 (50題補充) ============
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
    
    // == 補充更多比較題 ==\n    {q: \"2 kg _ 1500 g\", options: [\"<\", \">\", \"=\"], correct: 1, type: 'comp', displayOptions: [\"<\", \">\", \"=\"]},\n    {q: \"3000 mL _ 3 L\", options: [\"<\", \">\", \"=\"], correct: 2, type: 'comp', displayOptions: [\"<\", \">\", \"=\"]},\n    {q: \"250 cm _ 2 m 50 cm\", options: [\"<\", \">\", \"=\"], correct: 2, type: 'comp', displayOptions: [\"<\", \">\", \"=\"]},\n    {q: \"1/2 _ 3/6\", options: [\"<\", \">\", \"=\"], correct: 2, type: 'comp', displayOptions: [\"<\", \">\", \"=\"]},\n    {q: \"2 kg 500 g _ 2500 g\", options: [\"<\", \">\", \"=\"], correct: 2, type: 'comp', displayOptions: [\"<\", \">\", \"=\"]},\n    {q: \"1500 mL _ 1 L 500 mL\", options: [\"<\", \">\", \"=\"], correct: 2, type: 'comp', displayOptions: [\"<\", \">\", \"=\"]}\n];\n\n// ============ 怪獸模板 ============\nconst MONSTER_TEMPLATES = [\n    {name: \"綠色史萊姆\", pic: \"🌱\"}, {name: \"淘氣小蝙蝠\", pic: \"🦇\"}, {name: \"迷你骷髏兵\", pic: \"💀\"},\n    {name: \"紅帽小火精\", pic: \"🔥\"}, {name: \"石頭怪人\", pic: \"🗿\"}, {name: \"冰晶巨怪\", pic: \"❄️\"},\n    {name: \"雙頭魔龍\", pic: \"🐲\"}\n];\n\n// ============ 職業升級系統 ============\nconst JOB_TEMPLATES = {\n    knight: [\n        \"見習騎士\", \"初級騎士\", \"中級騎士\", \"高級騎士\", \"主宰騎士\", \"傳奇聖騎士\"\n    ],\n    mage: [\n        \"見習法師\", \"初級法師\", \"中級法師\", \"高級法師\", \"主宰法師\", \"傳奇大魔導師\"\n    ]\n};\n\n// ============ 遊戲狀態 ============\nlet gameState = {\n    timerInterval: null,\n    timeLeft: GAME_CONFIG.GAME_DURATION,\n    p1: {},\n    p2: {},\n    questionPool: [], // 混合題目池\n    questionTypePool: [] // 題目類型池\n};\n\n// ============ 初始化玩家 ============\nfunction initPlayer(id) {\n    const jobType = id === 1 ? 'knight' : 'mage';\n    return {\n        hp: GAME_CONFIG.INITIAL_HP,\n        score: 0,\n        combo: 0,\n        maxCombo: 0,\n        kills: 0,\n        correctCount: 0,\n        currentJob: JOB_TEMPLATES[jobType][0],\n        jobType: jobType,\n        selectedAnswer: -1,\n        currentQuizIndex: 0,\n        monsterHp: GAME_CONFIG.MONSTER_HP,\n        monsterName: \"\",\n        monsterPic: \"\",\n        isDamaged: false\n    };\n}\n\n// ============ 畫面導航 ============\nfunction showScreen(screenId) {\n    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));\n    document.getElementById(screenId).classList.add('active');\n    \n    const timerElement = document.getElementById('timer');\n    timerElement.style.display = screenId === 'screen-game' ? 'block' : 'none';\n}\n\nfunction goHome() {\n    clearInterval(gameState.timerInterval);\n    showScreen('screen-start');\n}\n\n// ============ 全屏控制 ============\nfunction toggleFullscreen() {\n    const btn = document.getElementById('btn-fullscreen');\n    \n    if (!document.fullscreenElement) {\n        document.documentElement.requestFullscreen().catch(err => {\n            alert(`無法切換全屏: ${err.message}`);\n        });\n        btn.innerText = \"退出全屏\";\n    } else {\n        document.exitFullscreen();\n        btn.innerText = \"全屏顯示\";\n    }\n}\n\n// ============ 遊戲流程控制 ============\nfunction startGame() {\n    gameState.p1 = initPlayer(1);\n    gameState.p2 = initPlayer(2);\n    gameState.timeLeft = GAME_CONFIG.GAME_DURATION;\n    \n    // 建立混合題目池 (100計算題 + 56比較題)\n    gameState.questionPool = [\n        ...CALCULATION_POOL.map((q, i) => ({ ...q, poolIndex: i, isCalc: true })),\n        ...COMPARISON_POOL.map((q, i) => ({ ...q, poolIndex: i, isCalc: false }))\n    ];\n    \n    // 洗牌題目陣列\n    shuffleArray(gameState.questionPool);\n    \n    // 設定起始題目索引\n    gameState.p1.currentQuizIndex = 0;\n    gameState.p2.currentQuizIndex = Math.floor(gameState.questionPool.length / 2);\n    \n    spawnMonster(1);\n    spawnMonster(2);\n    \n    updateUI(1);\n    updateUI(2);\n    \n    renderQuiz(1);\n    renderQuiz(2);\n    \n    showScreen('screen-game');\n    startTimer();\n}\n\nfunction startTimer() {\n    clearInterval(gameState.timerInterval);\n    updateTimerDisplay();\n    \n    gameState.timerInterval = setInterval(() => {\n        gameState.timeLeft--;\n        updateTimerDisplay();\n        \n        if(gameState.timeLeft <= 0) {\n            endGame();\n        }\n    }, 1000);\n}\n\nfunction updateTimerDisplay() {\n    const min = Math.floor(gameState.timeLeft / 60);\n    const sec = gameState.timeLeft % 60;\n    const timerText = `${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;\n    document.getElementById('timer').innerText = timerText;\n}\n\n// ============ 怪獸生成 ============\nfunction spawnMonster(pId) {\n    const p = pId === 1 ? gameState.p1 : gameState.p2;\n    const monsterTemplate = MONSTER_TEMPLATES[Math.floor(Math.random() * MONSTER_TEMPLATES.length)];\n    \n    p.monsterName = monsterTemplate.name;\n    p.monsterPic = monsterTemplate.pic;\n    p.monsterHp = GAME_CONFIG.MONSTER_HP;\n    \n    document.getElementById(`p${pId}-m-name`).innerText = p.monsterName;\n    document.getElementById(`p${pId}-monster-pic`).innerText = p.monsterPic;\n}\n\n// ============ 題目渲染 (核心修改) ============\nfunction renderQuiz(pId) {\n    const p = pId === 1 ? gameState.p1 : gameState.p2;\n    const item = gameState.questionPool[p.currentQuizIndex % gameState.questionPool.length];\n    \n    // 清除選擇\n    p.selectedAnswer = -1;\n    \n    // 更新題目\n    document.getElementById(`p${pId}-quiz`).innerText = item.q;\n    \n    // 更新答案選項 - 根據題目類型顯示不同內容\n    const optionsContainer = document.getElementById(`p${pId}-options`);\n    const buttons = optionsContainer.querySelectorAll('.ans-btn');\n    \n    buttons.forEach((btn, idx) => {\n        // 顯示實際答案內容（數字或符號）\n        btn.innerText = item.displayOptions[idx] || '';\n        btn.classList.remove('selected');\n        btn.disabled = false;\n        \n        // 根據題目類型調整按鈕樣式\n        if (item.type === 'comp') {\n            btn.style.fontSize = '28px'; // 符號比較大\n            btn.style.fontWeight = 'bold';\n        } else {\n            btn.style.fontSize = '18px'; // 數字正常大小\n            btn.style.fontWeight = 'bold';\n        }\n    });\n    \n    p.currentQuestion = item;\n}\n\n// ============ 答案選擇 ============\nfunction selectAnswer(pId, optionIndex) {\n    const p = pId === 1 ? gameState.p1 : gameState.p2;\n    p.selectedAnswer = optionIndex;\n    \n    // 更新UI - 標示選中的選項\n    const optionsContainer = document.getElementById(`p${pId}-options`);\n    const buttons = optionsContainer.querySelectorAll('.ans-btn');\n    buttons.forEach((btn, idx) => {\n        if (idx === optionIndex) {\n            btn.classList.add('selected');\n        } else {\n            btn.classList.remove('selected');\n        }\n    });\n}\n\nfunction clearAnswer(pId) {\n    const p = pId === 1 ? gameState.p1 : gameState.p2;\n    p.selectedAnswer = -1;\n    \n    const optionsContainer = document.getElementById(`p${pId}-options`);\n    const buttons = optionsContainer.querySelectorAll('.ans-btn');\n    buttons.forEach(btn => btn.classList.remove('selected'));\n}\n\n// ============ 答案檢查 ============\nfunction checkAnswer(pId) {\n    const p = pId === 1 ? gameState.p1 : gameState.p2;\n    \n    if (p.selectedAnswer === -1) {\n        alert(\"請先選擇答案！\");\n        return;\n    }\n    \n    const item = gameState.questionPool[p.currentQuizIndex % gameState.questionPool.length];\n    const isCorrect = p.selectedAnswer === item.correct;\n    \n    if (isCorrect) {\n        handleCorrectAnswer(pId);\n    } else {\n        handleWrongAnswer(pId);\n    }\n    \n    // 進入下一題\n    p.currentQuizIndex++;\n    renderQuiz(pId);\n    updateUI(pId);\n}\n\nfunction handleCorrectAnswer(pId) {\n    const p = pId === 1 ? gameState.p1 : gameState.p2;\n    \n    p.correctCount++;\n    p.combo++;\n    p.score += 10 + (p.combo > 0 ? p.combo * 2 : 0);\n    \n    if (p.combo > p.maxCombo) p.maxCombo = p.combo;\n    \n    p.monsterHp -= GAME_CONFIG.CORRECT_DAMAGE;\n    \n    showHitEffect(pId);\n    \n    if (p.monsterHp <= 0) {\n        p.kills++;\n        spawnMonster(pId);\n        p.combo = 0;\n    }\n    \n    checkJobUpgrade(pId);\n}\n\nfunction handleWrongAnswer(pId) {\n    const p = pId === 1 ? gameState.p1 : gameState.p2;\n    \n    p.combo = 0;\n    p.hp -= GAME_CONFIG.WRONG_DAMAGE;\n    \n    showDamageEffect(pId);\n    \n    if (p.hp <= 0) {\n        p.hp = 0;\n    }\n}\n\nfunction checkJobUpgrade(pId) {\n    const p = pId === 1 ? gameState.p1 : gameState.p2;\n    const jobList = JOB_TEMPLATES[p.jobType];\n    const jobLevel = Math.floor(p.correctCount / GAME_CONFIG.CORRECT_TO_UPGRADE);\n    const newJobIndex = Math.min(jobLevel, jobList.length - 1);\n    \n    if (p.currentJob !== jobList[newJobIndex]) {\n        p.currentJob = jobList[newJobIndex];\n        document.getElementById(`p${pId}-job`).innerText = p.currentJob;\n    }\n}\n\n// ============ 動效反饋 ============\nfunction showHitEffect(pId) {\n    const stage = document.getElementById(`p${pId}-stage`);\n    stage.classList.add('heal');\n    setTimeout(() => stage.classList.remove('heal'), 400);\n}\n\nfunction showDamageEffect(pId) {\n    const stage = document.getElementById(`p${pId}-stage`);\n    stage.classList.add('hit');\n    setTimeout(() => stage.classList.remove('hit'), 400);\n}\n\n// ============ UI 更新 ============\nfunction updateUI(pId) {\n    const p = pId === 1 ? gameState.p1 : gameState.p2;\n    \n    const hpPercentage = Math.max(0, (p.hp / GAME_CONFIG.INITIAL_HP) * 100);\n    document.getElementById(`p${pId}-hp`).style.width = hpPercentage + '%';\n    \n    document.getElementById(`p${pId}-score`).innerText = p.score;\n    \n    const monsterHpPercentage = Math.max(0, (p.monsterHp / GAME_CONFIG.MONSTER_HP) * 100);\n    document.getElementById(`p${pId}-m-hp`).style.width = monsterHpPercentage + '%';\n    \n    document.getElementById(`p${pId}-kills`).innerText = p.kills;\n    \n    const comboBadge = document.getElementById(`p${pId}-combo`);\n    if (p.combo >= GAME_CONFIG.COMBO_THRESHOLD) {\n        comboBadge.innerText = `${p.combo} Combo`;\n        comboBadge.style.display = 'block';\n    } else {\n        comboBadge.style.display = 'none';\n    }\n}\n\n// ============ 遊戲結束 ============\nfunction endGame() {\n    clearInterval(gameState.timerInterval);\n    \n    const p1 = gameState.p1;\n    const p2 = gameState.p2;\n    \n    let winnerText = \"\";\n    let winnerCard = null;\n    \n    if (p1.kills > p2.kills) {\n        winnerText = \"🎉 玩家1 (騎士) 獲勝！ 🎉\";\n        winnerCard = document.getElementById('p1-card');\n    } else if (p2.kills > p1.kills) {\n        winnerText = \"🎉 玩家2 (法師) 獲勝！ 🎉\";\n        winnerCard = document.getElementById('p2-card');\n    } else {\n        winnerText = \"🤝 平手！ 🤝\";\n    }\n    \n    updateResultCard('p1', p1);\n    updateResultCard('p2', p2);\n    \n    document.getElementById('winner-text').innerText = winnerText;\n    \n    if (winnerCard) {\n        winnerCard.classList.add('winner');\n    }\n    \n    showScreen('screen-result');\n}\n\nfunction updateResultCard(pPrefix, p) {\n    document.getElementById(`${pPrefix}-res-kills`).innerText = p.kills;\n    document.getElementById(`${pPrefix}-res-job`).innerText = p.currentJob;\n    document.getElementById(`${pPrefix}-res-score`).innerText = p.score;\n}\n\n// ============ 工具函數 ============\nfunction shuffleArray(array) {\n    for (let i = array.length - 1; i > 0; i--) {\n        const j = Math.floor(Math.random() * (i + 1));\n        [array[i], array[j]] = [array[j], array[i]];\n    }\n    return array;\n}