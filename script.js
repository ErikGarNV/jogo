// script.js — Bio-Defense: Protocolo 01

document.addEventListener('DOMContentLoaded', () => {

    // ═══════════════════════════════════════════════
    // 1. REFERENCIAS
    // ═══════════════════════════════════════════════
    const gameContainer     = document.getElementById('game-container');
    const player            = document.getElementById('player');
    const bulletContainer   = document.getElementById('bullet-container');
    const enemyContainer    = document.getElementById('enemy-container');
    const itemContainer     = document.getElementById('item-container');
    const particleContainer = document.getElementById('particle-container');
    const healthBar         = document.getElementById('health-bar');
    const scoreDisplay      = document.getElementById('score');
    const hud               = document.getElementById('hud');
    const levelIntro        = document.getElementById('level-intro');
    const levelIntroTitle   = document.getElementById('level-intro-title');
    const levelIntroSub     = document.getElementById('level-intro-sub');
    const levelDisplay      = document.getElementById('level-display');
    const powerupStatus     = document.getElementById('powerup-status');
    const screenMenu        = document.getElementById('screen-menu');
    const screenGameOver    = document.getElementById('screen-gameover');
    const screenLevelComplete = document.getElementById('screen-level-complete');
    const screenVictory     = document.getElementById('screen-victory');
    const finalScoreDisplay = document.getElementById('final-score');
    const btnStart          = document.getElementById('btn-start');
    const btnRestart        = document.getElementById('btn-restart');
    const btnNextLevel      = document.getElementById('btn-next-level');
    const btnRestartVictory = document.getElementById('btn-restart-victory');

    // ═══════════════════════════════════════════════
    // DATOS DE NIVELES Y CARTAS DE AMOR
    // ═══════════════════════════════════════════════
    const LEVELS = [
        // FÁCIL (1-3): pocos enemigos, lentos, muchos drops, solo peons
        { name: 'BIO-LAB ENTRANCE',   sub: 'INVASIÓN VIRAL DETECTADA',      scoreTarget:  80,  enemySpeed: 0.55, spawnDelay: 5500, cols: 4, dropChance: 0.60, tankChance: 0.00, zigzagChance: 0.00 },
        { name: 'QUARANTINE ZONE',    sub: 'CONTAMINACIÓN DETECTADA',        scoreTarget: 160,  enemySpeed: 0.70, spawnDelay: 5000, cols: 5, dropChance: 0.55, tankChance: 0.05, zigzagChance: 0.05 },
        { name: 'RESEARCH WING',      sub: 'MUTACIONES MENORES DETECTADAS',  scoreTarget: 280,  enemySpeed: 0.85, spawnDelay: 4500, cols: 6, dropChance: 0.50, tankChance: 0.10, zigzagChance: 0.10 },
        // INTERMEDIO (4-5): ritmo normal, mezcla de tipos
        { name: 'BIOTECH CORE',       sub: 'ALERTA DE MUTACIÓN ACTIVA',      scoreTarget: 420,  enemySpeed: 1.00, spawnDelay: 4000, cols: 6, dropChance: 0.45, tankChance: 0.20, zigzagChance: 0.15 },
        { name: 'VIRAL NEXUS',        sub: 'COLAPSO PARCIAL DETECTADO',      scoreTarget: 580,  enemySpeed: 1.15, spawnDelay: 3600, cols: 7, dropChance: 0.42, tankChance: 0.25, zigzagChance: 0.20 },
        // DIFÍCIL creciente (6-10): cada nivel sube velocidad + cols + menos drops
        { name: 'OUTBREAK CORRIDOR',  sub: 'NIVEL DE AMENAZA: ALTO',         scoreTarget: 780,  enemySpeed: 1.35, spawnDelay: 3200, cols: 7, dropChance: 0.40, tankChance: 0.30, zigzagChance: 0.25 },
        { name: 'CONTAINMENT BREACH', sub: 'BARRERA ROTA — AVANZAR',         scoreTarget:1020,  enemySpeed: 1.60, spawnDelay: 2900, cols: 8, dropChance: 0.38, tankChance: 0.35, zigzagChance: 0.30 },
        { name: 'ANTIGEN CHAMBER',    sub: 'SÍNTESIS DE ANTÍDOTO INICIADA',  scoreTarget:1300,  enemySpeed: 1.90, spawnDelay: 2600, cols: 8, dropChance: 0.38, tankChance: 0.40, zigzagChance: 0.35 },
        { name: 'PATHOGEN SUMMIT',    sub: 'FUENTE VIRAL LOCALIZADA',        scoreTarget:1620,  enemySpeed: 2.20, spawnDelay: 2300, cols: 9, dropChance: 0.40, tankChance: 0.45, zigzagChance: 0.40 },
        { name: 'FINAL PROTOCOL',     sub: 'ERRADICACIÓN TOTAL — AHORA',     scoreTarget:2000,  enemySpeed: 2.55, spawnDelay: 2000, cols: 9, dropChance: 0.45, tankChance: 0.50, zigzagChance: 0.45 },
    ];

    const LOVE_LETTERS = [
        {
            text: 'Ailyn, mi amor,\ntu sonrisa ilumina hasta mis días más grises. Amo compartir contigo esos mundos que nos hacen reír y soñar. Eres mi persona favorita y solo quiero hacerte feliz cada día.',
            sign: 'Te amo mucho. — Tuyo siempre, Duval ❤'
        },
        {
            text: 'Mi Ailyn,\ncada vez que te miro el corazón me late más fuerte. Amo tu energía, tu voz cuando cantas y cómo todo se siente mejor a tu lado. Quiero ser quien te haga sonreír siempre.',
            sign: 'Te amo con todo mi ser. — Para ti, Duval ❤'
        },
        {
            text: 'Ailyn mía,\neres la chispa que hace mi vida más bonita. Compartimos risas, sueños y locuras que nadie más entiende, y eso me hace sentir el hombre más afortunado. Quiero cuidarte y verte feliz.',
            sign: 'Te amo profundamente. — Tuyo, Duval ❤'
        },
        {
            text: 'Para mi Ailyn,\ncuando estás cerca, el mundo se vuelve más dulce. Amo tu luz, tu forma de ser tan única y cómo me haces sentir en casa. Prometo estar siempre aquí, abrazándote fuerte.',
            sign: 'Te amo más de lo que imaginas. — Siempre tuyo, Duval ❤'
        },
        {
            text: 'Ailyn, amor de mi vida,\ntu risa es mi canción favorita y tu presencia mi refugio. En cada momento contigo siento que todo encaja. Quiero proteger esa sonrisa y hacer cada día más hermoso para ti.',
            sign: 'Te amo con el alma. — Tuyo para siempre, Duval ❤'
        },
        {
            text: 'Mi hermosa Ailyn,\neres el sueño que nunca supe que necesitaba. Amo cómo iluminas todo a tu alrededor y cómo nuestros corazones laten al mismo ritmo. Quiero cuidarte y quedarme a tu lado por toda la eternidad.',
            sign: 'Te amo inmensamente. — Con todo mi corazón, Duval ❤'
        },
        {
            text: 'Ailyn, mi todo,\ncontigo el tiempo se detiene y solo existe lo bonito. Eres mi paz, mi alegría y la razón por la que creo en el amor verdadero. Déjame cuidarte siempre, abrazarte en los días grises.',
            sign: 'Te amo como nunca amé a nadie. — Eterno tuyo, Duval ❤'
        },
        {
            text: 'Mi Ailyn adorada,\ncada latido mío lleva tu nombre. Eres la magia en mi vida diaria, la que hace que todo valga la pena. Quiero ser tu escudo, tu apoyo y el amor que te recuerde cada día lo increíble que eres.',
            sign: 'Te amo hasta el infinito y más. — Tuyo por siempre, Duval ❤'
        },
        {
            text: 'Ailyn, luz de mi vida,\nsin ti nada tendría el mismo color. Amo cada parte de ti, tu alma tan brillante y cómo completamos nuestros mundos raros y hermosos. Prometo amarte, cuidarte y elegirte todos los días.',
            sign: 'Eres mi para siempre. — Hasta el último aliento, Duval ❤'
        },
        {
            text: 'Mi Ailyn, amor eterno,\nsi el universo entero conspiró para que nos encontráramos, yo le agradezco de rodillas. Eres mi refugio, mi mayor alegría y el latido que mantiene vivo mi corazón. Prometo llenarte de risas y besos cada día.',
            sign: 'Te amo más allá del tiempo. Eres mi hogar. — Siempre, siempre tuyo, Duval ❤'
        },
    ];

    // ═══════════════════════════════════════════════
    // SISTEMA DE GUARDADO — localStorage
    // ═══════════════════════════════════════════════
    function saveProgress(levelIndex) {
        const completed = getCompletedLevels();
        if (!completed.includes(levelIndex)) {
            completed.push(levelIndex);
            localStorage.setItem('biodefense_progress', JSON.stringify(completed));
        }
    }

    function getCompletedLevels() {
        try {
            return JSON.parse(localStorage.getItem('biodefense_progress') || '[]');
        } catch(e) { return []; }
    }

    // ═══════════════════════════════════════════════
    // SISTEMA DE AUDIO — Sonidos de disparo por nivel
    //   Cada nivel tiene un sonido sintetizado único.
    //   L1–3: blips limpios y altos (fácil / sci-fi clínico)
    //   L4–6: sawtooth agresivo medio (tensión)
    //   L7–10: grave y pesado (crítico / final)
    // ═══════════════════════════════════════════════
    let audioCtx = null;

    function getAudioCtx() {
        if (!audioCtx) {
            const Ctor = window.AudioContext || window.webkitAudioContext;
            if (Ctor) audioCtx = new Ctor();
        }
        return audioCtx;
    }

    const SHOOT_SOUNDS = [
        { f1: 900, f2: 640, type: 'square',   vol: 0.16, dur: 0.11 }, // L1
        { f1: 860, f2: 610, type: 'square',   vol: 0.16, dur: 0.11 }, // L2
        { f1: 820, f2: 560, type: 'sawtooth', vol: 0.16, dur: 0.13 }, // L3
        { f1: 780, f2: 480, type: 'sawtooth', vol: 0.18, dur: 0.14 }, // L4
        { f1: 730, f2: 420, type: 'sawtooth', vol: 0.18, dur: 0.15 }, // L5
        { f1: 680, f2: 360, type: 'square',   vol: 0.19, dur: 0.15 }, // L6
        { f1: 620, f2: 290, type: 'sawtooth', vol: 0.20, dur: 0.17 }, // L7
        { f1: 570, f2: 250, type: 'sawtooth', vol: 0.20, dur: 0.18 }, // L8
        { f1: 520, f2: 210, type: 'square',   vol: 0.21, dur: 0.19 }, // L9
        { f1: 460, f2: 170, type: 'sawtooth', vol: 0.23, dur: 0.22 }, // L10
    ];

    function playTone(f1, f2, type, vol, dur) {
        try {
            const ctx = getAudioCtx();
            if (!ctx) return;
            if (ctx.state === 'suspended') ctx.resume();
            const osc  = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = type;
            osc.frequency.setValueAtTime(f1, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(f2, ctx.currentTime + dur);
            gain.gain.setValueAtTime(vol, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur + 0.04);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + dur + 0.06);
        } catch(e) {}
    }

    function playShootSound() {
        const s = SHOOT_SOUNDS[gs.currentLevel] || SHOOT_SOUNDS[0];
        playTone(s.f1, s.f2, s.type, s.vol, s.dur);
    }

    function playEnemyDeathSound() {
        playTone(660, 1100, 'sine', 0.10, 0.07);
    }

    function playDamageSound() {
        playTone(130, 55, 'sawtooth', 0.22, 0.14);
    }

    function playLevelCompleteSound() {
        const notes = [440, 554, 659, 880];
        notes.forEach((freq, i) => {
            setTimeout(() => playTone(freq, freq * 1.01, 'square', 0.14, 0.13), i * 110);
        });
    }

    // ═══════════════════════════════════════════════
    // MÚSICA ÉPICA — 10 pistas únicas (Web Audio API)
    // ═══════════════════════════════════════════════
    // Formato track: { bpm, beats, pad, bass, mel, kick, hat, hatVol }
    //   bass/mel : [[beat, freq, waveType, vol, durBeats?], ...]
    //   kick/hat : [beat, ...]
    const MUSIC_TRACKS = (() => {
        const r = (start, end, step) => { // range helper
            const a = [];
            for (let i = start; i < end - 0.001; i += step) a.push(+i.toFixed(3));
            return a;
        };
        return [
            // ── L1: Bio-Lab Entrance — D min, 95 BPM, sparse & tense ──
            {
                bpm:95, beats:8,
                pad: { freqs:[36.7,55,73.4], vol:0.032 },
                bass:[
                    [0,73.4,'square',0.15],[2,73.4,'square',0.13],
                    [4,87.3,'square',0.14],[6,65.4,'square',0.14]
                ],
                mel:[
                    [0.5,293.7,'sine',0.07,0.4],[1.5,349.2,'sine',0.07,0.3],
                    [3,440,'sine',0.08,0.45],[4.5,392,'sine',0.07,0.4],
                    [6,349.2,'sine',0.07,0.4],[7,293.7,'sine',0.06,0.5]
                ],
                kick:[0,4], hat:r(1,8,2), hatVol:0.09
            },
            // ── L2: Quarantine Zone — A min, 104 BPM ──
            {
                bpm:104, beats:8,
                pad: { freqs:[27.5,55,82.4], vol:0.036 },
                bass:[
                    [0,55,'square',0.16],[1,65.4,'square',0.13],
                    [2,55,'square',0.15],[3,49,'square',0.14],
                    [4,55,'square',0.16],[5,65.4,'square',0.13],
                    [6,73.4,'square',0.14],[7,49,'square',0.15]
                ],
                mel:[
                    [0,220,'triangle',0.08,0.4],[1,261.6,'triangle',0.08,0.3],
                    [2,293.7,'triangle',0.09,0.4],[3.5,329.6,'triangle',0.07,0.3],
                    [4,293.7,'triangle',0.08,0.4],[5.5,261.6,'triangle',0.08,0.35],
                    [6.5,220,'triangle',0.08,0.4],[7.5,196,'triangle',0.07,0.3]
                ],
                kick:[0,2,4,6], hat:r(0.5,8,1), hatVol:0.10
            },
            // ── L3: Research Wing — E min, 112 BPM, sawtooth bass ──
            {
                bpm:112, beats:8,
                pad: { freqs:[41.2,82.4,123.5], vol:0.040 },
                bass:[
                    [0,82.4,'sawtooth',0.13],[0.5,82.4,'sawtooth',0.09],
                    [1,98,'sawtooth',0.12],[1.5,98,'sawtooth',0.09],
                    [2,110,'sawtooth',0.12],[2.5,98,'sawtooth',0.09],
                    [3,82.4,'sawtooth',0.12],[3.5,73.4,'sawtooth',0.10],
                    [4,82.4,'sawtooth',0.13],[4.5,82.4,'sawtooth',0.09],
                    [5,98,'sawtooth',0.12],[5.5,98,'sawtooth',0.09],
                    [6,110,'sawtooth',0.12],[6.5,98,'sawtooth',0.09],
                    [7,82.4,'sawtooth',0.12],[7.5,65.4,'sawtooth',0.11]
                ],
                mel:[
                    [0,329.6,'square',0.07,0.4],[0.75,392,'square',0.07,0.3],
                    [1.5,440,'square',0.08,0.4],[2.5,392,'square',0.07,0.3],
                    [3,349.2,'square',0.07,0.35],[4,329.6,'square',0.07,0.4],
                    [4.75,392,'square',0.07,0.3],[5.5,440,'square',0.08,0.35],
                    [6,493.9,'square',0.08,0.3],[6.75,440,'square',0.07,0.25],
                    [7.25,392,'square',0.07,0.3]
                ],
                kick:[0,2,4,6], hat:r(0,8,0.5), hatVol:0.09
            },
            // ── L4: Biotech Core — C min, 122 BPM, more intense ──
            {
                bpm:122, beats:8,
                pad: { freqs:[32.7,65.4,98], vol:0.044 },
                bass:[
                    [0,65.4,'sawtooth',0.14],[0.5,65.4,'sawtooth',0.10],
                    [1,73.4,'sawtooth',0.13],[1.5,58.3,'sawtooth',0.10],
                    [2,65.4,'sawtooth',0.14],[2.5,73.4,'sawtooth',0.11],
                    [3,65.4,'sawtooth',0.13],[3.5,87.3,'sawtooth',0.11],
                    [4,65.4,'sawtooth',0.14],[4.5,65.4,'sawtooth',0.10],
                    [5,73.4,'sawtooth',0.13],[5.5,58.3,'sawtooth',0.10],
                    [6,65.4,'sawtooth',0.14],[6.5,49,'sawtooth',0.12],
                    [7,58.3,'sawtooth',0.13],[7.5,65.4,'sawtooth',0.11]
                ],
                mel:[
                    [0,261.6,'square',0.08,0.4],[1,311.1,'square',0.08,0.35],
                    [2,349.2,'square',0.09,0.4],[3,311.1,'square',0.08,0.35],
                    [3.5,293.7,'square',0.08,0.3],[4,261.6,'square',0.09,0.4],
                    [5,233.1,'square',0.08,0.4],[5.75,261.6,'square',0.08,0.3],
                    [6,311.1,'square',0.09,0.4],[7,349.2,'square',0.09,0.45],
                    [7.75,311.1,'square',0.08,0.3]
                ],
                kick:r(0,8,1), hat:r(0,8,0.5), hatVol:0.11
            },
            // ── L5: Viral Nexus — G min, 130 BPM, driving ──
            {
                bpm:130, beats:8,
                pad: { freqs:[49,73.4,98], vol:0.048 },
                bass:[
                    [0,98,'sawtooth',0.15],[0.25,110,'sawtooth',0.11],
                    [0.5,98,'sawtooth',0.14],[0.75,87.3,'sawtooth',0.10],
                    [1,98,'sawtooth',0.14],[1.5,110,'sawtooth',0.13],
                    [2,98,'sawtooth',0.15],[2.25,110,'sawtooth',0.11],
                    [2.5,98,'sawtooth',0.14],[2.75,87.3,'sawtooth',0.10],
                    [3,87.3,'sawtooth',0.14],[3.5,73.4,'sawtooth',0.13],
                    [4,98,'sawtooth',0.15],[4.25,110,'sawtooth',0.11],
                    [4.5,98,'sawtooth',0.14],[4.75,87.3,'sawtooth',0.10],
                    [5,98,'sawtooth',0.14],[5.5,110,'sawtooth',0.13],
                    [6,98,'sawtooth',0.15],[6.5,110,'sawtooth',0.13],
                    [7,87.3,'sawtooth',0.14],[7.25,73.4,'sawtooth',0.12],
                    [7.5,65.4,'sawtooth',0.14],[7.75,73.4,'sawtooth',0.12]
                ],
                mel:[
                    [0,392,'square',0.09,0.3],[0.75,440,'square',0.09,0.25],
                    [1.5,493.9,'square',0.10,0.3],[2.25,440,'square',0.08,0.25],
                    [3,392,'square',0.09,0.35],[3.75,349.2,'square',0.08,0.3],
                    [4,392,'square',0.09,0.3],[4.75,440,'square',0.09,0.25],
                    [5.5,493.9,'square',0.10,0.3],[6,523.3,'square',0.10,0.35],
                    [6.75,493.9,'square',0.09,0.25],[7.25,440,'square',0.09,0.3]
                ],
                kick:r(0,8,1), hat:r(0,8,0.25), hatVol:0.08
            },
            // ── L6: Outbreak Corridor — D min, 138 BPM, heavy ──
            {
                bpm:138, beats:8,
                pad: { freqs:[36.7,55,73.4], vol:0.052 },
                bass:[
                    [0,73.4,'sawtooth',0.16],[0.25,73.4,'sawtooth',0.12],
                    [0.5,87.3,'sawtooth',0.15],[0.75,73.4,'sawtooth',0.11],
                    [1,65.4,'sawtooth',0.15],[1.25,73.4,'sawtooth',0.12],
                    [1.5,73.4,'sawtooth',0.15],[1.75,87.3,'sawtooth',0.11],
                    [2,73.4,'sawtooth',0.16],[2.25,73.4,'sawtooth',0.12],
                    [2.5,87.3,'sawtooth',0.15],[2.75,73.4,'sawtooth',0.11],
                    [3,58.3,'sawtooth',0.15],[3.5,65.4,'sawtooth',0.14],
                    [4,73.4,'sawtooth',0.16],[4.25,73.4,'sawtooth',0.12],
                    [4.5,87.3,'sawtooth',0.15],[4.75,73.4,'sawtooth',0.11],
                    [5,65.4,'sawtooth',0.15],[5.25,73.4,'sawtooth',0.12],
                    [5.5,73.4,'sawtooth',0.15],[5.75,87.3,'sawtooth',0.11],
                    [6,73.4,'sawtooth',0.16],[6.25,73.4,'sawtooth',0.12],
                    [6.5,87.3,'sawtooth',0.15],[6.75,98,'sawtooth',0.11],
                    [7,110,'sawtooth',0.14],[7.25,98,'sawtooth',0.12],
                    [7.5,87.3,'sawtooth',0.13],[7.75,73.4,'sawtooth',0.13]
                ],
                mel:[
                    [0,293.7,'square',0.09,0.3],[0.5,349.2,'square',0.09,0.25],
                    [1,392,'square',0.10,0.35],[1.75,349.2,'square',0.09,0.25],
                    [2.5,440,'square',0.09,0.3],[3,392,'square',0.10,0.35],
                    [3.5,349.2,'square',0.09,0.25],[4,293.7,'square',0.09,0.3],
                    [4.5,349.2,'square',0.09,0.25],[5,392,'square',0.10,0.3],
                    [5.5,440,'square',0.10,0.3],[6,493.9,'square',0.10,0.35],
                    [6.5,440,'square',0.09,0.25],[7,392,'square',0.10,0.35],
                    [7.5,349.2,'square',0.09,0.3]
                ],
                kick:r(0,8,0.5), hat:r(0,8,0.25), hatVol:0.09
            },
            // ── L7: Containment Breach — B min, 146 BPM ──
            {
                bpm:146, beats:8,
                pad: { freqs:[30.9,61.7,92.5], vol:0.056 },
                bass:[
                    [0,61.7,'sawtooth',0.17],[0.25,73.4,'sawtooth',0.13],
                    [0.5,61.7,'sawtooth',0.16],[0.75,55,'sawtooth',0.12],
                    [1,61.7,'sawtooth',0.17],[1.25,73.4,'sawtooth',0.13],
                    [1.5,82.4,'sawtooth',0.15],[1.75,73.4,'sawtooth',0.12],
                    [2,61.7,'sawtooth',0.17],[2.25,73.4,'sawtooth',0.13],
                    [2.5,61.7,'sawtooth',0.16],[2.75,55,'sawtooth',0.12],
                    [3,49,'sawtooth',0.16],[3.25,55,'sawtooth',0.13],
                    [3.5,61.7,'sawtooth',0.16],[3.75,73.4,'sawtooth',0.12],
                    [4,61.7,'sawtooth',0.17],[4.25,73.4,'sawtooth',0.13],
                    [4.5,61.7,'sawtooth',0.16],[4.75,55,'sawtooth',0.12],
                    [5,61.7,'sawtooth',0.17],[5.25,73.4,'sawtooth',0.13],
                    [5.5,82.4,'sawtooth',0.15],[5.75,92.5,'sawtooth',0.12],
                    [6,110,'sawtooth',0.15],[6.25,92.5,'sawtooth',0.13],
                    [6.5,82.4,'sawtooth',0.14],[6.75,73.4,'sawtooth',0.13],
                    [7,61.7,'sawtooth',0.16],[7.25,55,'sawtooth',0.14],
                    [7.5,49,'sawtooth',0.15],[7.75,41.2,'sawtooth',0.14]
                ],
                mel:[
                    [0,246.9,'square',0.09,0.3],[0.5,293.7,'square',0.09,0.25],
                    [1,329.6,'square',0.10,0.3],[1.5,369.9,'square',0.09,0.25],
                    [2,329.6,'square',0.10,0.3],[2.5,293.7,'square',0.09,0.25],
                    [3,246.9,'square',0.09,0.35],[3.75,220,'square',0.09,0.3],
                    [4,246.9,'square',0.09,0.3],[4.5,293.7,'square',0.09,0.25],
                    [5,369.9,'square',0.10,0.3],[5.5,440,'square',0.10,0.3],
                    [6,493.9,'square',0.11,0.3],[6.5,554.4,'square',0.10,0.25],
                    [7,493.9,'square',0.10,0.3],[7.5,440,'square',0.09,0.3]
                ],
                kick:r(0,8,0.5), hat:r(0,8,0.25), hatVol:0.11
            },
            // ── L8: Antigen Chamber — A min, 154 BPM, epic ──
            {
                bpm:154, beats:8,
                pad: { freqs:[27.5,55,82.4,110], vol:0.052 },
                bass:[
                    [0,55,'sawtooth',0.18],[0.25,55,'sawtooth',0.13],
                    [0.5,65.4,'sawtooth',0.17],[0.75,55,'sawtooth',0.12],
                    [1,49,'sawtooth',0.17],[1.25,55,'sawtooth',0.13],
                    [1.5,65.4,'sawtooth',0.16],[1.75,73.4,'sawtooth',0.12],
                    [2,55,'sawtooth',0.18],[2.25,55,'sawtooth',0.13],
                    [2.5,65.4,'sawtooth',0.17],[2.75,55,'sawtooth',0.12],
                    [3,49,'sawtooth',0.17],[3.25,44,'sawtooth',0.14],
                    [3.5,49,'sawtooth',0.16],[3.75,55,'sawtooth',0.13],
                    [4,55,'sawtooth',0.18],[4.25,55,'sawtooth',0.13],
                    [4.5,65.4,'sawtooth',0.17],[4.75,55,'sawtooth',0.12],
                    [5,49,'sawtooth',0.17],[5.25,55,'sawtooth',0.13],
                    [5.5,65.4,'sawtooth',0.16],[5.75,73.4,'sawtooth',0.13],
                    [6,82.4,'sawtooth',0.16],[6.25,73.4,'sawtooth',0.14],
                    [6.5,65.4,'sawtooth',0.15],[6.75,55,'sawtooth',0.14],
                    [7,49,'sawtooth',0.17],[7.25,44,'sawtooth',0.14],
                    [7.5,55,'sawtooth',0.17],[7.75,65.4,'sawtooth',0.13]
                ],
                mel:[
                    [0,220,'square',0.10,0.4],[0.5,261.6,'square',0.10,0.35],
                    [1,293.7,'square',0.11,0.4],[1.5,329.6,'square',0.10,0.35],
                    [2,293.7,'square',0.11,0.4],[2.5,261.6,'square',0.10,0.35],
                    [3,220,'square',0.10,0.4],[3.75,196,'square',0.09,0.3],
                    [4,220,'square',0.10,0.4],[4.5,261.6,'square',0.10,0.35],
                    [5,329.6,'square',0.11,0.4],[5.5,392,'square',0.11,0.35],
                    [6,440,'square',0.12,0.4],[6.5,493.9,'square',0.11,0.35],
                    [7,440,'square',0.11,0.4],[7.5,392,'square',0.10,0.35]
                ],
                kick:r(0,8,0.5), hat:r(0,8,0.25), hatVol:0.13
            },
            // ── L9: Pathogen Summit — F min, 162 BPM ──
            {
                bpm:162, beats:8,
                pad: { freqs:[43.7,65.4,87.3,130.8], vol:0.056 },
                bass:[
                    [0,87.3,'sawtooth',0.19],[0.25,87.3,'sawtooth',0.14],
                    [0.5,98,'sawtooth',0.18],[0.75,87.3,'sawtooth',0.13],
                    [1,82.4,'sawtooth',0.18],[1.25,87.3,'sawtooth',0.14],
                    [1.5,98,'sawtooth',0.17],[1.75,110,'sawtooth',0.13],
                    [2,87.3,'sawtooth',0.19],[2.25,87.3,'sawtooth',0.14],
                    [2.5,98,'sawtooth',0.18],[2.75,87.3,'sawtooth',0.13],
                    [3,73.4,'sawtooth',0.18],[3.25,65.4,'sawtooth',0.15],
                    [3.5,73.4,'sawtooth',0.17],[3.75,82.4,'sawtooth',0.14],
                    [4,87.3,'sawtooth',0.19],[4.25,87.3,'sawtooth',0.14],
                    [4.5,98,'sawtooth',0.18],[4.75,87.3,'sawtooth',0.13],
                    [5,82.4,'sawtooth',0.18],[5.25,87.3,'sawtooth',0.14],
                    [5.5,98,'sawtooth',0.17],[5.75,110,'sawtooth',0.14],
                    [6,130.8,'sawtooth',0.17],[6.25,110,'sawtooth',0.15],
                    [6.5,98,'sawtooth',0.16],[6.75,87.3,'sawtooth',0.15],
                    [7,73.4,'sawtooth',0.18],[7.25,65.4,'sawtooth',0.15],
                    [7.5,55,'sawtooth',0.18],[7.75,65.4,'sawtooth',0.15]
                ],
                mel:[
                    [0,349.2,'square',0.10,0.3],[0.5,415.3,'square',0.10,0.25],
                    [1,466.2,'square',0.10,0.3],[1.5,523.3,'square',0.10,0.25],
                    [2,466.2,'square',0.10,0.3],[2.5,415.3,'square',0.10,0.25],
                    [3,349.2,'square',0.10,0.3],[3.5,311.1,'square',0.09,0.25],
                    [4,349.2,'square',0.10,0.3],[4.5,415.3,'square',0.10,0.25],
                    [5,523.3,'square',0.11,0.3],[5.5,587.3,'square',0.10,0.25],
                    [6,659.3,'square',0.11,0.3],[6.5,587.3,'square',0.10,0.25],
                    [7,523.3,'square',0.10,0.3],[7.5,466.2,'square',0.10,0.3]
                ],
                kick:r(0,8,0.5), hat:r(0,8,0.25), hatVol:0.14
            },
            // ── L10: Final Protocol — E min, 170 BPM, MAXIMUM INTENSITY ──
            {
                bpm:170, beats:8,
                pad: { freqs:[41.2,82.4,123.5,164.8], vol:0.060 },
                bass:[
                    [0,82.4,'sawtooth',0.20],[0.25,82.4,'sawtooth',0.15],
                    [0.5,98,'sawtooth',0.19],[0.75,110,'sawtooth',0.14],
                    [1,98,'sawtooth',0.18],[1.25,82.4,'sawtooth',0.15],
                    [1.5,73.4,'sawtooth',0.18],[1.75,82.4,'sawtooth',0.14],
                    [2,82.4,'sawtooth',0.20],[2.25,82.4,'sawtooth',0.15],
                    [2.5,98,'sawtooth',0.19],[2.75,110,'sawtooth',0.14],
                    [3,98,'sawtooth',0.18],[3.25,82.4,'sawtooth',0.15],
                    [3.5,65.4,'sawtooth',0.18],[3.75,73.4,'sawtooth',0.15],
                    [4,82.4,'sawtooth',0.20],[4.25,82.4,'sawtooth',0.15],
                    [4.5,98,'sawtooth',0.19],[4.75,110,'sawtooth',0.14],
                    [5,130.8,'sawtooth',0.18],[5.25,110,'sawtooth',0.15],
                    [5.5,98,'sawtooth',0.18],[5.75,82.4,'sawtooth',0.15],
                    [6,82.4,'sawtooth',0.20],[6.25,98,'sawtooth',0.15],
                    [6.5,110,'sawtooth',0.19],[6.75,130.8,'sawtooth',0.14],
                    [7,164.8,'sawtooth',0.17],[7.25,130.8,'sawtooth',0.15],
                    [7.5,110,'sawtooth',0.18],[7.75,82.4,'sawtooth',0.16]
                ],
                mel:[
                    [0,329.6,'square',0.11,0.3],[0.25,392,'square',0.11,0.25],
                    [0.5,440,'square',0.11,0.3],[0.75,493.9,'square',0.10,0.25],
                    [1,554.4,'square',0.11,0.3],[1.25,493.9,'square',0.10,0.25],
                    [1.5,440,'square',0.11,0.3],[1.75,392,'square',0.10,0.25],
                    [2,329.6,'square',0.11,0.3],[2.25,392,'square',0.11,0.25],
                    [2.5,440,'square',0.11,0.3],[2.75,493.9,'square',0.10,0.25],
                    [3,554.4,'square',0.11,0.3],[3.25,622,'square',0.11,0.25],
                    [3.5,659.3,'square',0.12,0.3],[3.75,622,'square',0.10,0.25],
                    [4,329.6,'square',0.11,0.3],[4.25,392,'square',0.11,0.25],
                    [4.5,440,'square',0.11,0.3],[4.75,493.9,'square',0.10,0.25],
                    [5,554.4,'square',0.11,0.3],[5.25,493.9,'square',0.10,0.25],
                    [5.5,440,'square',0.11,0.3],[5.75,392,'square',0.10,0.25],
                    [6,659.3,'square',0.12,0.3],[6.25,622,'square',0.11,0.25],
                    [6.5,554.4,'square',0.11,0.3],[6.75,493.9,'square',0.10,0.25],
                    [7,440,'square',0.11,0.3],[7.25,392,'square',0.10,0.25],
                    [7.5,329.6,'square',0.12,0.35],[7.75,293.7,'square',0.11,0.3]
                ],
                kick:r(0,8,0.5), hat:r(0,8,0.25), hatVol:0.16
            }
        ];
    })();

    // ── MusicPlayer ──────────────────────────────────
    const MusicPlayer = {
        _gain:    null,
        _nodes:   [],
        _timer:   null,
        _playing: false,

        _getGain() {
            if (!this._gain) {
                const ctx = getAudioCtx();
                if (!ctx) return null;
                this._gain = ctx.createGain();
                this._gain.gain.value = 0.40;
                this._gain.connect(ctx.destination);
            }
            return this._gain;
        },

        stop() {
            this._playing = false;
            if (this._timer) { clearTimeout(this._timer); this._timer = null; }
            this._nodes.forEach(n => { try { n.stop(0); } catch(e) {} });
            this._nodes = [];
        },

        pause() {
            const ctx = getAudioCtx();
            if (ctx && ctx.state === 'running') ctx.suspend();
        },

        resume() {
            const ctx = getAudioCtx();
            if (ctx && ctx.state === 'suspended') ctx.resume();
        },

        play(levelIdx) {
            const ctx = getAudioCtx();
            if (!ctx) return;
            if (ctx.state === 'suspended') ctx.resume();
            this.stop();
            this._playing = true;
            this._loop(levelIdx);
        },

        _loop(levelIdx) {
            if (!this._playing) return;
            const ctx  = getAudioCtx();
            if (!ctx) return;
            if (ctx.state === 'suspended') {
                // Espera que el contexto se reactive
                this._timer = setTimeout(() => this._loop(levelIdx), 100);
                return;
            }
            const gain   = this._getGain();
            if (!gain) return;
            const track  = MUSIC_TRACKS[levelIdx] || MUSIC_TRACKS[0];
            const bLen   = 60 / track.bpm;        // segundos por beat
            const barLen = bLen * track.beats;     // duración total del loop
            const t0     = ctx.currentTime + 0.06;

            this._render(track, t0, bLen, gain, ctx);

            this._timer = setTimeout(() => {
                if (!this._playing) return;
                this._loop(levelIdx);
            }, (barLen - 0.10) * 1000);
        },

        _render(track, t0, bLen, dest, ctx) {
            const barLen = bLen * track.beats;

            // Pad sostenido (ambiente)
            if (track.pad) {
                track.pad.freqs.forEach((freq, i) => {
                    const osc  = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.value = freq;
                    osc.connect(gain); gain.connect(dest);
                    const v = track.pad.vol * (1 - i * 0.18);
                    gain.gain.setValueAtTime(0.001, t0);
                    gain.gain.linearRampToValueAtTime(v,     t0 + 0.40);
                    gain.gain.setValueAtTime(v,              t0 + barLen - 0.35);
                    gain.gain.linearRampToValueAtTime(0.001, t0 + barLen);
                    osc.start(t0); osc.stop(t0 + barLen + 0.05);
                    this._nodes.push(osc);
                });
            }

            // Bass
            track.bass.forEach(([beat, freq, type, vol]) => {
                const dur = Math.max(0.045, bLen * 0.40);
                this._note(ctx, dest, freq, type, vol, t0 + beat * bLen, dur);
            });

            // Melody / arpeggio
            track.mel.forEach(([beat, freq, type, vol, durB]) => {
                const dur = Math.max(0.045, bLen * (durB || 0.38));
                this._note(ctx, dest, freq, type, vol, t0 + beat * bLen, dur);
            });

            // Kick
            if (track.kick) track.kick.forEach(b => this._kick(ctx, dest, t0 + b * bLen));

            // Hi-hat
            if (track.hat) {
                const hv = track.hatVol || 0.10;
                track.hat.forEach(b => this._hat(ctx, dest, t0 + b * bLen, hv));
            }
        },

        _note(ctx, dest, freq, type, vol, t, dur) {
            const osc  = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type || 'square';
            osc.frequency.value = freq;
            osc.connect(gain); gain.connect(dest);
            gain.gain.setValueAtTime(0.001, t);
            gain.gain.linearRampToValueAtTime(vol,       t + Math.min(0.012, dur * 0.15));
            gain.gain.setValueAtTime(vol * 0.82,         t + dur * 0.60);
            gain.gain.linearRampToValueAtTime(0.001,     t + dur);
            osc.start(t); osc.stop(t + dur + 0.01);
            this._nodes.push(osc);
        },

        _kick(ctx, dest, t) {
            const osc  = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(dest);
            osc.frequency.setValueAtTime(160, t);
            osc.frequency.exponentialRampToValueAtTime(28, t + 0.11);
            gain.gain.setValueAtTime(0.48, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
            osc.start(t); osc.stop(t + 0.17);
            this._nodes.push(osc);
        },

        _hat(ctx, dest, t, vol) {
            const bufLen = Math.min(Math.floor(ctx.sampleRate * 0.07), 4096);
            const buf  = ctx.createBuffer(1, bufLen, ctx.sampleRate);
            const data = buf.getChannelData(0);
            for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
            const src  = ctx.createBufferSource();
            src.buffer = buf;
            const filt = ctx.createBiquadFilter();
            filt.type  = 'highpass'; filt.frequency.value = 6200;
            const gain = ctx.createGain();
            src.connect(filt); filt.connect(gain); gain.connect(dest);
            gain.gain.setValueAtTime(vol, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.052);
            src.start(t); src.stop(t + 0.075);
            this._nodes.push(src);
        }
    };

    // ═══════════════════════════════════════════════
    // PANTALLA VER NIVELES
    // ═══════════════════════════════════════════════
    const screenLevels   = document.getElementById('screen-levels');
    const btnLevels      = document.getElementById('btn-levels');
    const btnBackLevels  = document.getElementById('btn-back-levels');

    // ── PAUSA ──
    const screenPause    = document.getElementById('screen-pause');
    const btnPause       = document.getElementById('btn-pause');
    const btnResume      = document.getElementById('btn-resume');
    const btnMenuPause   = document.getElementById('btn-menu-pause');

    const DIFFICULTY_LABELS = ['FÁCIL','FÁCIL','FÁCIL','MEDIO','MEDIO','DIFÍCIL','DIFÍCIL','DIFÍCIL','DIFÍCIL','DIFÍCIL'];

    function showLevelsScreen() {
        const completed = getCompletedLevels();
        const grid      = document.getElementById('levels-grid');
        grid.innerHTML  = '';

        LEVELS.forEach((lvl, i) => {
            const isDone      = completed.includes(i);
            const isUnlocked  = i === 0 || completed.includes(i - 1);
            const stateClass  = isDone ? 'lc-done' : isUnlocked ? 'lc-open' : 'lc-locked';

            const card = document.createElement('div');
            card.className = `level-card ${stateClass}`;
            card.innerHTML = `
                <div class="lc-num">${String(i+1).padStart(2,'0')}</div>
                <div class="lc-icon">${isDone ? '✓' : isUnlocked ? '▶' : '🔒'}</div>
                <div class="lc-name">${lvl.name}</div>
                <div class="lc-diff">${DIFFICULTY_LABELS[i]}</div>
            `;
            grid.appendChild(card);
        });

        const countEl = document.getElementById('levels-count');
        countEl.textContent = `${completed.length} / ${LEVELS.length} NIVELES COMPLETADOS`;

        screenLevels.classList.add('active');
    }

    if (btnLevels) {
        btnLevels.addEventListener('click', showLevelsScreen);
    }
    if (btnBackLevels) {
        btnBackLevels.addEventListener('click', () => screenLevels.classList.remove('active'));
    }

    // ═══════════════════════════════════════════════
    // SISTEMA DE PAUSA
    // ═══════════════════════════════════════════════
    function pauseGame() {
        if (gamePhase !== 'PLAYING') return;
        gamePhase = 'PAUSED';
        if (spawnInterval) { clearInterval(spawnInterval); spawnInterval = null; }
        screenPause.classList.add('active');
        MusicPlayer.pause();
    }

    function resumeFromPause() {
        if (gamePhase !== 'PAUSED') return;
        gamePhase = 'PLAYING';
        screenPause.classList.remove('active');
        MusicPlayer.resume();
        scheduleNextSpawn();
        requestAnimationFrame(gameLoop);
    }

    function returnToMenuFromPause() {
        gamePhase = 'MENU';
        if (spawnInterval) { clearInterval(spawnInterval); spawnInterval = null; }
        MusicPlayer.stop();
        clearAllEntities();
        gs.enemies.length = gs.bullets.length = gs.powerUps.length = 0;
        // Ocultar pausa, mostrar menú
        screenPause.classList.remove('active');
        screenGameOver.classList.remove('active');
        screenLevelComplete.classList.remove('active');
        screenVictory.classList.remove('active');
        screenMenu.classList.add('active');
    }

    if (btnPause)     btnPause.addEventListener('click',     pauseGame);
    if (btnResume)    btnResume.addEventListener('click',    resumeFromPause);
    if (btnMenuPause) btnMenuPause.addEventListener('click', returnToMenuFromPause);
    // ═══════════════════════════════════════════════
    const S = {
        width:  1280,
        height: 720,
        playerSpeed:             8,
        bulletSpeed:             14,
        enemyRowSpawnDelay:    5000,
        initialEnemySpawnDelay: 4500,
        enemyDamage:             10,
        dropChance:             0.30,
        difficultyStep:          500
    };

    // ═══════════════════════════════════════════════
    // 3. ESCALADO PIXEL-PERFECT
    // ═══════════════════════════════════════════════
    function scaleGameToFit() {
        const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
        // Reserve space for virtual controls on touch devices (landscape)
        const controlsHeight = isTouchDevice ? Math.min(220, window.innerHeight * 0.30) : 0;
        const availH = window.innerHeight - controlsHeight;
        const scaleX = window.innerWidth  / S.width;
        const scaleY = availH             / S.height;
        const scale  = Math.min(scaleX, scaleY);
        const ox = (window.innerWidth  - S.width  * scale) / 2;
        const oy = (availH             - S.height * scale) / 2;
        gameContainer.style.transform       = `scale(${scale})`;
        gameContainer.style.transformOrigin = 'top left';
        gameContainer.style.left            = `${ox}px`;
        gameContainer.style.top             = `${oy}px`;
    }
    scaleGameToFit();
    window.addEventListener('resize', scaleGameToFit);
    window.addEventListener('orientationchange', () => setTimeout(scaleGameToFit, 200));

    // Prevenir gestos del navegador (zoom, scroll, etc.)
    document.addEventListener('touchmove',  e => e.preventDefault(), { passive: false });
    document.addEventListener('gesturestart', e => e.preventDefault(), { passive: false });
    document.addEventListener('gesturechange', e => e.preventDefault(), { passive: false });

    // ═══════════════════════════════════════════════
    // 4. ESTADO DEL JUEGO
    // ═══════════════════════════════════════════════
    const gs = {
        playerX:            S.width / 2,
        bullets:            [],
        enemies:            [],
        powerUps:           [],
        gameActive:         false,
        currentScore:       0,
        currentHealth:      100,
        lastShotTime:       0,
        fireRate:           280,
        isAdrenalineActive: false,
        isMultishotActive:  false,
        currentLevel:       0,   // 0-based index into LEVELS
        levelScore:         0    // score accumulated within this level
    };

    // ═══════════════════════════════════════════════
    // 5. INPUT — TECLADO
    // ═══════════════════════════════════════════════
    const keys = {};

    document.addEventListener('keydown', e => {
        keys[e.key] = true;
        if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
            if (gamePhase === 'PLAYING') pauseGame();
            else if (gamePhase === 'PAUSED') resumeFromPause();
            return;
        }
        if (gamePhase !== 'PLAYING') return;
        if (e.key === ' ' || e.key === 'z' || e.key === 'Z') {
            e.preventDefault();
            shootPlasma();
        }
    });
    document.addEventListener('keyup', e => { keys[e.key] = false; });

    // ═══════════════════════════════════════════════
    // 6. CONTROLES MÓVIL — JOYSTICK VIRTUAL ANALÓGICO
    // ═══════════════════════════════════════════════
    const joystickBase  = document.getElementById('joystick-base');
    const joystickKnob  = document.getElementById('joystick-knob');
    const btnFire       = document.getElementById('btn-fire');

    // Estado del joystick
    const joy = { active: false, id: null, startX: 0, startY: 0, dx: 0, dy: 0 };
    const DEADZONE   = 0.20;  // zona muerta central (20%)
    const MAX_RADIUS = 50;    // píxeles máximos de desplazamiento del knob

    function joystickMove(clientX, clientY) {
        const rect = joystickBase.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const rawX = clientX - cx;
        const rawY = clientY - cy;
        const dist = Math.sqrt(rawX * rawX + rawY * rawY);
        const norm = dist > 0 ? Math.min(dist, MAX_RADIUS) / MAX_RADIUS : 0;

        // Clamp al círculo
        const angle = Math.atan2(rawY, rawX);
        const kx = Math.cos(angle) * Math.min(dist, MAX_RADIUS);
        const ky = Math.sin(angle) * Math.min(dist, MAX_RADIUS);

        joystickKnob.style.transform = `translate(calc(-50% + ${kx}px), calc(-50% + ${ky}px))`;

        // Actualizar teclas virtuales con deadzone
        const nx = norm > DEADZONE ? Math.cos(angle) : 0;
        const ny = norm > DEADZONE ? Math.sin(angle) : 0;

        keys['ArrowLeft']  = nx < -0.4;
        keys['ArrowRight'] = nx >  0.4;
        keys['ArrowUp']    = ny < -0.4;
        keys['ArrowDown']  = ny >  0.4;
    }

    function joystickRelease() {
        joy.active = false;
        joy.id     = null;
        joystickKnob.style.transform = 'translate(-50%, -50%)';
        keys['ArrowLeft'] = keys['ArrowRight'] = keys['ArrowUp'] = keys['ArrowDown'] = false;
    }

    if (joystickBase) {
        joystickBase.addEventListener('touchstart', e => {
            e.preventDefault();
            const t = e.changedTouches[0];
            joy.active = true;
            joy.id     = t.identifier;
            joystickMove(t.clientX, t.clientY);
        }, { passive: false });

        document.addEventListener('touchmove', e => {
            if (!joy.active) return;
            for (const t of e.changedTouches) {
                if (t.identifier === joy.id) {
                    e.preventDefault();
                    joystickMove(t.clientX, t.clientY);
                    break;
                }
            }
        }, { passive: false });

        document.addEventListener('touchend', e => {
            for (const t of e.changedTouches) {
                if (t.identifier === joy.id) { joystickRelease(); break; }
            }
        });
        document.addEventListener('touchcancel', e => {
            for (const t of e.changedTouches) {
                if (t.identifier === joy.id) { joystickRelease(); break; }
            }
        });
    }

    // ── BOTÓN FIRE — autofire mientras se mantiene pulsado ──
    if (btnFire) {
        let fireInterval  = null;
        let fireTouch     = null;

        const startFire = () => {
            if (gamePhase !== 'PLAYING') return;
            shootPlasma();
            if (!fireInterval) {
                fireInterval = setInterval(() => {
                    if (gamePhase === 'PLAYING') shootPlasma();
                }, 80); // intervalo fijo rápido; el cooldown interno controla la cadencia real
            }
            btnFire.classList.add('pressed');
        };
        const stopFire = () => {
            clearInterval(fireInterval);
            fireInterval = null;
            fireTouch    = null;
            btnFire.classList.remove('pressed');
        };

        btnFire.addEventListener('touchstart', e => {
            e.preventDefault();
            fireTouch = e.changedTouches[0].identifier;
            startFire();
        }, { passive: false });

        btnFire.addEventListener('touchend', e => {
            for (const t of e.changedTouches) {
                if (t.identifier === fireTouch) { stopFire(); break; }
            }
        });
        btnFire.addEventListener('touchcancel', stopFire);

        // Soporte mouse (testing en desktop)
        btnFire.addEventListener('mousedown', startFire);
        btnFire.addEventListener('mouseup',   stopFire);
        btnFire.addEventListener('mouseleave',stopFire);
    }

    // ═══════════════════════════════════════════════
    // 7. MÁQUINA DE ESTADOS
    // ═══════════════════════════════════════════════
    let gamePhase    = 'MENU';
    let spawnInterval = null;

    function setPhase(phase) {
        gamePhase = phase;
        screenMenu.classList.toggle('active',          phase === 'MENU');
        screenGameOver.classList.toggle('active',      phase === 'GAMEOVER');
        screenLevelComplete.classList.toggle('active', phase === 'LEVEL_COMPLETE');
        screenVictory.classList.toggle('active',       phase === 'VICTORY');
        if (phase === 'PLAYING') startGame();
    }

    function startGame() {
        resetGameState();
        clearAllEntities();
        updateUI();

        MusicPlayer.play(gs.currentLevel);

        const lvl = LEVELS[gs.currentLevel];
        levelIntroTitle.textContent = `LEVEL ${gs.currentLevel + 1}: ${lvl.name}`;
        levelIntroSub.textContent   = lvl.sub;
        levelIntro.classList.remove('running');
        void levelIntro.offsetWidth;
        levelIntro.classList.add('running');

        requestAnimationFrame(gameLoop);

        setTimeout(() => {
            spawnEnemyRow();
            scheduleNextSpawn();
        }, S.initialEnemySpawnDelay);
    }

    function scheduleNextSpawn() {
        if (spawnInterval) clearInterval(spawnInterval);
        const baseDelay = LEVELS[gs.currentLevel].spawnDelay;
        const delay = Math.max(1200,
            baseDelay - Math.floor(gs.levelScore / S.difficultyStep) * 150
        );
        spawnInterval = setInterval(() => {
            if (gamePhase !== 'PLAYING') { clearInterval(spawnInterval); return; }
            spawnEnemyRow();
            scheduleNextSpawn();
        }, delay);
    }

    function triggerGameOver() {
        gamePhase = 'GAMEOVER';
        if (spawnInterval) clearInterval(spawnInterval);
        MusicPlayer.stop();
        finalScoreDisplay.textContent = `VIRUS PURGED: ${String(gs.currentScore).padStart(4,'0')}`;
        setTimeout(() => screenGameOver.classList.add('active'), 600);
    }

    function triggerLevelComplete() {
        if (gamePhase !== 'PLAYING') return;
        gamePhase = 'LEVEL_COMPLETE';
        if (spawnInterval) clearInterval(spawnInterval);
        // Bonus de vida al completar nivel
        gs.currentHealth = Math.min(100, gs.currentHealth + 20);
        updateUI();
        clearAllEntities();
        gs.enemies.length  = 0;
        gs.bullets.length  = 0;
        gs.powerUps.length = 0;

        saveProgress(gs.currentLevel);
        playLevelCompleteSound();
        MusicPlayer.stop();

        const isLastLevel = gs.currentLevel >= LEVELS.length - 1;

        if (isLastLevel) {
            // Show victory + last letter
            const letter = LOVE_LETTERS[gs.currentLevel];
            document.getElementById('victory-letter-text').textContent = letter.text;
            document.getElementById('victory-letter-sign').textContent = letter.sign;
            setTimeout(() => {
                gamePhase = 'VICTORY';
                screenVictory.classList.add('active');
            }, 600);
        } else {
            const letter = LOVE_LETTERS[gs.currentLevel];
            document.getElementById('letter-level-tag').textContent =
                `✦ NIVEL ${gs.currentLevel + 1} COMPLETADO ✦`;
            document.getElementById('letter-text').textContent  = letter.text;
            document.getElementById('letter-sign').textContent  = letter.sign;
            setTimeout(() => {
                gamePhase = 'LEVEL_COMPLETE';
                screenLevelComplete.classList.add('active');
            }, 600);
        }
    }

    function resetGameState() {
        gs.playerX            = S.width / 2;
        gs.bullets.length     = 0;
        gs.enemies.length     = 0;
        gs.powerUps.length    = 0;
        gs.gameActive         = true;
        gs.lastShotTime       = 0;
        gs.fireRate           = 280;
        gs.isAdrenalineActive = false;
        gs.isMultishotActive  = false;
        gs.levelScore         = 0;
        player.className      = 'idle-front';
        player.style.transform = 'translateX(0px)';
    }

    function fullReset() {
        gs.currentScore   = 0;
        gs.currentHealth  = 100;
        gs.currentLevel   = 0;
        resetGameState();
    }

    function clearAllEntities() {
        bulletContainer.innerHTML   = '';
        enemyContainer.innerHTML    = '';
        itemContainer.innerHTML     = '';
        particleContainer.innerHTML = '';
    }

    btnStart.addEventListener('click',   () => { fullReset(); setPhase('PLAYING'); });
    btnRestart.addEventListener('click', () => {
        screenGameOver.classList.remove('active');
        MusicPlayer.stop();
        setTimeout(() => { fullReset(); setPhase('PLAYING'); }, 400);
    });
    btnRestartVictory.addEventListener('click', () => {
        screenVictory.classList.remove('active');
        MusicPlayer.stop();
        setTimeout(() => { fullReset(); setPhase('PLAYING'); }, 400);
    });
    btnNextLevel.addEventListener('click', () => {
        screenLevelComplete.classList.remove('active');
        gs.currentLevel++;
        setTimeout(() => setPhase('PLAYING'), 400);
    });

    // ═══════════════════════════════════════════════
    // 8. MOVIMIENTO DEL JUGADOR
    // ═══════════════════════════════════════════════
    function updatePlayer() {
        if (keys['ArrowLeft'])  gs.playerX -= S.playerSpeed;
        if (keys['ArrowRight']) gs.playerX += S.playerSpeed;

        gs.playerX = Math.max(60, Math.min(S.width - 60, gs.playerX));
        player.style.transform = `translateX(${gs.playerX - S.width / 2}px)`;
    }

    // ═══════════════════════════════════════════════
    // 9. ANIMACIÓN DEL PERSONAJE
    //    Classes → battle_medic_sprites.png offsets
    // ═══════════════════════════════════════════════
    let walkFrame   = 0;
    let walkTimer   = 0;
    let shootFlash  = 0; // frames restantes de pose disparo

    function updatePlayerAnimation() {
        const movingLeft  = keys['ArrowLeft'];
        const movingRight = keys['ArrowRight'];
        const aimingUp    = keys['ArrowUp'];
        const isMoving    = movingLeft || movingRight;

        if (shootFlash > 0) {
            shootFlash--;
            // mantener pose de disparo unos frames
            return;
        }

        if (aimingUp && !isMoving) {
            player.className = 'aim-up';
            return;
        }

        if (isMoving) {
            walkTimer++;
            if (walkTimer % 12 === 0) walkFrame = 1 - walkFrame; // ciclo 2 frames

            if (movingRight) {
                player.className = walkFrame === 0 ? 'walk-right-a' : 'walk-right-b';
            } else {
                player.className = walkFrame === 0 ? 'walk-left-a'  : 'walk-left-b';
            }
        } else {
            walkFrame = 0; walkTimer = 0;
            player.className = 'idle-front';
        }
    }

    // ═══════════════════════════════════════════════
    // 10. DISPARO OMNIDIRECCIONAL (vectores vx/vy)
    // ═══════════════════════════════════════════════
    function shootPlasma() {
        if (gamePhase !== 'PLAYING') return;
        const now = Date.now();
        if (now - gs.lastShotTime < gs.fireRate) return;
        gs.lastShotTime = now;
        playShootSound();

        // Determinar dirección con las teclas presionadas
        let vx = 0, vy = 0, dirClass = 'dir-up';

        if (keys['ArrowUp']) {
            vy = S.bulletSpeed;  dirClass = 'dir-up';
        } else if (keys['ArrowDown']) {
            vy = -S.bulletSpeed; dirClass = 'dir-down';
        } else if (keys['ArrowLeft'] && keys['ArrowRight']) {
            vy = S.bulletSpeed;  dirClass = 'dir-up';
        } else if (keys['ArrowLeft']) {
            vx = -S.bulletSpeed; dirClass = 'dir-left';
        } else if (keys['ArrowRight']) {
            vx = S.bulletSpeed;  dirClass = 'dir-right';
        } else {
            vy = S.bulletSpeed;  dirClass = 'dir-up';
        }

        // Pose de disparo en el personaje
        shootFlash = 8;
        if      (dirClass === 'dir-right') player.className = 'shoot-right';
        else if (dirClass === 'dir-left')  player.className = 'shoot-left';
        else                               player.className = 'shoot-front';

        const bx = gs.playerX - 7;
        const by = 160;

        if (gs.isMultishotActive) {
            // 3 balas: centro + ±18° spread
            const spread = 0.32; // radianes (~18°)
            const baseAngle = Math.atan2(vy, vx);
            const angles = [baseAngle - spread, baseAngle, baseAngle + spread];
            angles.forEach((ang, idx) => {
                const bDiv = document.createElement('div');
                bDiv.className = `bullet ${dirClass} multishot-bullet`;
                bDiv.style.left   = `${bx + (idx - 1) * 18}px`;
                bDiv.style.bottom = `${by}px`;
                bulletContainer.appendChild(bDiv);
                gs.bullets.push({
                    element: bDiv,
                    x: bx + (idx - 1) * 18,
                    y: by,
                    vx: Math.cos(ang) * S.bulletSpeed,
                    vy: Math.sin(ang) * S.bulletSpeed
                });
            });
        } else {
            const bulletDiv = document.createElement('div');
            bulletDiv.className = `bullet ${dirClass}`;
            bulletDiv.style.left   = `${bx}px`;
            bulletDiv.style.bottom = `${by}px`;
            bulletContainer.appendChild(bulletDiv);
            gs.bullets.push({ element: bulletDiv, x: bx, y: by, vx, vy });
        }
    }

    function updateBullets() {
        for (let i = gs.bullets.length - 1; i >= 0; i--) {
            const b = gs.bullets[i];
            b.x += b.vx;
            b.y += b.vy;
            b.element.style.left   = `${b.x}px`;
            b.element.style.bottom = `${b.y}px`;

            // Eliminar si sale de los límites
            if (b.y > S.height || b.y < -40 || b.x > S.width + 20 || b.x < -20) {
                b.element.remove();
                gs.bullets.splice(i, 1);
            }
        }
    }

    // ═══════════════════════════════════════════════
    // 11. ENEMIGOS
    //     viral_invaders.png — 3 tipos con animación 2 frames
    // ═══════════════════════════════════════════════
    /*
     * background-position para frame 1 (col1, x=339) y frame 2 (col2, x=565):
     *   bgX_f1 = -(339-64) = -275   bgX_f2 = -(565-64) = -501
     *   bgY peon   = -(144-64) = -80
     *   bgY tank   = -(296-64) = -232
     *   bgY zigzag = -(440-64) = -376
     */
    const ENEMY_FRAMES = {
        'enemy-peon-1':   ['-275px -80px',  '-501px -80px' ],
        'enemy-tank-1':   ['-275px -232px', '-501px -232px'],
        'enemy-zigzag-1': ['-275px -376px', '-501px -376px']
    };

    const enemyTypes = [
        { cls: 'enemy-peon-1',   speed: 1,   score: 10, hp: 1 },
        { cls: 'enemy-tank-1',   speed: 0.5, score: 50, hp: 3 },
        { cls: 'enemy-zigzag-1', speed: 1.5, score: 30, hp: 1 }
    ];

    function spawnEnemyRow() {
        if (gamePhase !== 'PLAYING') return;
        const lvl     = LEVELS[gs.currentLevel];
        const cols    = lvl.cols;
        const spacing = (S.width - 100) / cols;
        const lvlMod  = lvl.enemySpeed;

        for (let i = 0; i < cols; i++) {
            // Ponderación de tipos según nivel
            const r = Math.random();
            let baseType;
            if (r < lvl.tankChance) {
                baseType = enemyTypes[1]; // tank
            } else if (r < lvl.tankChance + lvl.zigzagChance) {
                baseType = enemyTypes[2]; // zigzag
            } else {
                baseType = enemyTypes[0]; // peon
            }

            const type = { ...baseType, speed: baseType.speed * lvlMod };
            const enemyDiv = document.createElement('div');
            enemyDiv.className = `enemy entity ${type.cls}`;

            const startX = 50 + i * spacing;
            enemyDiv.style.left              = `${startX}px`;
            enemyDiv.style.top               = `-128px`;
            enemyDiv.style.backgroundPosition = ENEMY_FRAMES[type.cls][0];

            enemyContainer.appendChild(enemyDiv);
            gs.enemies.push({
                element: enemyDiv,
                x: startX, y: -128,
                type,
                hp:        type.hp,
                frame:     0,
                frameTick: Math.floor(Math.random() * 16)
            });
        }
    }

    function updateEnemies() {
        for (let i = gs.enemies.length - 1; i >= 0; i--) {
            const e = gs.enemies[i];
            e.y += e.type.speed;

            // Zig-zag para el parásito
            if (e.type.cls === 'enemy-zigzag-1') {
                e.x += Math.sin(e.y / 22) * 2.5;
                e.element.style.left = `${e.x}px`;
            }
            e.element.style.top = `${e.y}px`;

            // Animación de frames (cada 20 ticks)
            e.frameTick++;
            if (e.frameTick % 20 === 0) {
                e.frame = 1 - e.frame;
                e.element.style.backgroundPosition = ENEMY_FRAMES[e.type.cls][e.frame];
            }

            // Llegó al jugador
            if (e.y > S.height - 100) {
                spawnParticles(e.x + 64, e.y + 64, '#ff3366');
                e.element.remove();
                gs.enemies.splice(i, 1);
                takeDamage(S.enemyDamage);
            }
        }
    }

    // ═══════════════════════════════════════════════
    // 12. POWER-UPS
    // ═══════════════════════════════════════════════
    const itemTypes = ['item-adrenaline', 'item-medkit', 'item-serum', 'item-multishot'];

    function dropItem(x, y) {
        const lvl = LEVELS[gs.currentLevel];
        if (Math.random() > lvl.dropChance) return;

        // En niveles difíciles (6-10), medkit aparece con mayor frecuencia
        let pool;
        if (gs.currentLevel >= 7) {
            pool = ['item-medkit','item-medkit','item-adrenaline','item-multishot','item-serum'];
        } else if (gs.currentLevel >= 5) {
            pool = ['item-medkit','item-adrenaline','item-multishot','item-serum','item-medkit'];
        } else {
            pool = ['item-medkit','item-adrenaline','item-multishot','item-serum'];
        }
        const type    = pool[Math.floor(Math.random() * pool.length)];
        const itemDiv = document.createElement('div');
        itemDiv.className = `item entity ${type}`;
        itemDiv.style.left = `${x}px`;
        itemDiv.style.top  = `${y}px`;
        itemContainer.appendChild(itemDiv);
        gs.powerUps.push({ element: itemDiv, type, x, y });
    }

    function updatePowerUps() {
        const pRect = player.getBoundingClientRect();
        for (let i = gs.powerUps.length - 1; i >= 0; i--) {
            const item = gs.powerUps[i];
            item.y += 1.5;
            item.element.style.top = `${item.y}px`;

            if (isColliding(item.element.getBoundingClientRect(), pRect)) {
                applyPowerUp(item.type);
                item.element.remove();
                gs.powerUps.splice(i, 1);
                continue;
            }
            if (item.y > S.height) {
                item.element.remove();
                gs.powerUps.splice(i, 1);
            }
        }
    }

    function updatePowerupHUD() {
        if (!powerupStatus) return;
        powerupStatus.innerHTML = '';
        if (gs.isAdrenalineActive) {
            const p = document.createElement('span');
            p.className = 'status-pill adrena';
            p.textContent = '⚡ ADREN';
            powerupStatus.appendChild(p);
        }
        if (gs.isMultishotActive) {
            const p = document.createElement('span');
            p.className = 'status-pill multi';
            p.textContent = '✦ MULTI';
            powerupStatus.appendChild(p);
        }
    }

    function applyPowerUp(type) {
        if (type === 'item-medkit') {
            gs.currentHealth = Math.min(100, gs.currentHealth + 30);
            updateUI();
            showPickupFX('❤ +30 HP', '#ff3366');
        } else if (type === 'item-adrenaline' && !gs.isAdrenalineActive) {
            gs.isAdrenalineActive = true;
            gs.fireRate = 90;
            hud.classList.add('adrenaline-active');
            showPickupFX('⚡ ADRENALINA', '#ffcc00');
            updatePowerupHUD();
            setTimeout(() => {
                gs.fireRate = 280;
                gs.isAdrenalineActive = false;
                hud.classList.remove('adrenaline-active');
                updatePowerupHUD();
            }, 6000);
        } else if (type === 'item-serum') {
            gs.enemies.forEach(e => e.element.remove());
            gs.enemies.length = 0;
            showPickupFX('☣ SUERO VIRAL', '#00ffcc');
        } else if (type === 'item-multishot' && !gs.isMultishotActive) {
            gs.isMultishotActive = true;
            hud.classList.add('multishot-active');
            showPickupFX('✦ MULTI-SHOT', '#aa88ff');
            updatePowerupHUD();
            setTimeout(() => {
                gs.isMultishotActive = false;
                hud.classList.remove('multishot-active');
                updatePowerupHUD();
            }, 8000);
        }
    }

    function showPickupFX(text, color) {
        const fx = document.createElement('div');
        fx.textContent = text;
        fx.style.cssText = `
            position:absolute; left:50%; top:55%;
            transform:translateX(-50%);
            color:${color}; font-family:'Press Start 2P',cursive;
            font-size:13px; text-shadow:0 0 12px ${color};
            z-index:15; pointer-events:none;
            animation: pickupFloat 1.4s forwards;
        `;
        gameContainer.appendChild(fx);
        setTimeout(() => fx.remove(), 1400);
    }

    // ═══════════════════════════════════════════════
    // 13. DAÑO + SCREEN SHAKE
    // ═══════════════════════════════════════════════
    function takeDamage(amount) {
        gs.currentHealth = Math.max(0, gs.currentHealth - amount);
        updateUI();
        triggerScreenShake();
        playDamageSound();
        if (gs.currentHealth <= 0) triggerGameOver();
    }

    function triggerScreenShake() {
        gameContainer.classList.remove('shaking');
        void gameContainer.offsetWidth;
        gameContainer.classList.add('shaking');
        gameContainer.addEventListener('animationend',
            () => gameContainer.classList.remove('shaking'), { once: true });
    }

    // ═══════════════════════════════════════════════
    // 14. PARTÍCULAS
    // ═══════════════════════════════════════════════
    function spawnParticles(x, y, color = '#00ffcc') {
        const count = 8;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left       = `${x}px`;
            p.style.top        = `${y}px`;
            p.style.background = color;
            particleContainer.appendChild(p);

            const angle = (Math.PI * 2 / count) * i + Math.random() * 0.4;
            const speed = 2 + Math.random() * 4;
            let px = x, py = y, life = 30 + Math.floor(Math.random() * 20);

            (function animate() {
                if (life-- <= 0) { p.remove(); return; }
                px += Math.cos(angle) * speed;
                py += Math.sin(angle) * speed;
                p.style.left    = `${px}px`;
                p.style.top     = `${py}px`;
                p.style.opacity = `${life / 50}`;
                requestAnimationFrame(animate);
            })();
        }
    }

    // ═══════════════════════════════════════════════
    // 15. COLISIONES AABB
    // ═══════════════════════════════════════════════
    function isColliding(a, b) {
        return a.left < b.right && a.right > b.left &&
               a.top  < b.bottom && a.bottom > b.top;
    }

    function checkCollisions() {
        for (let bi = gs.bullets.length - 1; bi >= 0; bi--) {
            const bullet = gs.bullets[bi];
            const bRect  = bullet.element.getBoundingClientRect();

            for (let ei = gs.enemies.length - 1; ei >= 0; ei--) {
                const enemy = gs.enemies[ei];
                const eRect = enemy.element.getBoundingClientRect();

                if (!isColliding(bRect, eRect)) continue;

                // Reducir HP del enemigo
                enemy.hp--;
                if (enemy.hp <= 0) {
                    spawnParticles(enemy.x + 64, enemy.y + 64);
                    playEnemyDeathSound();
                    dropItem(enemy.x, enemy.y);
                    enemy.element.remove();
                    gs.enemies.splice(ei, 1);
                    gs.currentScore += enemy.type.score;
                    gs.levelScore   += enemy.type.score;
                    updateUI();
                    // Check level completion
                    if (gs.levelScore >= LEVELS[gs.currentLevel].scoreTarget) {
                        triggerLevelComplete();
                    }
                } else {
                    // Tank: flash al recibir daño
                    enemy.element.style.opacity = '0.4';
                    setTimeout(() => {
                        if (enemy.element.parentNode) enemy.element.style.opacity = '1';
                    }, 120);
                }

                // La bala siempre desaparece al impactar
                bullet.element.remove();
                gs.bullets.splice(bi, 1);
                break;
            }
        }
    }

    // ═══════════════════════════════════════════════
    // 16. UI
    // ═══════════════════════════════════════════════
    function updateUI() {
        healthBar.style.width = `${gs.currentHealth}%`;
        healthBar.classList.toggle('critical', gs.currentHealth <= 30);
        scoreDisplay.textContent = String(gs.currentScore).padStart(4, '0');
        if (levelDisplay) levelDisplay.textContent = `LEVEL ${gs.currentLevel + 1}`;
    }

    // ═══════════════════════════════════════════════
    // 17. LOOP PRINCIPAL
    // ═══════════════════════════════════════════════
    function gameLoop() {
        if (gamePhase !== 'PLAYING') return;

        updatePlayer();
        updatePlayerAnimation();
        updateBullets();
        updateEnemies();
        updatePowerUps();
        checkCollisions();

        requestAnimationFrame(gameLoop);
    }

    // ═══════════════════════════════════════════════
    // INIT
    // ═══════════════════════════════════════════════
    setPhase('MENU');
    console.log('Bio-Defense: Protocolo 01 — listo');
});