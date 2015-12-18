var enemyClass = function(enemyTypeIndex){
    
    enemyTypeIndex = enemyTypeIndex || 0;
    
    this.position = {
        x: Math.random() * (canvas.width - 80),
        y: -50
    };
    
    this.spriteProperties = {
        imgUrl: 'img/enemy/plane-oponent'+enemyTypeIndex+'-70.png',
        position: {
            x: 0, 
            y: 0
        },
        size: {
            width: 75,
            height: 56
        },
        speed: 16,
        frames: [0,1],
        direct: 'vertical'
    }; 
    
    /**
     * Описание обекта Пуля/Ракета
     */
    this.rocketObject = {
        imgUrl: 'img/rocket1.png',
        position: {
            x: 0, 
            y: 0
        },
        size: {
            width: 10,
            height: 20
        }
    }; 
    
    this.canFire = true;
    this.damage = 1;
    this.life  = 1;
    this.speed = 50;
    this.bulletSpeed = 300;
    this.lastFire = Date.now();
    
    this.bullets = [];
    this.bonus = null;
    
    /**
     * Создание спрайта пули/ракеты
     * @returns {Sprite}
     */
    this.createBulletSprite = function() {
        return new Sprite(this.rocketObject.imgUrl, [0, 0], [10, 20]);
    };
    
    /**
     * Выстрел игрока 
     */
    this.fire = function(){
        if(
            !isGameOver &&
            this.canFire &&
            Date.now() - this.lastFire > 200 &&
            this.position.y > 20
        ) {
            var x = this.position.x + this.sprite.size[0] / 2 - 10;
            var y = this.position.y + this.sprite.size[1];

            enemyBullets.bullets.push({ 
                    speed: this.bulletSpeed,
                    position: {x: x, y: y},
                    dir: 'down',
                    sprite: this.createBulletSprite() 
                });

            this.lastFire = Date.now();
        }
    };
    
    
    this.updateBulets = function(dt) {
        // Update all the bullets
        for(var i=0; i< this.bullets.length; i++) {
            var bullet = this.bullets[i];
            switch(bullet.dir) {
                case 'up': bullet.position.y -= this.bulletSpeed * dt; break;
                case 'down': bullet.position.y += this.bulletSpeed * dt; break;
                default:
                    bullet.position.x += this.bulletSpeed * dt;
            }

            // Remove the bullet if it goes offscreen
            if(bullet.position.y < 0 || bullet.position.y > canvas.height ||
               bullet.position.x > canvas.width) {
                this.bullets.splice(i, 1);
                i--;
            }
        }
    };

    /** 
     * Создаем спрайт игрока, прорисовка
     */
    this.sprite = new Sprite(
            this.spriteProperties.imgUrl, 
            [this.spriteProperties.position.x, this.spriteProperties.position.y],
            [this.spriteProperties.size.width, this.spriteProperties.size.height],
            this.spriteProperties.speed,
            this.spriteProperties.frames,
            this.spriteProperties.direct
        );


   
    
    return this;
};


