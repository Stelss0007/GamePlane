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

var lastRepaintTime=window.performance.now();

var audioBuh = new Audio('sound/buh.ogg');
var audioShot = new Audio('sound/shot.ogg');
// Create the canvas
var content = document.getElementById('content');

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
//canvas.width = (document.body.clientWidth < 512) ? document.body.clientWidth : 512;
//canvas.height = 480;

// ...then set the internal size to match
canvas.width  = content.offsetWidth;
canvas.height = content.offsetHeight;
//document.body.appendChild(canvas);

content.appendChild(canvas);

// The main game loop
var lastTime;

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

    document.getElementById('play-again').addEventListener('click', function() {
        reset();
    });
    
    document.getElementById('btnFire').addEventListener('click', function() {
        playerFire();
    });

    reset();
    lastTime = Date.now();
    main();
}

resources.load([
    'img/sprites.png',
    'img/rocket2.png',
    'img/rocket1.png',
    'img/background.jpg',
    'img/plane-oponent0-70.png',
    'img/plane-oponent1-70.png',
    'img/plane-oponent2-70.png',
    'img/plane-oponent3-70.png',
    'img/plane1-70.png',
    'img/clouds_layer1.png',
    'img/clouds_layer2.png',
    'img/land_layer_1.jpg',
]);
resources.onReady(init);

var wall = document.getElementById("content");


//Облака
var cloudsLayer1 = {
    pos: [0, -600],
    sprite: new Sprite('img/clouds_layer1.png', [0, 0], [600, 1200])
};
var cloudsLayer2 = {
    pos: [0, -300],
    sprite: new Sprite('img/clouds_layer2.png', [0, 0], [600, 1200])
};
var landLayer1 = {
    pos: [0, -900],
    sprite: new Sprite('img/land_layer_1.jpg', [0, 0], [600, 1569])
};

var cloudsLayer1Speed = 30;
var cloudsLayer2Speed = 35;
var landLayer1Speed = 25;

// Game state
var player = {
    pos: [0, 0],
    sprite: new Sprite('img/plane1-70.png', [0, 0], [70, 56], 16, [0, 1], 'vertical')
};

var enemyPlaneNumber = '0';

var bullets = [];
var enemyBullets = [];

var enemies = [];
var explosions = [];
var enemyCanFire = false;

var enemyLastFire = Date.now();
var lastFire = Date.now();
var gameTime = 0;
var isGameOver;
var terrainPattern;

var score = 0;
var scoreEl = document.getElementById('score');

// Speed in pixels per second
var playerSpeed = 200;
var bulletSpeed = 500;

var enemyBulletsSpeed = 300;
var enemySpeed = 50;


function addEnemy() {
    
    enemies.push({
            pos: [Math.random() * (canvas.width - 70),
                  -50 ],
            sprite: new Sprite('img/plane-oponent'+enemyPlaneNumber+'-70.png', [0, 0], [70, 56], 16, [0, 1], 'vertical')
        });
}

// Update game objects
function update(dt) {
    gameTime += dt;
//console.log(gameTime);
    handleInput(dt);
    updateEntities(dt);

    // It gets harder over time by adding enemies using this
    // equation: 1-.993^gameTime
//    if(Math.random() < 1 - Math.pow(.993, gameTime)) {
//         addEnemie();
//    }

    checkCollisions();

    scoreEl.innerHTML = score;
    if(score > 1000) {
        enemyPlaneNumber = '1';
        enemyCanFire = true;
    }
    if(score > 3000) {
        enemyPlaneNumber = '2';
        enemySpeed = 60;
    }
    if(score > 4000) {
        enemyPlaneNumber = '3';
        enemySpeed = 70;   
    }
    if(score > 5000) {
        enemyPlaneNumber = '3';
        enemySpeed = 80;    
    } 
};
 
function handleInput(dt) {
    if(input.isDown('DOWN') || input.isDown('s')) {
        player.pos[1] += playerSpeed * dt;
    }

    if(input.isDown('UP') || input.isDown('w')) {
        player.pos[1] -= playerSpeed * dt;
    }

    if(input.isDown('LEFT') || input.isDown('a')) {
        player.pos[0] -= playerSpeed * dt;
        
        //scoreEl.innerHTML = 'LEFT';
    }

    if(input.isDown('RIGHT') || input.isDown('d')) {
        player.pos[0] += playerSpeed * dt;
        
        //scoreEl.innerHTML = 'RIGHT';
    }

    if(input.isDown('SPACE') &&
       !isGameOver &&
       Date.now() - lastFire > 100) {
        playerFire();
    }
}


function playerFire() {
    playShot();
    var x = player.pos[0] + player.sprite.size[0] / 2;
    var y = player.pos[1] + player.sprite.size[1] / 2;
  
    bullets.push({ pos: [x, y],
                   dir: 'up',
                   sprite: new Sprite('img/rocket2.png', [0, 0], [10, 20 ]) });
//    bullets.push({ pos: [x, y],   
//                   dir: 'down',
//                   sprite: new Sprite('img/sprites.png', [0, 60], [9, 5]) });

    lastFire = Date.now();
}

function enemyFire(enemy) {
    
    if(
       !isGameOver &&
       enemyCanFire &&
       Date.now() - enemyLastFire > 200 &&
       enemy.pos[1] > 20
       ) {
        var x = enemy.pos[0] + enemy.sprite.size[0] / 2;
        var y = enemy.pos[1] + enemy.sprite.size[1] / 2;

        //addEnemy(); 
        enemyBullets.push({ pos: [x, y],
                       dir: 'down',
                       sprite: new Sprite('img/rocket1.png', [0, 0], [13, 20]) 
                       });
        enemyLastFire = Date.now();
    }
}

function updateEntities(dt) {
    // Update the player sprite animation
    player.sprite.update(dt);
    
    
    //Update clouds
    cloudsLayer1.pos[1] += cloudsLayer1Speed * dt;
    if(cloudsLayer1.pos[1] > canvas.height) {
        cloudsLayer1.pos[1] = -800;
    }
    cloudsLayer2.pos[1] += cloudsLayer2Speed * dt;
    if(cloudsLayer2.pos[1] > canvas.height) {
        cloudsLayer2.pos[1] = -1100;
    }
    
    landLayer1.pos[1] += landLayer1Speed * dt;
    if((landLayer1.pos[1] + canvas.height)  > canvas.height) {
        landLayer1.pos[1] = -600;
    }

    // Update all the bullets
    for(var i=0; i<bullets.length; i++) {
        var bullet = bullets[i];

        switch(bullet.dir) {
        case 'up': bullet.pos[1] -= bulletSpeed * dt; break;
        case 'down': bullet.pos[1] += bulletSpeed * dt; break;
        default:
            bullet.pos[0] += bulletSpeed * dt;
        }

        // Remove the bullet if it goes offscreen
        if(bullet.pos[1] < 0 || bullet.pos[1] > canvas.height ||
           bullet.pos[0] > canvas.width) {
            bullets.splice(i, 1);
            i--;
        }
    }
    
    // Update all the bullets
    for(var i=0; i<enemyBullets.length; i++) {
        var bullet = enemyBullets[i];

        switch(bullet.dir) {
            case 'up': bullet.pos[1] -= enemyBulletsSpeed * dt; break;
            case 'down': bullet.pos[1] += enemyBulletsSpeed * dt; break;
            default:
                bullet.pos[0] += enemyBulletsSpeed * dt;
        }

        // Remove the bullet if it goes offscreen
        if(bullet.pos[1] < 0 || bullet.pos[1] > canvas.height ||
           bullet.pos[0] > canvas.width) {
            enemyBullets.splice(i, 1);
            i--;
        }
    }

    // Update all the enemies
    for(var i=0; i<enemies.length; i++) {
        enemies[i].pos[1] += enemySpeed * dt;
        enemies[i].sprite.update(dt);

        //Enemy fire
        if(Math.abs(enemies[i].pos[0] - player.pos[0]) < 35){
            enemyFire(enemies[i]);
        }
        
        // Remove if offscreen
        if(enemies[i].pos[1] + enemies[i].sprite.size[1] > canvas.height + 60) {
            enemies.splice(i, 1);
            i--;
            //Add New Enemy
            addEnemy();
        }
    }

    // Update all the explosions
    for(var i=0; i<explosions.length; i++) {
        explosions[i].sprite.update(dt);

        // Remove if animation is done
        if(explosions[i].sprite.done) {
            explosions.splice(i, 1);
            i--;
        }
    }
}

// Collisions

function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1]);
}

function checkCollisions() {
    checkPlayerBounds();
    
    // Run collision detection for all enemies and bullets
    for(var i=0; i<enemies.length; i++) {
        var pos = enemies[i].pos;
        var size = enemies[i].sprite.size;

        //Check collides 
        for(var j=0; j<bullets.length; j++) {
            var pos2 = bullets[j].pos;
            var size2 = bullets[j].sprite.size;

            if(boxCollides(pos, size, pos2, size2)) {
                playBuh();
                // Remove the enemy
                enemies.splice(i, 1);
                i--;

                // Add score
                score += 100;

                // Add an explosion
                explosions.push({
                    pos: pos,
                    sprite: new Sprite('img/sprites.png',
                                       [0, 117],
                                       [39, 39],
                                       16,
                                       [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                                       null,
                                       true)
                });

                // Remove the bullet and stop this iteration
                bullets.splice(j, 1);
                
                //Add New Enemie
                addEnemy();
                break;
            }
        }

        if(boxCollides(pos, size, player.pos, player.sprite.size)) {
            playBuh();
            enemies.splice(i, 1);
            explosions.push({
                pos: player.pos,
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
    for(var j=0; j<enemyBullets.length; j++) {
        var pos2 = enemyBullets[j].pos;
        var size2 = enemyBullets[j].sprite.size;

        if(boxCollides(player.pos, player.sprite.size, pos2, size2)) {
            // Add an explosion
            playBuh();
            explosions.push({
                pos: player.pos,
                sprite: new Sprite('img/sprites.png',
                                   [0, 117],
                                   [39, 39],
                                   16,
                                   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                                   null,
                                   true)
            });

            // Remove the bullet and stop this iteration
            enemyBullets.splice(j, 1);
            
            //Add New Enemie
            gameOver();
            break;
        }
    }
}

function checkPlayerBounds() {
    // Check bounds
    if(player.pos[0] < 0) {
        player.pos[0] = 0;
    }
    else if(player.pos[0] > canvas.width - player.sprite.size[0]) {
        player.pos[0] = canvas.width - player.sprite.size[0];
    }

    if(player.pos[1] < 0) {
        player.pos[1] = 0;
    }
    else if(player.pos[1] > canvas.height - player.sprite.size[1]) {
        player.pos[1] = canvas.height - player.sprite.size[1];
    }
}



// Draw everything
function render() {
    
    renderMap();
        
    // Render the player if the game isn't over
    if(!isGameOver) {
        renderEntity(player);
    }

    renderEntities(bullets);
    renderEntities(enemyBullets);
    renderEntities(enemies);
    renderEntities(explosions);
};

function renderMap() {
    ctx.fillStyle = '#2858FF';//terrainPattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    renderEntity(landLayer1);
    renderEntity(cloudsLayer1);
    renderEntity(cloudsLayer2);
}

function renderEntities(list) {
    for(var i=0; i<list.length; i++) {
        renderEntity(list[i]);
    }    
}

function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx);
    ctx.restore();
}

// Game over
function gameOver() {
    navigator.vibrate(500);
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    isGameOver = true;
}

function playBuh() {
    audioBuh.play();
}

function playShot() {
    audioShot.play();
}

// Reset game to original state
function reset() {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    isGameOver = false;
    
    enemyPlaneNumber = '0';
    enemySpeed = 50;
    enemyCanFire = false;
    
    gameTime = 0;
    score = 0;

    enemies = [];
    bullets = [];
    enemyBullets = [];

    player.pos = [50, canvas.height / 2];
    //moveBackground(0);
    addEnemy();
};

