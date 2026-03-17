// ============================================================
// MUSIC
// ============================================================
const bgMusic  = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
bgMusic.volume = 0.4;
let musicOn    = false;

musicBtn.addEventListener('click', () => {
    if (!musicOn) {
        bgMusic.play().then(() => {
            musicOn = true;
            musicBtn.textContent = '🔊';
            musicBtn.classList.add('playing');
        }).catch(() => {});
    } else {
        bgMusic.pause();
        musicOn = false;
        musicBtn.textContent = '🎵';
        musicBtn.classList.remove('playing');
    }
});

// ============================================================
// PAGE SWITCHER
// ============================================================
function goToPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active', 'slide-in'));
    const next = document.getElementById(id);
    next.classList.add('active', 'slide-in');
}

// ============================================================
// SOUND UTILS
// ============================================================
function beep(freq1, freq2, type = 'sine', vol = 0.25) {
    try {
        const ctx  = new (window.AudioContext || window.webkitAudioContext)();
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(freq1, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq2, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start(); osc.stop(ctx.currentTime + 0.15);
    } catch(e) {}
}

// ============================================================
// CONFETTI
// ============================================================
const confettiColors = ['#ff6eb4','#ffe066','#c77dff','#72efdd','#ff9a8b','#fff','#ffaa00'];

function launchConfetti() {
    for (let i = 0; i < 130; i++) {
        setTimeout(() => {
            const c = document.createElement('div');
            c.className = 'confetti-piece';
            c.style.left              = Math.random() * 100 + 'vw';
            c.style.backgroundColor   = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            c.style.width             = (Math.random() * 8 + 5) + 'px';
            c.style.height            = (Math.random() * 8 + 5) + 'px';
            c.style.borderRadius      = Math.random() > 0.5 ? '50%' : '2px';
            c.style.animationDuration = (Math.random() * 2 + 2) + 's';
            document.body.appendChild(c);
            setTimeout(() => c.remove(), 4000);
        }, i * 18);
    }
}

// ============================================================
// PAGE 1 — CATCHING GAME
// ============================================================
const gameContainer = document.getElementById('gameContainer');
const scoreDisplay  = document.getElementById('scoreDisplay');
const p1message     = document.getElementById('p1message');
const retryBtn      = document.getElementById('retryBtn');
const toTTTBtn      = document.getElementById('toTTTBtn');
const timerDisplay  = document.getElementById('timerDisplay');
const timerPill     = document.getElementById('timerPill');
const progressBar   = document.getElementById('progressBar');

let catchScore    = 0;
const catchTarget = 24;
let catchTimeLeft = 30;
let gameInterval, timerInterval;
let catchActive   = false;

const birthdayItems = ['🎂','🎉','🎈','⭐','🎁','🪅','🍰','🥳'];

// Sound pop via Howler + fallback
let popSound = null;
try {
    popSound = new Howl({
        src: ['https://assets.mixkit.co/sfx/preview/mixkit-bubble-pop-up-alert-notification-2357.mp3'],
        volume: 1.0,
        onloaderror: () => { popSound = null; }
    });
} catch(e) { popSound = null; }

function playPop() {
    if (popSound && popSound.state() === 'loaded') popSound.play();
    else beep(600, 200, 'sine', 0.3);
}

function startCatchGame() {
    catchScore    = 0;
    catchTimeLeft = 30;
    catchActive   = true;

    scoreDisplay.textContent = 0;
    timerDisplay.textContent = 30;
    timerPill.classList.remove('danger');
    progressBar.style.width = '0%';
    p1message.textContent   = '';
    retryBtn.style.display  = 'none';
    toTTTBtn.style.display  = 'none';
    gameContainer.innerHTML = '';

    clearInterval(gameInterval);
    clearInterval(timerInterval);

    gameInterval  = setInterval(createItem, 700);
    timerInterval = setInterval(() => {
        catchTimeLeft--;
        timerDisplay.textContent = catchTimeLeft;
        if (catchTimeLeft <= 10) timerPill.classList.add('danger');
        if (catchTimeLeft <= 0)  endCatchGame(false);
    }, 1000);
}

function createItem() {
    if (!catchActive) return;

    const item = document.createElement('div');
    item.classList.add('item');
    item.textContent = birthdayItems[Math.floor(Math.random() * birthdayItems.length)];
    item.style.left  = Math.random() * 85 + '%';
    item.style.animationDuration = (Math.random() * 2 + 3) + 's';

    item.addEventListener('click', () => {
        if (!catchActive) return;

        catchScore++;
        scoreDisplay.textContent = catchScore;
        progressBar.style.width  = (catchScore / catchTarget * 100) + '%';
        playPop();
        item.classList.add('clicked');

        // +1 floating text
        const pop = document.createElement('div');
        pop.className   = 'score-pop';
        pop.textContent = '+1 🌟';
        pop.style.left  = item.style.left;
        pop.style.top   = item.offsetTop + 'px';
        gameContainer.appendChild(pop);
        setTimeout(() => pop.remove(), 800);
        setTimeout(() => item.remove(), 300);

        if (catchScore >= catchTarget) endCatchGame(true);
    });

    gameContainer.appendChild(item);
    const dur = parseFloat(item.style.animationDuration) * 1000;
    setTimeout(() => { if (item.parentNode) item.remove(); }, dur + 100);
}

function endCatchGame(win) {
    catchActive = false;
    clearInterval(gameInterval);
    clearInterval(timerInterval);

    if (win) {
        p1message.textContent   = 'Birthday energy unlocked!';
        toTTTBtn.style.display  = 'inline-block';
        progressBar.style.width = '100%';
        launchConfetti();
    } else {
        p1message.textContent  = 'Almost! Try again';
        retryBtn.style.display = 'inline-block';
    }
}

retryBtn.addEventListener('click', startCatchGame);
toTTTBtn.addEventListener('click', () => {
    goToPage('page2');
    resetTTT();
});

// Auto start catching game
startCatchGame();

// ============================================================
// PAGE 2 — TIC-TAC-TOE
// ============================================================
const SYMBOLS    = { X: '🦓', O: '👹' };
const HUMAN      = 'X';
const AI         = 'O';
const WIN_COMBOS = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

let tttBoard   = Array(9).fill(null);
let tttOver    = false;
let tttScores  = { X: 0, O: 0 };
let aiThinking = false;

const cells         = document.querySelectorAll('.cell');
const p2message     = document.getElementById('p2message');
const turnIndicator = document.getElementById('turnIndicator');
const scoreXEl      = document.getElementById('scoreX');
const scoreOEl      = document.getElementById('scoreO');
const cardX         = document.getElementById('cardX');
const cardO         = document.getElementById('cardO');
const tttRestartBtn = document.getElementById('tttRestartBtn');
const nextPageBtn   = document.getElementById('nextPageBtn');
const tttBoardEl    = document.getElementById('tttBoard');

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const i = parseInt(cell.dataset.i);
        if (tttOver || tttBoard[i] || aiThinking) return;

        tttPlace(i, HUMAN);
        beep(520, 260, 'sine');

        if (tttCheckEnd()) return;

        // AI giliran dengan delay
        aiThinking = true;
        updateTurnUI();
        setTimeout(() => {
            tttPlace(getAIMove(), AI);
            beep(300, 500, 'triangle', 0.18);
            aiThinking = false;
            tttCheckEnd();
        }, 500);
    });
});

function tttPlace(i, player) {
    tttBoard[i] = player;
    const cell  = cells[i];
    cell.classList.add('taken', player === HUMAN ? 'x-cell' : 'o-cell');
    const mark = document.createElement('span');
    mark.className   = 'cell-mark';
    mark.textContent = SYMBOLS[player];
    cell.appendChild(mark);
}

function tttCheckEnd() {
    const result = tttWinner();
    if (result) {
        result.combo.forEach(i => cells[i].classList.add('win-cell'));
        tttScores[result.player]++;
        scoreXEl.textContent = tttScores.X;
        scoreOEl.textContent = tttScores.O;

        if (result.player === HUMAN) {
            p2message.textContent     = 'Kamu Menang! Luar biasa!';
            turnIndicator.textContent = 'Kamu juara!';
            nextPageBtn.style.display = 'inline-block';
            launchConfetti();
        } else {
            p2message.textContent     = 'Bahlil Menang! Coba lagi~';
            turnIndicator.textContent = 'Bahlil menang!';
        }
        tttOver = true;
        return true;
    }

    if (tttBoard.every(v => v)) {
        p2message.textContent     = 'Seri! Pertandingan ketat!';
        turnIndicator.textContent = 'Draw!';
        tttOver = true;
        tttBoardEl.style.animation = 'none';
        tttBoardEl.offsetHeight; // reflow trigger
        tttBoardEl.style.animation = 'shake 0.5s ease';
        setTimeout(() => tttBoardEl.style.animation = '', 600);
        return true;
    }

    if (!tttOver) updateTurnUI();
    return false;
}

function tttWinner(b = tttBoard) {
    for (const combo of WIN_COMBOS) {
        const [a, c, d] = combo;
        if (b[a] && b[a] === b[c] && b[a] === b[d]) return { player: b[a], combo };
    }
    return null;
}

function updateTurnUI() {
    const isHuman = !aiThinking && !tttOver;
    turnIndicator.textContent = aiThinking ? '👹 Bahlil sedang berpikir...' : '🦓 Giliran Kamu!';
    cardX.classList.toggle('active', isHuman);
    cardO.classList.toggle('active', aiThinking);
}

// AI setengah pintar 😄
function getAIMove() {
    const empty = tttBoard.map((v, i) => v ? null : i).filter(i => i !== null);

    // 50% random total
    if (Math.random() < 0.5) return empty[Math.floor(Math.random() * empty.length)];

    // Cek bisa menang langsung
    for (const i of empty) {
        tttBoard[i] = AI;
        if (tttWinner()) { tttBoard[i] = null; return i; }
        tttBoard[i] = null;
    }

    // Blok player (hanya 60% dilakukan)
    if (Math.random() < 0.6) {
        for (const i of empty) {
            tttBoard[i] = HUMAN;
            if (tttWinner()) { tttBoard[i] = null; return i; }
            tttBoard[i] = null;
        }
    }

    // Sisanya random
    return empty[Math.floor(Math.random() * empty.length)];
}

function resetTTT() {
    tttBoard   = Array(9).fill(null);
    tttOver    = false;
    aiThinking = false;
    p2message.textContent     = '';
    nextPageBtn.style.display = 'none';
    cells.forEach(cell => { cell.className = 'cell'; cell.innerHTML = ''; });
    updateTurnUI();
}

tttRestartBtn.addEventListener('click', resetTTT);

nextPageBtn.addEventListener('click', () => {
    goToPage('page3');
    resetRPS();
});

// ============================================================
// PAGE 3 — KERTAS GUNTING BATU vs BAHLIL 👹
// ============================================================
const RPS_CHOICES  = ['rock', 'paper', 'scissors'];
const RPS_EMOJI    = { rock: '✊', paper: '✋', scissors: '✌️' };
const RPS_LABEL    = { rock: 'Batu', paper: 'Kertas', scissors: 'Gunting' };
const WIN_TO       = 3; // menang 3 ronde dulu

let rpsScorePlayer = 0;
let rpsScoreBahlil = 0;
let rpsPlaying     = true;

const rpsPlayerHand   = document.getElementById('rpsPlayerHand');
const rpsBahlilHand   = document.getElementById('rpsBahlilHand');
const rpsResult       = document.getElementById('rpsResult');
const rpsScorePlayerEl = document.getElementById('rpsScorePlayer');
const rpsScoreBahlilEl = document.getElementById('rpsScoreBahlil');
const rpsCardPlayer   = document.getElementById('rpsCardPlayer');
const rpsCardBahlil   = document.getElementById('rpsCardBahlil');
const rpsBtns         = document.querySelectorAll('.rps-btn');
const rpsRestartBtn   = document.getElementById('rpsRestartBtn');
const rpsNextBtn      = document.getElementById('rpsNextBtn');

// Tentukan pemenang ronde
function rpsWinner(player, bahlil) {
    if (player === bahlil) return 'draw';
    if (
        (player === 'rock'     && bahlil === 'scissors') ||
        (player === 'scissors' && bahlil === 'paper')    ||
        (player === 'paper'    && bahlil === 'rock')
    ) return 'player';
    return 'bahlil';
}

// Animasi shake tangan sebelum reveal
function shakeAndReveal(playerChoice) {
    // Disable tombol saat animasi
    rpsBtns.forEach(b => b.disabled = true);
    rpsResult.textContent = '';

    // Reset ke tanda tanya dulu
    rpsPlayerHand.textContent = '🦓';
    rpsBahlilHand.textContent = '👹';

    // Shake animation
    rpsPlayerHand.classList.remove('shake', 'reveal');
    rpsBahlilHand.classList.remove('shake', 'reveal');
    void rpsPlayerHand.offsetWidth;
    rpsPlayerHand.classList.add('shake');
    rpsBahlilHand.classList.add('shake');

    setTimeout(() => {
        // Bahlil pilih random
        const bahlilChoice = RPS_CHOICES[Math.floor(Math.random() * 3)];

        rpsPlayerHand.classList.remove('shake');
        rpsBahlilHand.classList.remove('shake');
        rpsPlayerHand.classList.add('reveal');
        rpsBahlilHand.classList.add('reveal');

        rpsPlayerHand.textContent = RPS_EMOJI[playerChoice];
        rpsBahlilHand.textContent = RPS_EMOJI[bahlilChoice];

        beep(400, 600, 'sine', 0.2);

        const result = rpsWinner(playerChoice, bahlilChoice);

        setTimeout(() => {
            if (result === 'player') {
                rpsScorePlayer++;
                rpsScorePlayerEl.textContent = rpsScorePlayer;
                rpsResult.textContent = `Menang! ${RPS_LABEL[playerChoice]} ngalahin ${RPS_LABEL[bahlilChoice]}!`;
                rpsCardPlayer.classList.add('active');
                rpsCardBahlil.classList.remove('active');
                beep(600, 900, 'sine', 0.25);
            } else if (result === 'bahlil') {
                rpsScoreBahlil++;
                rpsScoreBahlilEl.textContent = rpsScoreBahlil;
                rpsResult.textContent = `Bahlil menang! ${RPS_LABEL[bahlilChoice]} ngalahin ${RPS_LABEL[playerChoice]}!`;
                rpsCardBahlil.classList.add('active');
                rpsCardPlayer.classList.remove('active');
                beep(300, 150, 'triangle', 0.2);
            } else {
                rpsResult.textContent = `Seri! Sama-sama ${RPS_LABEL[playerChoice]}!`;
                rpsCardPlayer.classList.remove('active');
                rpsCardBahlil.classList.remove('active');
                beep(440, 440, 'sine', 0.15);
            }

            // Cek apakah ada yang menang keseluruhan
            if (rpsScorePlayer >= WIN_TO) {
                setTimeout(() => {
                    rpsResult.textContent = '🏆 KAMU MENANG! Bahlil sudah dikalahkan!';
                    rpsBtns.forEach(b => b.disabled = true);
                    rpsNextBtn.style.display    = 'inline-block';
                    rpsRestartBtn.style.display = 'inline-block';
                    rpsPlaying = false;
                    launchConfetti();
                }, 300);
            } else if (rpsScoreBahlil >= WIN_TO) {
                setTimeout(() => {
                    rpsResult.textContent = '👹 Bahlil menang segalanya! Coba lagi!';
                    rpsBtns.forEach(b => b.disabled = true);
                    rpsRestartBtn.style.display = 'inline-block';
                    rpsPlaying = false;
                }, 300);
            } else {
                // Lanjut ronde, enable tombol lagi
                rpsBtns.forEach(b => b.disabled = false);
            }
        }, 200);
    }, 600);
}

rpsBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (!rpsPlaying) return;
        shakeAndReveal(btn.dataset.choice);
    });
});

function resetRPS() {
    rpsScorePlayer = 0;
    rpsScoreBahlil = 0;
    rpsPlaying     = true;

    rpsScorePlayerEl.textContent = 0;
    rpsScoreBahlilEl.textContent = 0;
    rpsPlayerHand.textContent    = '🦓';
    rpsBahlilHand.textContent    = '👹';
    rpsResult.textContent        = '';

    rpsCardPlayer.classList.add('active');
    rpsCardBahlil.classList.remove('active');

    rpsBtns.forEach(b => b.disabled = false);
    rpsRestartBtn.style.display = 'none';
    rpsNextBtn.style.display    = 'none';
}

rpsRestartBtn.addEventListener('click', resetRPS);

rpsNextBtn.addEventListener('click', () => {
    // Ganti ke halaman berikutnya
    window.location.href = '../thirdpage/index.html';
});