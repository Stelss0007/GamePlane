/** Обект Игрок **/
var PlayerClass = function(){
    this.position = {
        x: canvas.width/2,
        y: canvas.height/2
    };
    
    this.spriteProperties = {
        imgUrl: 'img/player/plane-f-15-2.png',
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
        imgUrl: 'img/rocket2.png',
        position: {
            x: 0, 
            y: 0
        },
        size: {
            width: 10,
            height: 20
        }
    }; 
    
    this.damage = 1;
    this.life  = 5;
    this.speed = 240;
    this.bulletSpeed = 500;
    this.lastFire = Date.now();
    
    this.bullets = [];
    this.bonuse = null;
    
    /**
     * Создание спрайта пули/ракеты
     * @returns {Sprite}
     */
    this.createBulletSprite = function() {
        return new Sprite(this.rocketObject.imgUrl, [this.rocketObject.position.x, this.rocketObject.position.y], [10, 20]);
    };
    
    /**
     * Выстрел игрока 
     */
    this.fire = function(){
        sound.shot().play();
        
        var x = this.position.x + this.sprite.size[0] / 2 - 10;
        var y = this.position.y - 5;
        
        this.bullets.push({ 
                position: {x: x, y: y},
                dir: 'up',
                sprite: this.createBulletSprite() 
            });
         
        if(this.bonuse && this.bonuse.fireBullets > 1) {
            if(this.bonuse.fireBullets == 3) {
                this.bullets.push({ 
                   position: {x: x-15, y: y+10},
                   dir: 'up',
                   sprite: this.createBulletSprite() 
                });
               
                this.bullets.push({ 
                   position: {x: x+15, y: y+10},
                   dir: 'up',
                   sprite: this.createBulletSprite()
                });
            }
            
            if(this.bonuse.fireBullets == 5) {
                this.bullets.push({ position: {x: x-15, y: y+10},
                   dir: 'up',
                   sprite: this.createBulletSprite() 
                });
                this.bullets.push({ position: {x: x-30, y: y+10},
                   dir: 'up',
                   sprite: this.createBulletSprite()
                });
                this.bullets.push({ position: {x: x+15, y: y+10},
                   dir: 'up',
                   sprite: this.createBulletSprite()
                });
               
                this.bullets.push({ position: {x: x+30, y: y+10},
                   dir: 'up',
                   sprite: this.createBulletSprite()
                });
            }
        }
        this.lastFire = Date.now();
    };
    
    this.updateBulets = function(dt) {
        for(var i=0; i<this.bullets.length; i++) {
        var bullet = this.bullets[i];

        switch(bullet.dir) {
        case 'up': bullet.position.y -= this.bulletSpeed * dt; break;
        case 'down': bullet.position.y += this.bulletSpeed * dt; break;
        default:
            bullet.position.x += this.bulletSpeed * dt;
        }

        // Remove the bullet if it goes offscreen
        if(
           bullet.position.y < 0 
           || bullet.position.y > canvas.height 
           || bullet.position.x > canvas.width) 
        {
            this.bullets.splice(i, 1);
            i--;
        }
    }
    };
    
    function getCurrentPlayer() {
        var currentPlayerPlainNumber = 0;    
        if(localStorage.getItem("currentPlayerPlainNumber")) {
           currentPlayerPlainNumber = localStorage.getItem("currentPlayerPlainNumber");
        } 

        return playerList[currentPlayerPlainNumber];
    }
    
    this.init = function() {
        var currentConf = getCurrentPlayer();
        
        this.life = currentConf.life;
        this.speed = currentConf.speed;
        this.bulletSpeed = currentConf.bulletSpeed;
        this.spriteProperties.imgUrl = currentConf.spriteImg;
        
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
    };
   
    this.init();
    
    return this;
};
 

