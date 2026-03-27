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
    const screenMenu        = document.getElementById('screen-menu');
    const screenGameOver    = document.getElementById('screen-gameover');
    const finalScoreDisplay = document.getElementById('final-score');
    const btnStart          = document.getElementById('btn-start');
    const btnRestart        = document.getElementById('btn-restart');

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
        isAdrenalineActive: false
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
        screenMenu.classList.toggle('active',     phase === 'MENU');
        screenGameOver.classList.toggle('active', phase === 'GAMEOVER');
        if (phase === 'PLAYING') startGame();
    }

    function startGame() {
        resetGameState();
        clearAllEntities();
        updateUI();

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
        const delay = Math.max(1500,
            S.enemyRowSpawnDelay - Math.floor(gs.currentScore / S.difficultyStep) * 300
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

    function resetGameState() {
        gs.playerX            = S.width / 2;
        gs.bullets.length     = 0;
        gs.enemies.length     = 0;
        gs.powerUps.length    = 0;
        gs.gameActive         = true;
        gs.currentScore       = 0;
        gs.currentHealth      = 100;
        gs.lastShotTime       = 0;
        gs.fireRate           = 280;
        gs.isAdrenalineActive = false;
        player.className      = 'idle-front';
        player.style.transform = 'translateX(0px)';
    }

    function clearAllEntities() {
        bulletContainer.innerHTML   = '';
        enemyContainer.innerHTML    = '';
        itemContainer.innerHTML     = '';
        particleContainer.innerHTML = '';
    }

    btnStart.addEventListener('click',   () => setPhase('PLAYING'));
    btnRestart.addEventListener('click', () => {
        screenGameOver.classList.remove('active');
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
            vy = S.bulletSpeed;  dirClass = 'dir-up';   // ambas → arriba
        } else if (keys['ArrowLeft']) {
            vx = -S.bulletSpeed; dirClass = 'dir-left';
        } else if (keys['ArrowRight']) {
            vx = S.bulletSpeed;  dirClass = 'dir-right';
        } else {
            vy = S.bulletSpeed;  dirClass = 'dir-up';   // default arriba
        }

        // Pose de disparo en el personaje
        shootFlash = 8;
        if      (dirClass === 'dir-right') player.className = 'shoot-right';
        else if (dirClass === 'dir-left')  player.className = 'shoot-left';
        else                               player.className = 'shoot-front';

        const bulletDiv  = document.createElement('div');
        bulletDiv.className = `bullet ${dirClass}`;

        // Origen: centro del personaje
        const bx = gs.playerX - 7;
        const by = 160; // px desde el bottom (altura aproximada del arma)

        bulletDiv.style.left   = `${bx}px`;
        bulletDiv.style.bottom = `${by}px`;
        bulletContainer.appendChild(bulletDiv);

        gs.bullets.push({ element: bulletDiv, x: bx, y: by, vx, vy });
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
        const cols    = 8;
        const spacing = (S.width - 100) / cols;

        for (let i = 0; i < cols; i++) {
            const type     = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
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
                hp:         type.hp,
                frame:      0,
                frameTick:  Math.floor(Math.random() * 16) // offset para desincronizar
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
    const itemTypes = ['item-adrenaline', 'item-medkit', 'item-serum'];

    function dropItem(x, y) {
        if (Math.random() > S.dropChance) return;
        const type    = itemTypes[Math.floor(Math.random() * itemTypes.length)];
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

    function applyPowerUp(type) {
        if (type === 'item-medkit') {
            gs.currentHealth = Math.min(100, gs.currentHealth + 25);
            updateUI();
        } else if (type === 'item-adrenaline' && !gs.isAdrenalineActive) {
            gs.isAdrenalineActive = true;
            gs.fireRate = 100;
            hud.classList.add('adrenaline-active');
            setTimeout(() => {
                gs.fireRate = 280;
                gs.isAdrenalineActive = false;
                hud.classList.remove('adrenaline-active');
            }, 5000);
        } else if (type === 'item-serum') {
            gs.enemies.forEach(e => e.element.remove());
            gs.enemies.length = 0;
        }
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
                    updateUI();
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