// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

resources.load([
    'img/sprites.png',
    'img/buhh.png',
    'img/rocket2.png',
    'img/rocket1.png',
    'img/background.jpg',
    'img/radar.jpg',
    'img/enemy/plane-oponent0-70.png',
    'img/enemy/plane-oponent1-70.png',
    'img/enemy/plane-oponent2-70.png',
    'img/enemy/plane-oponent3-70.png',
    'img/enemy/plane-oponent4-70.png',
    'img/enemy/plane-oponent5-70.png',
    'img/enemy/plane-oponent6-70.png',
    
    'img/player/plane-f-16.png',
    'img/player/plane-su-34.png',
    'img/player/plane-f-15.png',
    'img/player/plane-f-15-2.png',
    
    'img/clouds_layer1.png',
    'img/clouds_layer2.png',
    'img/land_layer_1.jpg',
    'img/bonuses.png',
]);
resources.onReady(init);

var lastRepaintTime=window.performance.now();

// The main game loop
var lastTime;
//Бонусы
var bonuse = null;

var enemyPlaneNumber = '0';
var enemySpeed = 50;
var enemies = [];
var explosions = [];

var gameTime = 0;
var isGameOver;
var terrainPattern;
var radarPattern;

var score = 0;

var wall = document.getElementById("content");
var scoreEl = document.getElementById('score');
var playerLifeEl = document.getElementById('life');
var bonuseConteiner = document.getElementById('bonuse-conteiner');
var bonuseName = document.getElementById('bonuse-name');
var bonuseTime = document.getElementById('bonuse-time');

// Create the canvas
var content = document.getElementById('content');
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

var radarCanvas = document.getElementById("radar-conteiner");
var radarCtx = radarCanvas.getContext("2d");
// ...then set the internal size to match
canvas.width  = content.offsetWidth;
canvas.height = content.offsetHeight;
content.appendChild(canvas);


var sound = new soundClass();
var map = new mapClass();
var enemyBullets = new enemyBulletClass();
var player = new PlayerClass();
var enemyCanFire = false;

function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    update(dt);
    render();

    lastTime = now;
    requestAnimFrame(main);
};

function init() {
    terrainPattern = ctx.createPattern(resources.get('img/background.jpg'), 'repeat');
    radarPattern = ctx.createPattern(resources.get('img/radar.jpg'), 'no-repeat');

    document.getElementById('play-again').addEventListener('click', function() {
        reset();
    });
    
    document.getElementById('btnFire').addEventListener('click', function() {
        player.fire();
    });

    reset();
    lastTime = Date.now();
    main();
}

function addEnemy() {
    var enemyPlaneNumber = 0;
    if(score > 1000) {
        enemyPlaneNumber = getRandomInt(1, 6);
        enemyCanFire = true;
    }
    if(score > 3000) {
        enemySpeed = 60;
    }
    if(score > 4000) {
        enemySpeed = 70;   
    }
    if(score > 5000) {
        enemySpeed = 80;    
    }

    
    var enemy = new enemyClass(enemyPlaneNumber);
    enemy.speed = enemySpeed;
    enemy.canFire = enemyCanFire;
    enemies.push(enemy);
}

// Update game objects
function update(dt) {
    
    gameTime += dt;
    handleInput(dt);
    updateEntities(dt);

    // It gets harder over time by adding enemies using this
    // equation: 1-.993^gameTime
//    if(Math.random() < 1 - Math.pow(.993, gameTime)) {
//         addEnemie();
//    }

    checkCollisions();

    scoreEl.innerHTML = score;
    playerLifeEl.innerHTML = player.life;
};
 
function handleInput(dt) {
    var delta = input.delta();
    
    //scoreEl.innerHTML = delta.x + ' - ' + delta.y;
    
    if(input.isDown('DOWN') || input.isDown('s')) {
        player.position.y += player.speed * dt + delta.y;
    }

    if(input.isDown('UP') || input.isDown('w')) {
        player.position.y -= player.speed * dt + delta.y;
    }

    if(input.isDown('LEFT') || input.isDown('a')) {
        player.position.x -= player.speed * dt + delta.x;
        
        //scoreEl.innerHTML = 'LEFT';
    }

    if(input.isDown('RIGHT') || input.isDown('d')) {
        player.position.x += player.speed * dt + delta.x;
        
        //scoreEl.innerHTML = 'RIGHT';
    }

    if((input.isDown('SPACE') || (player.bonuse && player.bonuse.fireAuto)) &&
        !isGameOver &&
        Date.now() - player.lastFire > 100) 
    {
        player.fire();
    }
}



function updateEntities(dt) {
    // Update the player sprite animation
    player.sprite.update(dt);
    
    map.update(dt);
    
    // Update all the bullets
    player.updateBulets(dt);
 
    // Update all the enemies
    for(var i=0; i<enemies.length; i++) {
       
        enemies[i].position.y += enemies[i].speed * dt;
        enemies[i].sprite.update(dt);

        //Enemy fire
        if(Math.abs(enemies[i].position.x - player.position.x) < 35){
            enemies[i].fire();
        }

        // Remove if offscreen
        if(enemies[i].position.y + enemies[i].sprite.size[1] > canvas.height + 60) {
            enemies.splice(i, 1);
            i--;
            //Add New Enemy
            addEnemy();
        }
    }
    
    enemyBullets.updateBulets(dt);

    // Update all the explosions
    for(var i=0; i<explosions.length; i++) {
        explosions[i].sprite.update(dt);

        // Remove if animation is done
        if(explosions[i].sprite.done) {
            explosions.splice(i, 1);
            i--;
        }
    }
    
    //Update Bonuse
    if(bonuse) {
        bonuse.position.y += bonuse.speed * dt;
        bonuse.sprite.update(dt);
        if(bonuse.position.y + bonuse.sprite.size[1] > canvas.height + 60) {
            bonuse = null; 
        }
    }
}

// Collisions

function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos.x, pos.y,
                    pos.x + size[0], pos.y + size[1],
                    pos2.x, pos2.y,
                    pos2.x + size2[0], pos2.y + size2[1]);
}

function checkCollisions() {
    checkPlayerBounds();
    
    // Run collision detection for all enemies and bullets
    for(var i=0; i<enemies.length; i++) {
        var pos = enemies[i].position;
        var size = enemies[i].sprite.size;

        //Check collides 
        for(var j=0; j<player.bullets.length; j++) {
            var pos2 = player.bullets[j].position;
            var size2 = player.bullets[j].sprite.size;

            if(boxCollides(pos, size, pos2, size2)) {
                sound.buh().play();
                // Remove the enemy
                enemies.splice(i, 1);
                i--;

                // Add score
                score += 100;

                // Add an explosion
                explosions.push({
                    position: pos,
                    sprite: new Sprite('img/sprites.png',
                                       [0, 117],
                                       [39, 39],
                                       16,
                                       [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                                       null,
                                       true)
                });
        
                if ((score%1100) == 0) {
                    var bonuseInex = getRandomInt(0, 4);
                    bonuse  = new BonuseClass(bonuseInex); 
                    bonuse.position = pos2;
                };

                // Remove the bullet and stop this iteration
                player.bullets.splice(j, 1);
                
                //Add New Enemie
                addEnemy();
                break;
            }
        }

        if(boxCollides(pos, size, player.position, player.sprite.size)) {
 
            sound.buh().play();
            enemies.splice(i, 1);
            explosions.push({
                position: player.position,
                sprite: new Sprite('img/sprites.png',
                                   [0, 117],
                                   [39, 39],
                                   16,
                                   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                                   null,
                                   true)
            });
            gameOver();

        }
    }
    
    
    //Check killed player
    if(enemyBullets)
    for(var j=0; j < enemyBullets.bullets.length; j++) {
        var pos2 = enemyBullets.bullets[j].position;
        var size2 = enemyBullets.bullets[j].sprite.size;

        if(boxCollides(player.position, player.sprite.size, pos2, size2)) {
            // Add an explosion
            if(player.life<=1) {
                sound.buh().play();
                explosions.push({
                    position: player.position,
                    sprite: new Sprite('img/sprites.png',
                                       [0, 117],
                                       [39, 39],
                                       16,
                                       [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                                       null,
                                       true)
                });

                //Add New Enemie
                gameOver();
                break;
            }

            pos2.y += 20; 
            explosions.push({
                    position: pos2,
                    sprite: new Sprite('img/buhh.png',
                                       [0, 0],
                                       [15, 15],
                                       16,
                                       [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                                       null,
                                       true)
                });
            sound.buhSmall().play();
            
            if(player.bonuse.guard){
                enemyBullets.bullets.splice(j, 1);
                continue;
            }
            
            playerCollised();
            navigator.vibrate(200);
            player.life -= 1;

            // Remove the bullet and stop this iteration
            enemyBullets.bullets.splice(j, 1);
            break;
        }
    }
     
    //Bonuse collise
    if(bonuse) {
        if(boxCollides(player.position, player.sprite.size, bonuse.position, bonuse.sprite.size)) {
            sound.bonuse().play();
             
            player.bonuse = bonuse.getBonuseInfo();
            if(player.bonuse.life) {
                player.life++;
            }
            player.bonuse.created = window.performance.now();
            bonuseName.innerHTML = player.bonuse.name;
            bonuseConteiner.style.display = 'block';
            bonuse = null;
        }
    }
}

function checkPlayerBounds() {
    // Check bounds
    if(player.position.x < 0) {
        player.position.x = 0;
    }
    else if(player.position.x > canvas.width - player.sprite.size[0]) {
        player.position.x = canvas.width - player.sprite.size[0];
    }

    if(player.position.y < 0) {
        player.position.y = 0;
    }
    else if(player.position.y > ((canvas.height - player.sprite.size[1]) - 20)) {
        player.position.y = ((canvas.height - player.sprite.size[1]) - 20);
    }
}



// Draw everything
function render() {
    renderRadar();
    map.render();
    // Render the player if the game isn't over
    if(!isGameOver) {
        renderEntity(player);
        if(player.bonuse) {
            bonuseTime.innerHTML = parseInt((player.bonuse.time - (window.performance.now() - player.bonuse.created))/1000) + 'c';
            if((window.performance.now() - player.bonuse.created) > player.bonuse.time) {
                player.bonuse = null;
                bonuseConteiner.style.display = 'none';
            }
        }
    }
    
    if(bonuse){
        renderEntity(bonuse);
    }
    
    renderEntities(player.bullets);
    renderEntities(enemies);
    renderEntities(enemyBullets.bullets);
    renderEntities(explosions);
};

function renderRadar() {
    radarCtx.drawImage(resources.get('img/radar.jpg'), 0, 0, 100, 100);
    
    var delta = canvas.width / (radarCanvas.width - 15);
    
    for(var i=0; i<enemies.length; i++) {
        var pointX = enemies[i].position.x / delta;
        radarCtx.fillStyle = '#ff0000';
        radarCtx.fillRect(pointX + 15,30,4,4);
    }
    
//    radarCtx.fillStyle = radarPattern;
//    radarCtx.fillRect(0, 0, 100, 100);
}

function renderEntities(list) {
    for(var i=0; i<list.length; i++) {
        renderEntity(list[i]);
    }    
}

function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.position.x, entity.position.y);
    entity.sprite.render(ctx);
    ctx.restore();
}

// Game over
function gameOver() {
    sound.background().pause();
    navigator.vibrate(500);
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    isGameOver = true;
}

function playerCollised() {
    document.getElementById('player-collised-overlay').style.display = 'block';
    content.classList.add('collised');
    
    setTimeout(function(){
        document.getElementById('player-collised-overlay').style.display = 'none';
        content.classList.remove('collised');
    }, 500);
}

// Reset game to original state
function reset() {
    sound.background().play();
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    isGameOver = false;
    gameTime = 0;
    score = 0;
    enemyCanFire = false;
    enemySpeed = 50;
    enemies = [];
    
    map = new mapClass();
    enemyBullets = new enemyBulletClass();
    player = new PlayerClass();
    enemyCanFire = false;
    
    player = new PlayerClass();

    addEnemy();
};

