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
    // 2. CONFIGURACIÓN
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
        const scaleX = window.innerWidth  / S.width;
        const scaleY = window.innerHeight / S.height;
        const scale  = Math.min(scaleX, scaleY);
        const ox = (window.innerWidth  - S.width  * scale) / 2;
        const oy = (window.innerHeight - S.height * scale) / 2;
        gameContainer.style.transform       = `scale(${scale})`;
        gameContainer.style.transformOrigin = 'top left';
        gameContainer.style.left            = `${ox}px`;
        gameContainer.style.top             = `${oy}px`;
    }
    scaleGameToFit();
    window.addEventListener('resize', scaleGameToFit);

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
        if (gamePhase !== 'PLAYING') return;
        if (e.key === ' ' || e.key === 'z' || e.key === 'Z') {
            e.preventDefault();
            shootPlasma();
        }
    });
    document.addEventListener('keyup', e => { keys[e.key] = false; });

    // ═══════════════════════════════════════════════
    // 6. CONTROLES MÓVIL — TOUCH
    // ═══════════════════════════════════════════════
    function bindDpadBtn(id, key) {
        const btn = document.getElementById(id);
        if (!btn) return;

        const press   = () => { keys[key] = true;  btn.classList.add('pressed'); };
        const release = () => { keys[key] = false; btn.classList.remove('pressed'); };

        btn.addEventListener('touchstart', e => { e.preventDefault(); press(); },   { passive: false });
        btn.addEventListener('touchend',   e => { e.preventDefault(); release(); }, { passive: false });
        btn.addEventListener('touchcancel',e => { e.preventDefault(); release(); }, { passive: false });
        // soporte mouse para prueba en desktop
        btn.addEventListener('mousedown', press);
        btn.addEventListener('mouseup',   release);
        btn.addEventListener('mouseleave',release);
    }

    bindDpadBtn('btn-left',  'ArrowLeft');
    bindDpadBtn('btn-right', 'ArrowRight');
    bindDpadBtn('btn-up',    'ArrowUp');
    bindDpadBtn('btn-down',  'ArrowDown');

    const btnFire = document.getElementById('btn-fire');
    if (btnFire) {
        let fireInterval = null;
        const startFire = () => {
            if (gamePhase !== 'PLAYING') return;
            shootPlasma();
            fireInterval = setInterval(() => {
                if (gamePhase === 'PLAYING') shootPlasma();
            }, gs.fireRate);
            btnFire.classList.add('pressed');
        };
        const stopFire = () => {
            clearInterval(fireInterval);
            btnFire.classList.remove('pressed');
        };
        btnFire.addEventListener('touchstart', e => { e.preventDefault(); startFire(); }, { passive: false });
        btnFire.addEventListener('touchend',   e => { e.preventDefault(); stopFire();  }, { passive: false });
        btnFire.addEventListener('touchcancel',e => { e.preventDefault(); stopFire();  }, { passive: false });
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
        setTimeout(() => { fullReset(); setPhase('PLAYING'); }, 400);
    });
    btnRestartVictory.addEventListener('click', () => {
        screenVictory.classList.remove('active');
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